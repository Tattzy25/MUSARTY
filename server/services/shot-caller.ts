/**
 * SHOT CALLER - The Main API Request Handler
 *
 * This is the orchestrator that decides:
 * 1. Which group the model belongs to
 * 2. Whether to use BYOK or vault keys
 * 3. How to meter and charge usage
 * 4. Which provider to route to
 */

import {
  getModelGroup,
  getModelInfo,
  getModelProvider,
  isByokUnlimited,
  isAlwaysMetered,
} from "../config/model-groups";
import { getSmartKey, trackKeyUsage } from "./vault_musarty";

export interface GenerationRequest {
  user_id: string;
  model_id: string;
  input: string | object;
  byok: boolean;
  user_api_key?: string;
  estimated_chars?: number;
  content_type?: "text" | "image" | "video" | "music";
}

export interface GenerationResponse {
  success: boolean;
  data?: {
    content: string;
    model_used: string;
    provider_used: string;
    processing_time: number;
    chars_used: number;
    blocks_deducted: number;
    remaining_balance: number;
    key_source: "byok" | "vault";
  };
  error?: string;
  rate_limit?: {
    remaining_requests: number;
    reset_time: string;
  };
}

export interface UserUsage {
  user_id: string;
  model_id: string;
  chars_used: number;
  images_generated?: number;
  videos_generated?: number;
  music_downloads?: number;
  byok_used: boolean;
  blocks_deducted: number;
  timestamp: Date;
  key_source: "byok" | "vault";
  provider: string;
}

// In-memory usage tracking (use database in production)
const USER_USAGE_LOG: UserUsage[] = [];
const USER_BALANCES = new Map<string, number>(); // user_id -> remaining_blocks

/**
 * MAIN SHOT CALLER FUNCTION
 * This is where all AI requests come through
 */
export async function processShotCall(
  request: GenerationRequest,
): Promise<GenerationResponse> {
  console.log(`🎯 Shot Caller received request for user ${request.user_id}`);

  try {
    // 1. Validate model exists
    const modelInfo = getModelInfo(request.model_id);
    if (!modelInfo) {
      return {
        success: false,
        error: `Unknown model: ${request.model_id}`,
      };
    }

    // 2. Determine model group
    const modelGroup = getModelGroup(request.model_id);
    const provider = getModelProvider(request.model_id);

    console.log(
      `📊 Model: ${request.model_id} | Group: ${modelGroup} | Provider: ${provider}`,
    );

    // 3. Determine processing strategy
    const strategy = determineProcessingStrategy(request, modelGroup);

    // 4. Check user balance and limits
    const balanceCheck = await checkUserBalance(request.user_id, strategy);
    if (!balanceCheck.canProceed) {
      return {
        success: false,
        error: balanceCheck.reason,
        rate_limit: balanceCheck.rate_limit,
      };
    }

    // 5. Get the appropriate API key
    const keyResult = await getApiKey(request, strategy, provider);
    if (!keyResult.success) {
      return {
        success: false,
        error: keyResult.error,
      };
    }

    // 6. Process the actual AI request
    const aiResult = await executeAiRequest(
      request,
      keyResult.api_key!,
      provider,
    );
    if (!aiResult.success) {
      return {
        success: false,
        error: aiResult.error,
      };
    }

    // 7. Calculate usage and deduct blocks
    const usage = calculateUsage(request, aiResult, strategy);

    // 8. Update user balance and log usage
    await updateUserUsage(request.user_id, usage);

    // 9. Track vault key usage if needed
    if (keyResult.key_source === "vault") {
      trackKeyUsage(provider, usage.chars_used);
    }

    // 10. Return success response
    return {
      success: true,
      data: {
        content: aiResult.content!,
        model_used: request.model_id,
        provider_used: provider,
        processing_time: aiResult.processing_time!,
        chars_used: usage.chars_used,
        blocks_deducted: usage.blocks_deducted,
        remaining_balance: getUserBalance(request.user_id),
        key_source: keyResult.key_source!,
      },
    };
  } catch (error) {
    console.error("❌ Shot Caller error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

/**
 * Determine the processing strategy based on model group and BYOK status
 */
function determineProcessingStrategy(
  request: GenerationRequest,
  modelGroup: string,
): {
  use_byok: boolean;
  is_unlimited: boolean;
  is_metered: boolean;
  blocks_per_unit: number;
} {
  if (modelGroup === "group1") {
    // Group 1: Fast text models
    if (request.byok) {
      return {
        use_byok: true,
        is_unlimited: true,
        is_metered: false,
        blocks_per_unit: 0,
      };
    } else {
      return {
        use_byok: false,
        is_unlimited: false,
        is_metered: true,
        blocks_per_unit: 1, // 1 block per 1000 chars
      };
    }
  } else if (modelGroup === "group2") {
    // Group 2: Heavy models - always metered
    return {
      use_byok: request.byok,
      is_unlimited: false,
      is_metered: true,
      blocks_per_unit: 2, // 2 blocks per request
    };
  } else if (modelGroup === "specialty") {
    // Specialty: Creative models - always metered, higher cost
    return {
      use_byok: request.byok,
      is_unlimited: false,
      is_metered: true,
      blocks_per_unit: getSpecialtyBlocks(request.content_type),
    };
  }

  // Default fallback
  return {
    use_byok: false,
    is_unlimited: false,
    is_metered: true,
    blocks_per_unit: 1,
  };
}

/**
 * Get block cost for specialty models
 */
function getSpecialtyBlocks(contentType?: string): number {
  switch (contentType) {
    case "image":
      return 1; // 4 images = 1 block
    case "video":
      return 1; // 1 video = 1 block
    case "music":
      return 1; // 1 music = 1 block
    default:
      return 1;
  }
}

/**
 * Check if user can proceed with the request
 */
async function checkUserBalance(
  userId: string,
  strategy: any,
): Promise<{
  canProceed: boolean;
  reason?: string;
  rate_limit?: any;
}> {
  // If unlimited (Group 1 + BYOK), always allow
  if (strategy.is_unlimited) {
    return { canProceed: true };
  }

  // Check blocks balance
  const currentBalance = getUserBalance(userId);
  if (currentBalance < strategy.blocks_per_unit) {
    return {
      canProceed: false,
      reason: `Insufficient blocks. Need ${strategy.blocks_per_unit}, have ${currentBalance}`,
    };
  }

  // Check rate limits (implement as needed)
  const rateLimitCheck = checkRateLimit(userId);
  if (!rateLimitCheck.allowed) {
    return {
      canProceed: false,
      reason: "Rate limit exceeded",
      rate_limit: rateLimitCheck.info,
    };
  }

  return { canProceed: true };
}

/**
 * Get the appropriate API key for the request
 */
async function getApiKey(
  request: GenerationRequest,
  strategy: any,
  provider: string,
): Promise<{
  success: boolean;
  api_key?: string;
  key_source?: "byok" | "vault";
  error?: string;
}> {
  if (strategy.use_byok && request.user_api_key) {
    // Use user's own API key
    return {
      success: true,
      api_key: request.user_api_key,
      key_source: "byok",
    };
  } else {
    // Use vault key
    const vaultResult = getSmartKey(provider, request.estimated_chars || 100);
    if (vaultResult.key) {
      return {
        success: true,
        api_key: vaultResult.key,
        key_source: "vault",
      };
    } else {
      return {
        success: false,
        error: `No available ${provider} keys in vault`,
      };
    }
  }
}

/**
 * Execute the actual AI request
 */
async function executeAiRequest(
  request: GenerationRequest,
  apiKey: string,
  provider: string,
): Promise<{
  success: boolean;
  content?: string;
  processing_time?: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    // Route to appropriate provider service
    let result;
    switch (provider) {
      case "openai":
        result = await callOpenAI(request, apiKey);
        break;
      case "groq":
        result = await callGroq(request, apiKey);
        break;
      case "anthropic":
        result = await callAnthropic(request, apiKey);
        break;
      case "gemini":
        result = await callGemini(request, apiKey);
        break;
      case "stability":
        result = await callStability(request, apiKey);
        break;
      case "runway":
        result = await callRunway(request, apiKey);
        break;
      case "suno":
        result = await callSuno(request, apiKey);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      content: result,
      processing_time: processingTime,
    };
  } catch (error) {
    console.error(`❌ ${provider} request failed:`, error);
    return {
      success: false,
      error: `${provider} request failed: ${error.message}`,
    };
  }
}

/**
 * Calculate usage metrics
 */
function calculateUsage(
  request: GenerationRequest,
  aiResult: any,
  strategy: any,
): UserUsage {
  const charsUsed = request.input.toString().length;
  let blocksDeducted = 0;

  if (strategy.is_metered) {
    if (request.content_type === "text") {
      // Text: 1000 chars = 1 block
      blocksDeducted = Math.ceil(charsUsed / 1000) * strategy.blocks_per_unit;
    } else {
      // Non-text: fixed block cost
      blocksDeducted = strategy.blocks_per_unit;
    }
  }

  return {
    user_id: request.user_id,
    model_id: request.model_id,
    chars_used: charsUsed,
    images_generated: request.content_type === "image" ? 1 : 0,
    videos_generated: request.content_type === "video" ? 1 : 0,
    music_downloads: request.content_type === "music" ? 1 : 0,
    byok_used: strategy.use_byok,
    blocks_deducted: blocksDeducted,
    timestamp: new Date(),
    key_source: strategy.use_byok ? "byok" : "vault",
    provider: getModelProvider(request.model_id),
  };
}

/**
 * Update user usage and balance
 */
async function updateUserUsage(
  userId: string,
  usage: UserUsage,
): Promise<void> {
  // Log the usage
  USER_USAGE_LOG.push(usage);

  // Deduct blocks from user balance
  if (usage.blocks_deducted > 0) {
    const currentBalance = getUserBalance(userId);
    const newBalance = currentBalance - usage.blocks_deducted;
    USER_BALANCES.set(userId, Math.max(0, newBalance));
    console.log(
      `💰 User ${userId}: ${usage.blocks_deducted} blocks deducted, ${newBalance} remaining`,
    );
  }

  // Log usage for debugging
  console.log(`📝 Usage logged:`, {
    user: userId,
    model: usage.model_id,
    chars: usage.chars_used,
    blocks: usage.blocks_deducted,
    source: usage.key_source,
  });
}

/**
 * Get user's current block balance
 */
function getUserBalance(userId: string): number {
  return USER_BALANCES.get(userId) || 0;
}

/**
 * Add blocks to user balance
 */
export function addUserBlocks(userId: string, blocks: number): void {
  const currentBalance = getUserBalance(userId);
  USER_BALANCES.set(userId, currentBalance + blocks);
  console.log(`💰 Added ${blocks} blocks to user ${userId}`);
}

/**
 * Initialize user with starting balance
 */
export function initializeUser(
  userId: string,
  startingBlocks: number = 10,
): void {
  if (!USER_BALANCES.has(userId)) {
    USER_BALANCES.set(userId, startingBlocks);
    console.log(`👤 Initialized user ${userId} with ${startingBlocks} blocks`);
  }
}

/**
 * Simple rate limiting
 */
function checkRateLimit(userId: string): {
  allowed: boolean;
  info?: any;
} {
  // Basic rate limiting - 100 requests per hour
  const recentRequests = USER_USAGE_LOG.filter(
    (log) =>
      log.user_id === userId &&
      Date.now() - log.timestamp.getTime() < 60 * 60 * 1000,
  ).length;

  const maxRequestsPerHour = 100;
  const remaining = maxRequestsPerHour - recentRequests;

  return {
    allowed: recentRequests < maxRequestsPerHour,
    info: {
      remaining_requests: Math.max(0, remaining),
      reset_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  };
}

/**
 * Provider-specific API calls (REAL IMPLEMENTATIONS)
 */
async function callOpenAI(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey });

  try {
    if (request.content_type === "image") {
      // Image generation with DALL-E
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: request.input.toString(),
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });
      return response.data[0]?.url || "Image generation failed";
    } else {
      // Text generation
      const completion = await openai.chat.completions.create({
        model: request.model_id,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant. Provide clear, accurate, and helpful responses.",
          },
          {
            role: "user",
            content: request.input.toString(),
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });
      return completion.choices[0]?.message?.content || "No response generated";
    }
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

async function callGroq(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  const Groq = (await import("groq-sdk")).default;
  const groq = new Groq({ apiKey });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant powered by GROQ's lightning-fast inference. Provide clear, accurate responses.",
        },
        {
          role: "user",
          content: request.input.toString(),
        },
      ],
      model: request.model_id,
      temperature: 0.7,
      max_tokens: 2000,
    });
    return completion.choices[0]?.message?.content || "No response generated";
  } catch (error: any) {
    console.error("Groq API error:", error);
    throw new Error(`Groq API error: ${error.message}`);
  }
}

async function callAnthropic(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  try {
    // Use fetch for Anthropic API since we don't have the SDK in dependencies
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: request.model_id,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: request.input.toString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Anthropic API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.content[0]?.text || "No response generated";
  } catch (error: any) {
    console.error("Anthropic API error:", error);
    throw new Error(`Anthropic API error: ${error.message}`);
  }
}

async function callGemini(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  try {
    // Use Google Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${request.model_id}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: request.input.toString(),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return (
      data.candidates[0]?.content?.parts[0]?.text || "No response generated"
    );
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}


async function callStability(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  try {
    if (request.content_type === "image") {
      // Stability AI image generation
      const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: request.input.toString(),
                weight: 1,
              },
            ],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: 1,
            steps: 30,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Stability API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      // Return base64 image data URL
      const imageBase64 = data.artifacts[0]?.base64;
      return imageBase64
        ? `data:image/png;base64,${imageBase64}`
        : "Image generation failed";
    } else if (request.content_type === "music") {
      // For music, return a prompt (Stability doesn't do music)
      return `Enhanced music prompt: ${request.input}`;
    }

    return "Content type not supported by Stability AI";
  } catch (error: any) {
    console.error("Stability API error:", error);
    throw new Error(`Stability API error: ${error.message}`);
  }
}

async function callRunway(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  try {
    // Runway ML video generation (placeholder - they don't have public API yet)
    // Return enhanced prompt for now
    return `Enhanced video prompt for Runway ML: ${request.input}`;
  } catch (error: any) {
    console.error("Runway API error:", error);
    throw new Error(`Runway API error: ${error.message}`);
  }
}

async function callSuno(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  try {
    // Suno AI music generation (placeholder - they don't have public API yet)
    // Return enhanced prompt for now
    return `Enhanced music prompt for Suno AI: ${request.input}`;
  } catch (error: any) {
    console.error("Suno API error:", error);
    throw new Error(`Suno API error: ${error.message}`);
  }
}

/**
 * Get user usage statistics
 */
export function getUserUsageStats(userId: string): any {
  const userLogs = USER_USAGE_LOG.filter((log) => log.user_id === userId);

  return {
    total_requests: userLogs.length,
    total_chars: userLogs.reduce((sum, log) => sum + log.chars_used, 0),
    total_blocks_used: userLogs.reduce(
      (sum, log) => sum + log.blocks_deducted,
      0,
    ),
    current_balance: getUserBalance(userId),
    byok_requests: userLogs.filter((log) => log.byok_used).length,
    vault_requests: userLogs.filter((log) => !log.byok_used).length,
    models_used: [...new Set(userLogs.map((log) => log.model_id))],
  };
}

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
 * Provider-specific API calls (placeholder implementations)
 */
async function callOpenAI(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  // Implement OpenAI API call
  return `OpenAI response for: ${request.input}`;
}

async function callGroq(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  // Implement Groq API call
  return `Groq response for: ${request.input}`;
}

async function callAnthropic(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  // Implement Anthropic API call
  return `Anthropic response for: ${request.input}`;
}

async function callGemini(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  // Implement Gemini API call
  return `Gemini response for: ${request.input}`;
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

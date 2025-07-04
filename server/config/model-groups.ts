/**
 * MUSARTY MODEL GROUPS CONFIGURATION
 *
 * This file defines which AI models belong to which processing groups.
 * The backend automatically determines group based on model_id.
 * Users never choose groups - the system does it silently.
 */

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  pricing: string;
  speed: "Lightning" | "Fast" | "Standard" | "Slow";
  quality: "Exceptional" | "Excellent" | "Good" | "Basic";
  category: string;
}

/**
 * GROUP 1: Fast Text, Daily Hustle, Low-Cost
 * - Unlimited BYOK for text generation
 * - Fast, cheap models for daily use
 * - If BYOK=true: unlimited text generation
 * - If BYOK=false: uses vault keys + metered
 */
export const GROUP1_MODELS: ModelInfo[] = [
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Groq Llama 4 Scout",
    provider: "groq",
    pricing: "$0.30/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    category: "Speed Demon",
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "Groq Llama 3.3 70B",
    provider: "groq",
    pricing: "$0.30/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    category: "Speed Demon",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    pricing: "$5.00/M tokens",
    speed: "Fast",
    quality: "Excellent",
    category: "Industry Standard",
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    pricing: "$0.10/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    category: "Rising Star",
  },
  {
    id: "nova-lite",
    name: "Amazon Nova Lite",
    provider: "amazon",
    pricing: "$0.06/M tokens",
    speed: "Lightning",
    quality: "Good",
    category: "Budget King",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "deepseek",
    pricing: "$0.14/M tokens",
    speed: "Fast",
    quality: "Exceptional",
    category: "Reasoning Beast",
  },
  {
    id: "codestral-25.01",
    name: "Mistral Codestral",
    provider: "mistral",
    pricing: "$0.30/M tokens",
    speed: "Lightning",
    quality: "Exceptional",
    category: "Code Beast",
  },
  {
    id: "morph-v2",
    name: "Morph V2",
    provider: "morph",
    pricing: "$0.90/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    category: "Code Applier",
  },
  {
    id: "grok-3-mini-beta",
    name: "xAI Grok 3 Mini",
    provider: "xai",
    pricing: "$0.30/M tokens",
    speed: "Fast",
    quality: "Excellent",
    category: "Thinking Machine",
  },
  {
    id: "meta-llama/Llama-3.3-70B",
    name: "Together AI Llama",
    provider: "together",
    pricing: "$0.20/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    category: "Open Source King",
  },
];

/**
 * GROUP 2: Heavy Assets, Complex Chains, Real Compute Burn
 * - Always metered (BYOK doesn't matter for unlimited)
 * - Complex reasoning and premium models
 * - Always deduct blocks regardless of BYOK status
 */
export const GROUP2_MODELS: ModelInfo[] = [
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Reasoning Master",
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Reasoning Master",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    pricing: "$5.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Industry Standard",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    pricing: "$5.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Industry Standard",
  },
  {
    id: "gemini-1.5-pro-002",
    name: "Gemini 1.5 Pro",
    provider: "gemini",
    pricing: "$0.10/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    category: "Rising Star",
  },
  {
    id: "magistral-medium-2506",
    name: "Mistral Magistral",
    provider: "mistral",
    pricing: "$2.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Reasoning Master",
  },
  {
    id: "pixtral-large",
    name: "Mistral Pixtral",
    provider: "mistral",
    pricing: "$2.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Vision Master",
  },
  {
    id: "sonar-pro",
    name: "Perplexity Sonar Pro",
    provider: "perplexity",
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Excellent",
    category: "Search Master",
  },
  {
    id: "v0-1.5-lg",
    name: "v0 1.5 Large",
    provider: "vercel",
    pricing: "$2.00/M tokens",
    speed: "Fast",
    quality: "Exceptional",
    category: "UI Specialist",
  },
];

/**
 * SPECIALTY MODELS: Creative & Visual Heavy
 * - ALWAYS metered (no BYOK free ride EVER)
 * - Each click burns credits regardless of BYOK status
 * - Premium creative models
 */
export const SPECIALTY_MODELS: ModelInfo[] = [
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "openai",
    pricing: "$3.00/M tokens",
    speed: "Fast",
    quality: "Exceptional",
    category: "Image Master",
  },
  {
    id: "midjourney-v6",
    name: "Midjourney v6",
    provider: "midjourney",
    pricing: "$4.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Image Master",
  },
  {
    id: "sdxl-1.0",
    name: "Stability SDXL",
    provider: "stability",
    pricing: "$1.50/M tokens",
    speed: "Fast",
    quality: "Excellent",
    category: "Image Master",
  },
  {
    id: "runway-gen3",
    name: "Runway Gen3",
    provider: "runway",
    pricing: "$5.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Video Wizard",
  },
  {
    id: "suno-v3",
    name: "Suno v3",
    provider: "suno",
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    category: "Creative Master",
  },
];

/**
 * UTILITY FUNCTIONS
 */

// Create lookup maps for fast checking
export const GROUP1_IDS = new Set(GROUP1_MODELS.map((m) => m.id));
export const GROUP2_IDS = new Set(GROUP2_MODELS.map((m) => m.id));
export const SPECIALTY_IDS = new Set(SPECIALTY_MODELS.map((m) => m.id));

// All models combined
export const ALL_MODELS = [
  ...GROUP1_MODELS,
  ...GROUP2_MODELS,
  ...SPECIALTY_MODELS,
];
export const ALL_MODEL_IDS = new Set(ALL_MODELS.map((m) => m.id));

/**
 * Determine which group a model belongs to
 */
export function getModelGroup(
  modelId: string,
): "group1" | "group2" | "specialty" | "unknown" {
  if (GROUP1_IDS.has(modelId)) return "group1";
  if (GROUP2_IDS.has(modelId)) return "group2";
  if (SPECIALTY_IDS.has(modelId)) return "specialty";
  return "unknown";
}

/**
 * Get model info by ID
 */
export function getModelInfo(modelId: string): ModelInfo | null {
  return ALL_MODELS.find((m) => m.id === modelId) || null;
}

/**
 * Check if BYOK provides unlimited access for this model
 */
export function isByokUnlimited(modelId: string): boolean {
  // Only Group 1 models get unlimited BYOK for text
  return GROUP1_IDS.has(modelId);
}

/**
 * Check if model is always metered (regardless of BYOK)
 */
export function isAlwaysMetered(modelId: string): boolean {
  // Group 2 and Specialty models are always metered
  return GROUP2_IDS.has(modelId) || SPECIALTY_IDS.has(modelId);
}

/**
 * Get provider from model ID
 */
export function getModelProvider(modelId: string): string {
  const model = getModelInfo(modelId);
  return model?.provider || "unknown";
}

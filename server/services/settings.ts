import { z } from "zod";

export const SettingsSchema = z.object({
  // API Keys for different providers
  groqApiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
  geminiApiKey: z.string().optional(),

  // AI Configuration
  aiProvider: z.string().default("groq"),
  aiModel: z.string().default("meta-llama/llama-4-scout-17b-16e-instruct"),
  codeStyle: z.string().default("modern"),
  optimization: z.string().default("balanced"),
  includeComments: z.boolean().default(true),
  generateTypeScript: z.boolean().default(true),
  includeTailwind: z.boolean().default(true),
  responsiveDesign: z.boolean().default(true),
  accessibilityFeatures: z.boolean().default(true),
  performanceOptimization: z.boolean().default(true),
  notifications: z.boolean().default(true),
  qualityLevel: z.number().min(50).max(100).default(85),
  processingSpeed: z.number().min(30).max(100).default(70),
});

export type AppSettings = z.infer<typeof SettingsSchema>;

// In-memory storage for settings (in production, use a database)
let appSettings: AppSettings = {
  aiProvider: "groq",
  aiModel: "meta-llama/llama-4-scout-17b-16e-instruct",
  codeStyle: "modern",
  optimization: "balanced",
  includeComments: true,
  generateTypeScript: true,
  includeTailwind: true,
  responsiveDesign: true,
  accessibilityFeatures: true,
  performanceOptimization: true,
  notifications: true,
  qualityLevel: 85,
  processingSpeed: 70,
};

export function getSettings(): AppSettings {
  return { ...appSettings };
}

export function updateSettings(newSettings: Partial<AppSettings>): AppSettings {
  appSettings = { ...appSettings, ...newSettings };
  return { ...appSettings };
}

export function getApiKey(provider: string): string | undefined {
  switch (provider) {
    case "groq":
      return appSettings.groqApiKey;
    case "openai":
      return appSettings.openaiApiKey;
    case "gemini":
      return appSettings.geminiApiKey;
    default:
      return undefined;
  }
}

export function hasApiKey(provider: string): boolean {
  const key = getApiKey(provider);
  return !!key && key.length > 0;
}

export function getCurrentProvider(): string {
  return appSettings.aiProvider;
}

export function getAllApiKeys(): Record<string, string | undefined> {
  return {
    groq: appSettings.groqApiKey,
    openai: appSettings.openaiApiKey,
    gemini: appSettings.geminiApiKey,
  };
}

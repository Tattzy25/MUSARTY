import { z } from "zod";

export const SettingsSchema = z.object({
  openaiApiKey: z.string().optional(),
  aiModel: z.string().default("gpt-4-vision-preview"),
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
  aiModel: "gpt-4-vision-preview",
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

export function getApiKey(): string | undefined {
  return appSettings.openaiApiKey;
}

export function hasApiKey(): boolean {
  return !!appSettings.openaiApiKey && appSettings.openaiApiKey.length > 0;
}

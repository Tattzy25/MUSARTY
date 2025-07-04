import { RequestHandler } from "express";
import { z } from "zod";
import {
  getSettings,
  updateSettings,
  SettingsSchema,
  type AppSettings,
} from "../services/settings";
import {
  initializeProvider,
  validateApiKey,
  AI_PROVIDERS,
} from "../services/ai-providers";

export interface SettingsResponse {
  success: boolean;
  data?: AppSettings;
  error?: string;
}

export interface ApiKeyTestResponse {
  success: boolean;
  valid?: boolean;
  error?: string;
}

// GET /api/settings
export const handleGetSettings: RequestHandler = async (req, res) => {
  try {
    const settings = getSettings();

    // Don't send the API keys back to the client for security
    const safeSettings = { ...settings };
    delete safeSettings.groqApiKey;
    delete safeSettings.anthropicApiKey;
    delete safeSettings.geminiApiKey;

    const response: SettingsResponse = {
      success: true,
      data: {
        ...safeSettings,
        groqApiKey: settings.groqApiKey ? "***configured***" : undefined,
        anthropicApiKey: settings.anthropicApiKey
          ? "***configured***"
          : undefined,
        geminiApiKey: settings.geminiApiKey ? "***configured***" : undefined,
        availableProviders: AI_PROVIDERS,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get settings",
    } as SettingsResponse);
  }
};

// POST /api/settings
export const handleUpdateSettings: RequestHandler = async (req, res) => {
  try {
    const validatedSettings = SettingsSchema.partial().parse(req.body);

    // Validate API keys if being updated
    const apiKeyUpdates = [
      "groqApiKey",
      "anthropicApiKey",
      "geminiApiKey",
    ] as const;

    for (const keyField of apiKeyUpdates) {
      if (validatedSettings[keyField]) {
        const provider = keyField.replace("ApiKey", "");
        const isValid = await validateApiKey(
          provider,
          validatedSettings[keyField]!,
        );
        if (!isValid) {
          return res.status(400).json({
            success: false,
            error: `Invalid ${provider} API key`,
          } as SettingsResponse);
        }

        // Initialize provider with the new key
        initializeProvider(provider, validatedSettings[keyField]!);
      }
    }

    const updatedSettings = updateSettings(validatedSettings);

    // Don't send the API keys back to the client
    const safeSettings = { ...updatedSettings };
    delete safeSettings.groqApiKey;
    delete safeSettings.anthropicApiKey;
    delete safeSettings.geminiApiKey;

    const response: SettingsResponse = {
      success: true,
      data: {
        ...safeSettings,
        groqApiKey: updatedSettings.groqApiKey ? "***configured***" : undefined,
        anthropicApiKey: updatedSettings.anthropicApiKey
          ? "***configured***"
          : undefined,
        geminiApiKey: updatedSettings.geminiApiKey
          ? "***configured***"
          : undefined,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(400).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update settings",
    } as SettingsResponse);
  }
};

// POST /api/settings/test-api-key
export const handleTestApiKey: RequestHandler = async (req, res) => {
  try {
    const { provider, apiKey } = z
      .object({
        provider: z.string(),
        apiKey: z.string(),
      })
      .parse(req.body);

    const isValid = await validateApiKey(provider, apiKey);

    const response: ApiKeyTestResponse = {
      success: true,
      valid: isValid,
    };

    res.json(response);
  } catch (error) {
    console.error("Error testing API key:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to test API key",
    } as ApiKeyTestResponse);
  }
};

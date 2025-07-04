import { RequestHandler } from "express";
import { z } from "zod";
import {
  getSettings,
  updateSettings,
  SettingsSchema,
  type AppSettings,
} from "../services/settings";
import { initializeOpenAI, validateApiKey } from "../services/openai";

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

    // Don't send the API key back to the client for security
    const safeSettings = { ...settings };
    delete safeSettings.openaiApiKey;

    const response: SettingsResponse = {
      success: true,
      data: {
        ...safeSettings,
        openaiApiKey: settings.openaiApiKey ? "***configured***" : undefined,
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

    // If API key is being updated, validate it
    if (validatedSettings.openaiApiKey) {
      const isValid = await validateApiKey(validatedSettings.openaiApiKey);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: "Invalid OpenAI API key",
        } as SettingsResponse);
      }

      // Initialize OpenAI with the new key
      initializeOpenAI(validatedSettings.openaiApiKey);
    }

    const updatedSettings = updateSettings(validatedSettings);

    // Don't send the API key back to the client
    const safeSettings = { ...updatedSettings };
    delete safeSettings.openaiApiKey;

    const response: SettingsResponse = {
      success: true,
      data: {
        ...safeSettings,
        openaiApiKey: updatedSettings.openaiApiKey
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
    const { apiKey } = z.object({ apiKey: z.string() }).parse(req.body);

    const isValid = await validateApiKey(apiKey);

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

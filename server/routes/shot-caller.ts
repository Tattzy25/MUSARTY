/**
 * SHOT CALLER API ROUTES
 *
 * Main API endpoints for AI generation requests.
 * All AI requests flow through these endpoints.
 */

import { RequestHandler } from "express";
import {
  processShotCall,
  initializeUser,
  addUserBlocks,
  getUserUsageStats,
  GenerationRequest,
} from "../services/shot-caller";
import { getVaultStats } from "../services/vault_musarty";
import {
  ALL_MODELS,
  getModelGroup,
  getModelInfo,
} from "../config/model-groups";

/**
 * Main AI generation endpoint
 * POST /api/generate
 */
export const handleGeneration: RequestHandler = async (req, res) => {
  try {
    const request: GenerationRequest = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Validate required fields
    if (!request.model_id || !request.input) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: model_id, input",
      });
    }

    // Use authenticated user's ID
    request.user_id = user.id;

    // Initialize user if first time
    initializeUser(request.user_id);

    // Set defaults
    request.byok = request.byok || false;
    request.estimated_chars =
      request.estimated_chars || request.input.toString().length;

    // Process the request through Shot Caller
    const result = await processShotCall(request);

    // Return result with appropriate status code
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("❌ Generation endpoint error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

/**
 * Get available models
 * GET /api/models
 */
export const handleGetModels: RequestHandler = (req, res) => {
  try {
    const modelsWithGroups = ALL_MODELS.map((model) => ({
      ...model,
      group: getModelGroup(model.id),
    }));

    res.json({
      success: true,
      data: {
        models: modelsWithGroups,
        total_count: ALL_MODELS.length,
        groups: {
          group1: modelsWithGroups.filter((m) => m.group === "group1").length,
          group2: modelsWithGroups.filter((m) => m.group === "group2").length,
          specialty: modelsWithGroups.filter((m) => m.group === "specialty")
            .length,
        },
      },
    });
  } catch (error) {
    console.error("❌ Get models error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch models",
    });
  }
};

/**
 * Get specific model info
 * GET /api/models/:modelId
 */
export const handleGetModel: RequestHandler = (req, res) => {
  try {
    const { modelId } = req.params;
    const model = getModelInfo(modelId);

    if (!model) {
      return res.status(404).json({
        success: false,
        error: "Model not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...model,
        group: getModelGroup(model.id),
      },
    });
  } catch (error) {
    console.error("❌ Get model error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch model",
    });
  }
};

/**
 * Get user usage statistics
 * GET /api/users/:userId/usage
 */
export const handleGetUserUsage: RequestHandler = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const stats = getUserUsageStats(user.id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Get user usage error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user usage",
    });
  }
};

/**
 * Add blocks to user (admin/purchase endpoint)
 * POST /api/users/:userId/blocks
 */
export const handleAddUserBlocks: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { blocks, reason } = req.body;

    if (!blocks || blocks <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid blocks amount",
      });
    }

    addUserBlocks(userId, blocks);

    console.log(
      `💰 Added ${blocks} blocks to user ${userId}. Reason: ${reason || "Manual"}`,
    );

    res.json({
      success: true,
      data: {
        blocks_added: blocks,
        reason: reason || "Manual addition",
        new_stats: getUserUsageStats(userId),
      },
    });
  } catch (error) {
    console.error("❌ Add blocks error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add blocks",
    });
  }
};

/**
 * Initialize new user
 * POST /api/users/initialize
 */
export const handleInitializeUser: RequestHandler = (req, res) => {
  try {
    const user = req.user;
    const { starting_blocks } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Give new users 10 blocks to start (3 free generations)
    const blocks = starting_blocks || 10;
    initializeUser(user.id, blocks);

    res.json({
      success: true,
      data: {
        user_id: user.id,
        starting_blocks: blocks,
        message: "User initialized successfully",
        stats: getUserUsageStats(user.id),
      },
    });
  } catch (error) {
    console.error("❌ Initialize user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to initialize user",
    });
  }
};

/**
 * Get vault statistics (admin endpoint)
 * GET /api/vault/stats
 */
export const handleGetVaultStats: RequestHandler = (req, res) => {
  try {
    const stats = getVaultStats();

    res.json({
      success: true,
      data: {
        vault_stats: stats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Get vault stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch vault stats",
    });
  }
};

/**
 * Health check endpoint
 * GET /api/health
 */
export const handleHealthCheck: RequestHandler = (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    shot_caller: "operational",
    vault: "operational",
  });
};

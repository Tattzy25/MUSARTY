import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleConvert, uploadMiddleware } from "./routes/convert";
import {
  handleGetSettings,
  handleUpdateSettings,
  handleTestApiKey,
} from "./routes/settings";
import { generateContent } from "./routes/generate";
import {
  handleGetPricing,
  handleCheckout,
  handleGetSubscription,
  handleCompletePayment,
} from "./routes/checkout";
import { Database } from "./db/neon.js";
import {
  handleGeneration,
  handleGetModels,
  handleGetModel,
  handleGetUserUsage,
  handleAddUserBlocks,
  handleInitializeUser,
  handleGetVaultStats,
  handleHealthCheck,
} from "./routes/shot-caller";

export function createServer() {
  const app = express();

  // Initialize database
  Database.init().catch(console.error);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/convert", uploadMiddleware, handleConvert);

  // Neon City generation route
  app.post("/api/generate", generateContent);

  // Settings routes
  app.get("/api/settings", handleGetSettings);
  app.post("/api/settings", handleUpdateSettings);
  app.post("/api/settings/test-api-key", handleTestApiKey);

  // Pricing and checkout routes
  app.get("/api/pricing", handleGetPricing);
  app.post("/api/checkout", handleCheckout);
  app.post("/api/checkout/complete", handleCompletePayment);
  app.get("/api/subscription/:userId", handleGetSubscription);

  // Shot Caller routes (main AI generation system)
  app.post("/api/shot-caller/generate", handleGeneration);
  app.get("/api/models", handleGetModels);
  app.get("/api/models/:modelId", handleGetModel);
  app.get("/api/users/:userId/usage", handleGetUserUsage);
  app.post("/api/users/:userId/blocks", handleAddUserBlocks);
  app.post("/api/users/initialize", handleInitializeUser);
  app.get("/api/vault/stats", handleGetVaultStats);
  app.get("/api/health", handleHealthCheck);

  return app;
}

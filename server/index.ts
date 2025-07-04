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
} from "./routes/checkout";

export function createServer() {
  const app = express();

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

  return app;
}

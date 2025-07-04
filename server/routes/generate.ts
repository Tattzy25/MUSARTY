import { RequestHandler } from "express";
import { z } from "zod";
import {
  generateTextWithGroq,
  generateImagePromptWithGroq,
  generateVideoPromptWithGroq,
  generateCodeWithGroq,
} from "../services/groq-provider";
import {
  generateTextWithOpenAI,
  generateImageWithOpenAI,
  generateImagePromptWithOpenAI,
  generateVideoPromptWithOpenAI,
  generateCodeWithOpenAI,
} from "../services/openai-provider";
import { generateMusicWithStability } from "../services/stability-provider";

const GenerateRequestSchema = z.object({
  mode: z.enum(["text", "image", "video", "music", "code"]),
  prompt: z.string().min(1, "Prompt is required"),
  provider: z.enum(["groq", "openai", "stability"]).default("groq"),
  files: z.array(z.string()).optional(), // For file uploads
});

export interface GenerateResponse {
  success: boolean;
  data?: {
    content: string;
    type: string;
    downloadUrl?: string;
    metadata?: any;
  };
  error?: string;
}

export const generateContent: RequestHandler<
  {},
  GenerateResponse,
  z.infer<typeof GenerateRequestSchema>
> = async (req, res) => {
  try {
    const { mode, prompt, provider, files } = GenerateRequestSchema.parse(
      req.body,
    );

    let result: any;

    // Route to specific provider based on mode and preference
    // NO FALLBACKS - if it fails, it fails
    switch (mode) {
      case "text":
        if (provider === "groq") {
          result = await generateTextWithGroq(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "text",
            },
          });
        } else if (provider === "openai") {
          result = await generateTextWithOpenAI(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "text",
            },
          });
        } else {
          throw new Error(
            `Provider ${provider} not supported for text generation`,
          );
        }
        break;

      case "image":
        if (provider === "groq") {
          // GROQ generates enhanced prompts for image generation
          result = await generateImagePromptWithGroq(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "image_prompt",
            },
          });
        } else if (provider === "openai") {
          // OpenAI can generate actual images with DALL-E
          result = await generateImageWithOpenAI(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "image_url",
              downloadUrl: result,
            },
          });
        } else {
          throw new Error(
            `Provider ${provider} not supported for image generation`,
          );
        }
        break;

      case "video":
        if (provider === "groq") {
          result = await generateVideoPromptWithGroq(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "video_prompt",
            },
          });
        } else if (provider === "openai") {
          result = await generateVideoPromptWithOpenAI(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "video_prompt",
            },
          });
        } else {
          throw new Error(
            `Provider ${provider} not supported for video generation`,
          );
        }
        break;

      case "music":
        if (provider === "stability") {
          result = await generateMusicWithStability(prompt);
          res.json({
            success: true,
            data: {
              content: result.lyrics,
              type: "music",
              downloadUrl: result.audioUrl,
              metadata: result.metadata,
            },
          });
        } else {
          throw new Error(
            `Only Stability AI is supported for music generation`,
          );
        }
        break;

      case "code":
        if (provider === "groq") {
          result = await generateCodeWithGroq(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "code",
            },
          });
        } else if (provider === "openai") {
          result = await generateCodeWithOpenAI(prompt);
          res.json({
            success: true,
            data: {
              content: result,
              type: "code",
            },
          });
        } else {
          throw new Error(
            `Provider ${provider} not supported for code generation`,
          );
        }
        break;

      default:
        throw new Error(`Unsupported mode: ${mode}`);
    }
  } catch (error) {
    console.error("Generation error:", error);

    // NO FALLBACKS - Return the actual error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

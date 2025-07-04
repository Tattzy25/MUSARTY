import { RequestHandler } from "express";
import { z } from "zod";
import OpenAI from "openai";
import Groq from "groq-sdk";

// Lazy initialize API clients to avoid import-time errors
let groq: Groq | null = null;
let openai: OpenAI | null = null;

function getGroq() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || "",
    });
  }
  return groq;
}

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }
  return openai;
}

const GenerateRequestSchema = z.object({
  mode: z.enum(["text", "image", "video", "music", "code"]),
  prompt: z.string().min(1, "Prompt is required"),
  provider: z.enum(["groq", "openai"]).default("groq"),
});

export interface GenerateResponse {
  success: boolean;
  data?: {
    content: string;
    type: string;
    downloadUrl?: string;
  };
  error?: string;
}

export const generateContent: RequestHandler<
  {},
  GenerateResponse,
  z.infer<typeof GenerateRequestSchema>
> = async (req, res) => {
  try {
    const { mode, prompt, provider } = GenerateRequestSchema.parse(req.body);

    let result: string;

    // Route to appropriate AI based on mode and provider
    switch (mode) {
      case "text":
        result = await generateText(prompt, provider);
        break;
      case "image":
        result = await generateImagePrompt(prompt, provider);
        break;
      case "video":
        result = await generateVideoPrompt(prompt, provider);
        break;
      case "music":
        result = await generateMusicPrompt(prompt, provider);
        break;
      case "code":
        result = await generateCode(prompt, provider);
        break;
      default:
        throw new Error(`Unsupported mode: ${mode}`);
    }

    res.json({
      success: true,
      data: {
        content: result,
        type: mode,
      },
    });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Text generation with GROQ (fast) or OpenAI (quality)
async function generateText(prompt: string, provider: string): Promise<string> {
  if (provider === "groq") {
    const completion = await getGroq().chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant. Provide clear, concise, and helpful responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "No response generated";
  } else {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant. Provide clear, concise, and helpful responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "No response generated";
  }
}

// Image generation prompts (enhanced by AI)
async function generateImagePrompt(
  prompt: string,
  provider: string,
): Promise<string> {
  const systemPrompt = `You are an expert at creating detailed image generation prompts. Take the user's idea and enhance it into a detailed, artistic prompt suitable for AI image generation. Include:
- Style and mood
- Colors and lighting
- Composition details
- Technical parameters
- Artistic references if relevant

Return only the enhanced prompt, nothing else.`;

  if (provider === "groq") {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Enhanced image prompt not generated"
    );
  } else {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Enhanced image prompt not generated"
    );
  }
}

// Video generation prompts
async function generateVideoPrompt(
  prompt: string,
  provider: string,
): Promise<string> {
  const systemPrompt = `You are an expert at creating video generation prompts. Transform the user's idea into a detailed video prompt including:
- Scene description
- Camera movements
- Duration and pacing
- Visual style
- Transitions
- Audio considerations

Return only the enhanced video prompt.`;

  if (provider === "groq") {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 600,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Enhanced video prompt not generated"
    );
  } else {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 600,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Enhanced video prompt not generated"
    );
  }
}

// Music generation prompts
async function generateMusicPrompt(
  prompt: string,
  provider: string,
): Promise<string> {
  const systemPrompt = `You are an expert at creating music generation prompts. Transform the user's idea into a detailed music prompt including:
- Genre and style
- Instruments and arrangement
- Mood and energy
- Tempo and key
- Duration
- Musical structure

Return only the enhanced music prompt.`;

  if (provider === "groq") {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Enhanced music prompt not generated"
    );
  } else {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Enhanced music prompt not generated"
    );
  }
}

// Code generation
async function generateCode(prompt: string, provider: string): Promise<string> {
  const systemPrompt = `You are an expert web developer. Generate clean, modern React/Next.js code based on the user's request. Include:
- Proper TypeScript if applicable
- Tailwind CSS for styling
- Responsive design
- Accessibility features
- Clean, commented code

Return only the code, properly formatted.`;

  if (provider === "groq") {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || "Code not generated";
  } else {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || "Code not generated";
  }
}

import Groq from "groq-sdk";
import OpenAI from "openai";

export interface ConversionSettings {
  provider: string;
  model: string;
  codeStyle: string;
  generateTypeScript: boolean;
  includeTailwind: boolean;
  responsiveDesign: boolean;
  accessibilityFeatures: boolean;
  performanceOptimization: boolean;
  includeComments: boolean;
  qualityLevel: number;
}

export interface ConversionResult {
  react: string;
  html: string;
  css: string;
  fileName: string;
}

export interface AIProvider {
  name: string;
  models: string[];
  requiresApiKey: boolean;
}

export const AI_PROVIDERS: Record<string, AIProvider> = {
  openai: {
    name: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4-vision-preview"],
    requiresApiKey: true,
  },
  groq: {
    name: "Groq",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.2-90b-vision-preview",
      "llama-3.2-11b-vision-preview",
    ],
    requiresApiKey: true,
  },
  anthropic: {
    name: "Anthropic",
    models: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
    ],
    requiresApiKey: true,
  },
  gemini: {
    name: "Google Gemini",
    models: [
      "gemini-1.5-pro-002",
      "gemini-1.5-flash-002",
      "gemini-2.0-flash-exp",
    ],
    requiresApiKey: true,
  },
};

let openaiClient: OpenAI | null = null;
let groqClient: Groq | null = null;
const apiKeys: Record<string, string> = {};

export function initializeProvider(provider: string, apiKey: string) {
  apiKeys[provider] = apiKey;

  if (provider === "openai") {
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  } else if (provider === "groq") {
    groqClient = new Groq({
      apiKey: apiKey,
    });
  }
  // Add other providers here
}

export function isProviderInitialized(provider: string): boolean {
  if (provider === "openai") {
    return openaiClient !== null;
  } else if (provider === "groq") {
    return groqClient !== null;
  }
  return false;
}

export async function convertImageToCode(
  imageBase64: string,
  fileName: string,
  settings: ConversionSettings,
): Promise<ConversionResult> {
  const { provider } = settings;

  if (!isProviderInitialized(provider)) {
    const apiKey = apiKeys[provider];
    if (!apiKey) {
      throw new Error(
        `${AI_PROVIDERS[provider]?.name || provider} API key not configured. Please add your API key in settings.`,
      );
    }
    initializeProvider(provider, apiKey);
  }

  const componentName = sanitizeComponentName(fileName);

  switch (provider) {
    case "openai":
      return await convertWithOpenAI(imageBase64, componentName, settings);
    case "groq":
      return await convertWithGroq(imageBase64, componentName, settings);
    default:
      throw new Error(`Provider ${provider} not implemented yet`);
  }
}

async function convertWithOpenAI(
  imageBase64: string,
  componentName: string,
  settings: ConversionSettings,
): Promise<ConversionResult> {
  if (!openaiClient) {
    throw new Error("OpenAI client not initialized");
  }

  const systemPrompt = createSystemPrompt(settings);
  const userPrompt = createUserPrompt(componentName, settings);

  try {
    const response = await openaiClient.chat.completions.create({
      model: settings.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: settings.qualityLevel > 80 ? "high" : "low",
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return parseAIResponse(content, componentName);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error(
      `Failed to convert image with OpenAI: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

async function convertWithGroq(
  imageBase64: string,
  componentName: string,
  settings: ConversionSettings,
): Promise<ConversionResult> {
  if (!groqClient) {
    throw new Error("Groq client not initialized");
  }

  const systemPrompt = createSystemPrompt(settings);
  const userPrompt = createUserPrompt(componentName, settings);

  try {
    const response = await groqClient.chat.completions.create({
      model: settings.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from Groq");
    }

    return parseAIResponse(content, componentName);
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error(
      `Failed to convert image with Groq: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function sanitizeComponentName(fileName: string): string {
  const name = fileName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric
    .replace(/^\d+/, ""); // Remove leading numbers

  return name.charAt(0).toUpperCase() + name.slice(1) || "GeneratedComponent";
}

function createSystemPrompt(settings: ConversionSettings): string {
  return `You are an expert frontend developer and UI/UX designer. Your task is to analyze the provided image and generate clean, production-ready code that recreates the design.

CRITICAL REQUIREMENTS:
1. Generate code in THREE separate sections: REACT, HTML, and CSS
2. Each section must be clearly marked with headers: "=== REACT ===" "=== HTML ===" "=== CSS ==="
3. Code must be production-ready, clean, and well-structured
4. ${settings.generateTypeScript ? "Use TypeScript with proper type definitions" : "Use JavaScript"}
5. ${settings.includeTailwind ? "Use Tailwind CSS classes where possible" : "Use pure CSS with modern features"}
6. ${settings.responsiveDesign ? "Make the design fully responsive for all screen sizes" : "Focus on desktop design"}
7. ${settings.accessibilityFeatures ? "Include proper ARIA labels, semantic HTML, and accessibility features" : "Use standard HTML elements"}
8. ${settings.performanceOptimization ? "Optimize for performance with lazy loading, efficient CSS, and minimal re-renders" : "Focus on functionality over optimization"}
9. ${settings.includeComments ? "Include helpful comments explaining the code" : "Keep code clean without comments"}

STYLE GUIDELINES:
- Use ${settings.codeStyle} React patterns and best practices
- Create pixel-perfect recreations of the design
- Use modern CSS features like flexbox, grid, and custom properties
- Ensure cross-browser compatibility
- Follow semantic HTML structure`;
}

function createUserPrompt(
  componentName: string,
  settings: ConversionSettings,
): string {
  return `Analyze this image and generate complete, production-ready code that recreates this design exactly.

Component Name: ${componentName}

Please provide:
1. A React component (${settings.generateTypeScript ? "TypeScript" : "JavaScript"})
2. HTML markup
3. CSS styles ${settings.includeTailwind ? "(complement Tailwind with custom CSS as needed)" : "(pure CSS)"}

Requirements:
- Match the visual design exactly
- Use modern, clean code structure
- Ensure the component is reusable and well-structured
- Include proper error handling and edge cases
- Make it production-ready with no placeholder content

Return the code in this exact format:
=== REACT ===
[React component code here]

=== HTML ===
[HTML markup here]

=== CSS ===
[CSS styles here]`;
}

function parseAIResponse(
  content: string,
  componentName: string,
): ConversionResult {
  const reactMatch = content.match(
    /=== REACT ===\s*([\s\S]*?)(?=\s*=== HTML ===|$)/,
  );
  const htmlMatch = content.match(
    /=== HTML ===\s*([\s\S]*?)(?=\s*=== CSS ===|$)/,
  );
  const cssMatch = content.match(/=== CSS ===\s*([\s\S]*?)$/);

  if (!reactMatch || !htmlMatch || !cssMatch) {
    // Fallback: try to extract code blocks
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

    if (codeBlocks.length >= 3) {
      return {
        react: extractCodeFromBlock(codeBlocks[0]),
        html: extractCodeFromBlock(codeBlocks[1]),
        css: extractCodeFromBlock(codeBlocks[2]),
        fileName: componentName,
      };
    }

    throw new Error("Invalid response format from AI. Please try again.");
  }

  return {
    react: reactMatch[1].trim(),
    html: htmlMatch[1].trim(),
    css: cssMatch[1].trim(),
    fileName: componentName,
  };
}

function extractCodeFromBlock(codeBlock: string): string {
  return codeBlock
    .replace(/```[\w]*\n?/, "")
    .replace(/```$/, "")
    .trim();
}

export async function validateApiKey(
  provider: string,
  apiKey: string,
): Promise<boolean> {
  try {
    if (provider === "openai") {
      const testClient = new OpenAI({ apiKey });
      await testClient.models.list();
      return true;
    } else if (provider === "groq") {
      const testClient = new Groq({ apiKey });
      await testClient.models.list();
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

import OpenAI from "openai";

export interface ConversionSettings {
  aiModel: string;
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

let openaiClient: OpenAI | null = null;

export function initializeOpenAI(apiKey: string) {
  openaiClient = new OpenAI({
    apiKey: apiKey,
  });
}

export function isOpenAIInitialized(): boolean {
  return openaiClient !== null;
}

export async function convertImageToCode(
  imageBase64: string,
  fileName: string,
  settings: ConversionSettings,
): Promise<ConversionResult> {
  if (!openaiClient) {
    throw new Error(
      "OpenAI client not initialized. Please provide an API key in settings.",
    );
  }

  const componentName = sanitizeComponentName(fileName);

  const systemPrompt = createSystemPrompt(settings);
  const userPrompt = createUserPrompt(componentName, settings);

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4-vision-preview",
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
      `Failed to convert image: ${error instanceof Error ? error.message : "Unknown error"}`,
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

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const testClient = new OpenAI({ apiKey });
    await testClient.models.list();
    return true;
  } catch (error) {
    return false;
  }
}

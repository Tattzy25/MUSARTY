import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function generateTextWithOpenAI(prompt: string): Promise<string> {
  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI assistant powered by OpenAI. Provide clear, detailed, and insightful responses.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("OpenAI failed to generate response");
  }
  return result;
}

export async function generateImageWithOpenAI(prompt: string): Promise<string> {
  const response = await getOpenAI().images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  const imageUrl = response.data[0]?.url;
  if (!imageUrl) {
    throw new Error("OpenAI failed to generate image");
  }
  return imageUrl;
}

export async function generateImagePromptWithOpenAI(
  prompt: string,
): Promise<string> {
  const systemPrompt = `You are an expert at creating detailed image generation prompts. Transform the user's idea into a detailed, artistic prompt suitable for DALL-E 3. Include:
- Visual style and artistic approach
- Colors, lighting, and atmosphere
- Composition and framing details
- Technical quality parameters
- Artistic references if relevant

Return ONLY the enhanced prompt, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 800,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("OpenAI failed to generate image prompt");
  }
  return result;
}

export async function generateVideoPromptWithOpenAI(
  prompt: string,
): Promise<string> {
  const systemPrompt = `You are an expert at creating video generation prompts for AI video tools. Transform the user's idea into a detailed video prompt including:
- Scene description and visual narrative
- Camera movements and cinematography
- Duration and pacing suggestions
- Visual style and effects
- Transitions and motion dynamics
- Audio and music considerations

Return ONLY the enhanced video prompt, nothing else.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("OpenAI failed to generate video prompt");
  }
  return result;
}

export async function generateCodeWithOpenAI(prompt: string): Promise<string> {
  const systemPrompt = `You are an expert web developer. Generate clean, modern React/Next.js code based on the user's request. Requirements:
- Use TypeScript with proper typing
- Use Tailwind CSS for styling
- Include responsive design
- Add accessibility features (ARIA labels, semantic HTML)
- Write clean, well-documented code
- Include proper imports and exports
- Follow React best practices

Return ONLY the code, properly formatted and production-ready.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 3000,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("OpenAI failed to generate code");
  }
  return result;
}

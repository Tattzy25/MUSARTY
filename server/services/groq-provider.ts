import Groq from "groq-sdk";

let groq: Groq | null = null;

function getGroq() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is required");
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

export async function generateTextWithGroq(prompt: string): Promise<string> {
  const completion = await getGroq().chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI assistant powered by GROQ's lightning-fast inference. Provide clear, concise, and helpful responses.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2000,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("GROQ failed to generate response");
  }
  return result;
}

export async function generateImagePromptWithGroq(
  prompt: string,
): Promise<string> {
  const systemPrompt = `You are an expert at creating detailed image generation prompts. Transform the user's idea into a detailed, artistic prompt suitable for AI image generation. Include:
- Visual style and artistic approach
- Colors, lighting, and atmosphere
- Composition and framing details
- Technical parameters (aspect ratio, quality)
- Artistic references if relevant

Return ONLY the enhanced prompt, nothing else.`;

  const completion = await getGroq().chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 800,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("GROQ failed to generate image prompt");
  }
  return result;
}

export async function generateVideoPromptWithGroq(
  prompt: string,
): Promise<string> {
  const systemPrompt = `You are an expert at creating video generation prompts for AI video tools like Runway ML. Transform the user's idea into a detailed video prompt including:
- Scene description and visual narrative
- Camera movements and angles
- Duration and pacing suggestions
- Visual style and effects
- Transitions and motion
- Audio/music considerations

Return ONLY the enhanced video prompt, nothing else.`;

  const completion = await getGroq().chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 1000,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("GROQ failed to generate video prompt");
  }
  return result;
}

export async function generateCodeWithGroq(prompt: string): Promise<string> {
  const systemPrompt = `You are an expert web developer. Generate clean, modern React/Next.js code based on the user's request. Requirements:
- Use TypeScript if applicable
- Use Tailwind CSS for styling
- Include responsive design
- Add accessibility features
- Write clean, well-commented code
- Include proper imports and exports

Return ONLY the code, properly formatted and ready to use.`;

  const completion = await getGroq().chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 3000,
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error("GROQ failed to generate code");
  }
  return result;
}

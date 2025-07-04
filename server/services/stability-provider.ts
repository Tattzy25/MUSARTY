import fetch from "node-fetch";

interface MusicGenerationRequest {
  lyrics?: string;
  style?: string;
  genre?: string;
  mood?: string;
  duration?: number;
}

interface MusicGenerationResponse {
  audioUrl: string;
  lyrics: string;
  metadata: {
    style: string;
    genre: string;
    duration: number;
  };
}

export async function generateMusicWithStability(
  prompt: string,
): Promise<MusicGenerationResponse> {
  if (!process.env.STABILITY_API_KEY) {
    throw new Error("STABILITY_API_KEY environment variable is required");
  }

  // Parse the prompt to extract music parameters
  const musicParams = parseMusicPrompt(prompt);

  // For now, we'll use a text-to-music approach since Stability AI's music API
  // might have specific endpoints. This is a placeholder structure.
  const response = await fetch("https://api.stability.ai/v1/generation/audio", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      duration: musicParams.duration || 30,
      style: musicParams.style || "pop",
      genre: musicParams.genre || "electronic",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stability AI music generation failed: ${errorText}`);
  }

  const result = (await response.json()) as any;

  // This is a mock response structure - adjust based on actual Stability AI API
  return {
    audioUrl: result.audio_url || result.url,
    lyrics: musicParams.lyrics || "Generated instrumental track",
    metadata: {
      style: musicParams.style || "pop",
      genre: musicParams.genre || "electronic",
      duration: musicParams.duration || 30,
    },
  };
}

function parseMusicPrompt(prompt: string): MusicGenerationRequest {
  const params: MusicGenerationRequest = {};

  // Extract style
  const styleMatch =
    prompt.match(/style:\s*([^,\n]+)/i) ||
    prompt.match(/in the style of\s*([^,\n]+)/i);
  if (styleMatch) params.style = styleMatch[1].trim();

  // Extract genre
  const genreMatch =
    prompt.match(/genre:\s*([^,\n]+)/i) || prompt.match(/(\w+)\s*genre/i);
  if (genreMatch) params.genre = genreMatch[1].trim();

  // Extract lyrics
  const lyricsMatch =
    prompt.match(/lyrics?:\s*(.+)/i) || prompt.match(/sing about\s*(.+)/i);
  if (lyricsMatch) params.lyrics = lyricsMatch[1].trim();

  // Extract duration
  const durationMatch =
    prompt.match(/(\d+)\s*seconds?/i) || prompt.match(/duration:\s*(\d+)/i);
  if (durationMatch) params.duration = parseInt(durationMatch[1]);

  return params;
}

export async function generateMusicPromptWithAI(
  prompt: string,
): Promise<string> {
  // This could use GROQ or OpenAI to enhance the music prompt
  const enhancedPrompt = `Create a detailed music generation prompt based on: "${prompt}"
  
Include:
- Musical style and genre
- Mood and energy level
- Instrumentation suggestions
- Tempo and key recommendations
- Lyrical themes if applicable
- Duration preference

Format as a clear, detailed music generation request.`;

  return enhancedPrompt;
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Music, Play, Pause, Download, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MusicGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  result: any;
}

export default function MusicGenerator({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
  result,
}: MusicGeneratorProps) {
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [duration, setDuration] = useState("30");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = () => {
    const musicPrompt = `Generate music with the following specifications:
Style: ${style || "Not specified"}
Genre: ${genre || "Not specified"}  
Mood: ${mood || "Not specified"}
Duration: ${duration} seconds
Lyrics: ${lyrics || "Instrumental"}
Additional details: ${prompt}`;

    setPrompt(musicPrompt);
    onGenerate();
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
      {/* Music Parameters */}
      <div className="space-y-6">
        <Card className="bg-black/40 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <Music className="w-5 h-5 mr-2" />
              Music Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Genre Selection */}
            <div className="space-y-2">
              <Label className="text-white">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-black/60 border-primary/30">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="reggae">Reggae</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label className="text-white">Style</Label>
              <Input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., upbeat, mellow, energetic..."
                className="bg-black/60 border-primary/30 text-white"
              />
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label className="text-white">Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="bg-black/60 border-primary/30">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="mysterious">Mysterious</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="intense">Intense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-white">Duration (seconds)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-black/60 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lyrics */}
            <div className="space-y-2">
              <Label className="text-white">Lyrics (Optional)</Label>
              <Textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Enter lyrics or leave empty for instrumental..."
                className="bg-black/60 border-primary/30 text-white h-24"
              />
            </div>

            {/* Additional Prompt */}
            <div className="space-y-2">
              <Label className="text-white">Additional Details</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Any additional details about the music you want..."
                className="bg-black/60 border-primary/30 text-white h-16"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 h-12"
            >
              {isGenerating ? (
                <>
                  <Volume2 className="w-5 h-5 mr-2 animate-pulse" />
                  Generating Music...
                </>
              ) : (
                <>
                  <Music className="w-5 h-5 mr-2" />
                  Generate Music
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Music Player & Result */}
      <div className="space-y-6">
        <Card className="bg-black/40 border-primary/30 min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-primary">Generated Music</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-primary font-semibold">
                  Stability AI is composing your music...
                </p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Audio Player */}
                {result.downloadUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4 p-6 bg-black/60 rounded-2xl border border-primary/30">
                      <Button
                        onClick={togglePlayback}
                        className="w-16 h-16 rounded-full bg-primary/20 hover:bg-primary/30 border-2 border-primary/50"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-primary" />
                        ) : (
                          <Play className="w-8 h-8 text-primary ml-1" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="w-full h-2 bg-primary/20 rounded-full">
                          <div className="h-2 bg-primary rounded-full w-1/3"></div>
                        </div>
                      </div>
                      <Button
                        onClick={() => window.open(result.downloadUrl)}
                        className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    {/* Hidden audio element for actual playback */}
                    <audio className="hidden" controls>
                      <source src={result.downloadUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}

                {/* Lyrics & Metadata */}
                <div className="space-y-4">
                  {result.content &&
                    result.content !== "Generated instrumental track" && (
                      <div>
                        <Label className="text-primary">Lyrics</Label>
                        <div className="p-4 bg-black/60 rounded-lg border border-primary/30">
                          <p className="text-white whitespace-pre-wrap text-sm">
                            {result.content}
                          </p>
                        </div>
                      </div>
                    )}

                  {result.metadata && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-primary">Style</Label>
                        <p className="text-white capitalize">
                          {result.metadata.style}
                        </p>
                      </div>
                      <div>
                        <Label className="text-primary">Genre</Label>
                        <p className="text-white capitalize">
                          {result.metadata.genre}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <Music className="w-16 h-16 text-primary/40" />
                <p className="text-primary/60">
                  Configure your music parameters and generate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  Download,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentMode = "text" | "image" | "video" | "music" | "code";

interface ContentZone {
  id: ContentMode;
  name: string;
  icon: any;
  color: string;
  bgGradient: string;
  description: string;
  placeholder: string;
  outputType: string;
}

const CONTENT_ZONES: ContentZone[] = [
  {
    id: "text",
    name: "Text",
    icon: FileText,
    color: "from-primary to-orange-400",
    bgGradient: "bg-gradient-to-br from-primary/20 to-orange-400/20",
    description: "Ask questions, generate content, get insights",
    placeholder: "What would you like to know or create?",
    outputType: "text",
  },
  {
    id: "image",
    name: "Image",
    icon: ImageIcon,
    color: "from-pink-400 to-red-500",
    bgGradient: "bg-gradient-to-br from-pink-400/20 to-red-500/20",
    description: "Generate stunning visuals from your imagination",
    placeholder: "Describe the image you want to create...",
    outputType: "image",
  },
  {
    id: "video",
    name: "Video",
    icon: Video,
    color: "from-purple-400 to-pink-500",
    bgGradient: "bg-gradient-to-br from-purple-400/20 to-pink-500/20",
    description: "Create dynamic videos and animations",
    placeholder: "Describe your video concept...",
    outputType: "video",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "from-emerald-400 to-green-500",
    bgGradient: "bg-gradient-to-br from-emerald-400/20 to-green-500/20",
    description: "Compose original music and audio",
    placeholder: "Describe the music style and mood...",
    outputType: "audio",
  },
  {
    id: "code",
    name: "Code",
    icon: Code,
    color: "from-yellow-400 to-primary",
    bgGradient: "bg-gradient-to-br from-yellow-400/20 to-primary/20",
    description: "Generate landing pages and components",
    placeholder: "Describe the landing page you want to build...",
    outputType: "code",
  },
];

export default function NeonCity() {
  const [activeMode, setActiveMode] = useState<ContentMode | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !activeMode) return;

    setIsGenerating(true);
    // TODO: Connect to orchestrator APIs
    setTimeout(() => {
      setResult(`Generated ${activeMode} content for: ${prompt}`);
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = () => {
    if (!result) return;
    // TODO: Implement download based on output type
    console.log("Downloading:", result);
  };

  const resetMode = () => {
    setActiveMode(null);
    setPrompt("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Compact Header */}
        <div className="text-center space-y-6 py-8">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-red-500 via-pink-500 via-purple-500 to-primary bg-clip-text text-transparent animate-pulse">
              Neon City
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              🌃 **Your AI Content Generation Hub** 🌃
              <br />
              Powered by GROQ orchestration for lightning speed! ⚡
            </p>
          </div>
        </div>

        {/* 5 Mode Cards in One Row */}
        <div className="flex justify-center gap-4 mb-8">
          {CONTENT_ZONES.map((zone) => {
            const Icon = zone.icon;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveMode(zone.id)}
                className={cn(
                  "relative overflow-hidden bg-black/95 border backdrop-blur-xl transition-all duration-300 cursor-pointer group",
                  "w-24 h-24 rounded-2xl",
                  "shadow-[0_0_15px_rgba(212,172,53,0.2)] hover:shadow-[0_0_25px_rgba(212,172,53,0.4)]",
                  activeMode === zone.id
                    ? "border-primary/70 shadow-[0_0_30px_rgba(212,172,53,0.6)] scale-110"
                    : "border-primary/30 hover:border-primary/50 hover:scale-105",
                )}
              >
                {/* Gradient Accent */}
                <div
                  className={cn("absolute inset-0 opacity-10", zone.bgGradient)}
                />

                {/* Icon */}
                <div className="relative flex items-center justify-center w-full h-full">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-full bg-primary animate-pulse" />
                </div>

                {/* Label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <span
                    className={cn(
                      "text-xs font-medium bg-gradient-to-r bg-clip-text text-transparent",
                      zone.color,
                    )}
                  >
                    {zone.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Big Hero-Style Workspace */}
        {activeMode && (
          // Active Workspace
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={resetMode}
                  className="bg-black/80 border-primary/30"
                >
                  ← Back to Neon City
                </Button>
                <div className="flex items-center space-x-3">
                  {(() => {
                    const zone = CONTENT_ZONES.find((z) => z.id === activeMode);
                    const Icon = zone?.icon;
                    return (
                      <>
                        <div className="relative w-10 h-10">
                          <div
                            className={cn(
                              "absolute inset-0 rounded-lg blur-xl opacity-40",
                              zone?.color.replace("from-", "bg-").split(" ")[0],
                            )}
                          />
                          <div className="relative flex items-center justify-center w-full h-full bg-black/90 rounded-lg border border-primary/50">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <h2
                          className={cn(
                            "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                            zone?.color,
                          )}
                        >
                          {zone?.name}
                        </h2>
                      </>
                    );
                  })()}
                </div>
              </div>

              {result && (
                <Button
                  onClick={handleDownload}
                  className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            {/* Big Hero-Style Generation Interface */}
            <Card className="bg-black/95 border border-primary/30 backdrop-blur-xl shadow-[0_0_30px_rgba(212,172,53,0.5)] min-h-[500px]">
              <CardContent className="p-12 space-y-8">
                {/* Input */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-primary">
                    {
                      CONTENT_ZONES.find((z) => z.id === activeMode)
                        ?.description
                    }
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      CONTENT_ZONES.find((z) => z.id === activeMode)
                        ?.placeholder
                    }
                    className="bg-black/60 border-primary/30 text-white placeholder:text-muted-foreground resize-none h-40 text-lg p-6"
                    disabled={isGenerating}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 h-12 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate{" "}
                      {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}
                    </>
                  )}
                </Button>

                {/* Result Area */}
                {(result || isGenerating) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary">
                      Result
                    </label>
                    <div className="bg-black/60 border border-primary/30 rounded-lg p-6 min-h-[200px]">
                      {isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center space-y-4">
                            <Zap className="w-8 h-8 text-primary animate-spin mx-auto" />
                            <p className="text-muted-foreground">
                              GROQ orchestrator is working its magic...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-white">{result}</div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orchestrator Info */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>Powered by GROQ + Claude orchestration</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            All API keys secured in Settings • Lightning-fast processing •
            Download your creations instantly
          </p>
        </div>
      </div>
    </div>
  );
}

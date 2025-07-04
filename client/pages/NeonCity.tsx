import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
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
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MusicGenerator from "@/components/MusicGenerator";
import CodeGenerator from "@/components/CodeGenerator";
import ImageGenerator from "@/components/ImageGenerator";
import FileUpload from "@/components/FileUpload";
import CodeViewer from "@/components/CodeViewer";
import AIProcessor from "@/components/AIProcessor";

type ContentMode = "text" | "image" | "video" | "music" | "code" | "convert";

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
  {
    id: "convert",
    name: "Convert",
    icon: RefreshCw,
    color: "from-blue-400 to-cyan-500",
    bgGradient: "bg-gradient-to-br from-blue-400/20 to-cyan-500/20",
    description: "Transform images into React, HTML & CSS code",
    placeholder: "Drop your images to convert to code...",
    outputType: "code",
  },
];

type ProcessingStage = "analyzing" | "converting" | "optimizing" | "completed";

interface GeneratedCode {
  react: string;
  html: string;
  css: string;
  fileName: string;
  originalFileName: string;
}

export default function NeonCity() {
  const [activeMode, setActiveMode] = useState<ContentMode | null>(null);
  const [prompt, setPrompt] = useState("");
  const { user, isSignedIn } = useAuth();

  // Redirect to auth if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem("redirect_after_auth", "/pricing");
      window.location.href = "/auth";
      return;
    }
  }, [isSignedIn]);

  // Handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode") as ContentMode;
    const urlPrompt = urlParams.get("prompt");

    if (mode && CONTENT_ZONES.find((z) => z.id === mode)) {
      setActiveMode(mode);
    }

    if (urlPrompt) {
      setPrompt(decodeURIComponent(urlPrompt));
    }
  }, []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Convert mode specific state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<ProcessingStage>("analyzing");
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    setSelectedFiles(files);
    setIsProcessing(true);
    setProgress(0);
    setStage("analyzing");
    setGeneratedCodes([]);
    setError(null);
    setCurrentFileIndex(0);

    try {
      // Convert files to base64
      const fileData = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            data: base64,
            name: file.name,
            type: file.type,
          };
        }),
      );

      // Simulate processing stages
      setStage("analyzing");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(25);

      setStage("converting");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(50);

      // Call the convert API
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: fileData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to convert images");
      }

      setProgress(75);
      setStage("optimizing");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProgress(100);
      setStage("completed");
      setGeneratedCodes(result.data.results);
    } catch (error) {
      console.error("Error converting files:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      setStage("completed");
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !activeMode) return;

    setIsGenerating(true);

    try {
      // Route to appropriate provider based on mode
      let provider = "groq"; // Default to GROQ for speed

      if (activeMode === "music") {
        provider = "stability"; // Music uses Stability AI
      } else if (activeMode === "image") {
        provider = "openai"; // Images use OpenAI DALL-E for actual generation
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: activeMode,
          prompt,
          provider,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setResult({
          content: `❌ Error: ${data.error || "Generation failed"}`,
        });
      }
    } catch (error) {
      console.error("Generation error:", error);
      setResult({ content: "❌ Error: Failed to connect to AI service" });
    } finally {
      setIsGenerating(false);
    }
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
        {/* Hero Image Header */}
        <div className="relative">
          <section className="flex flex-col relative min-h-[100px] p-5 w-full max-w-[1200px] mx-auto">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Ff211fb8c7c124ed3b265fee7bf5c0654%2F59b0ff3510f44621a20b3f7ea898ff8b"
              className="aspect-[1.77] object-cover object-center w-full min-h-[20px] min-w-[20px] overflow-hidden rounded-3xl"
              alt="Musarty AI Content Generation Hub"
            />
          </section>
        </div>

        {/* 🔒 SECURED CYBER CARDS - POSITION LOCKED 🔒 */}
        <div className="flex justify-center gap-6 mb-12 relative">
          {/* Security Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border border-primary/10 rounded-3xl"></div>
            <div className="absolute top-2 left-4 text-[8px] text-primary/40 font-mono">
              SECURE_GRID_LOCK
            </div>
            <div className="absolute bottom-2 right-4 text-[8px] text-primary/40 font-mono">
              ●●●●● ENCRYPTED
            </div>
          </div>
          {CONTENT_ZONES.map((zone, index) => {
            const Icon = zone.icon;
            return (
              <div key={zone.id} className="cyber-card-container relative">
                {/* SECURITY LOCK INDICATOR */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full border border-primary/50 flex items-center justify-center z-50">
                  <span className="text-[8px] text-primary">🔒</span>
                </div>
                {/* POSITION LOCK */}
                <div className="absolute -bottom-2 -left-2 text-[6px] text-primary/60 font-mono bg-black/80 px-1 rounded">
                  POS_{index + 1}_LOCK
                </div>
                <div
                  className="container noselect"
                  onClick={() => setActiveMode(zone.id)}
                >
                  <div className="canvas">
                    <div className="tracker tr-1" />
                    <div className="tracker tr-2" />
                    <div className="tracker tr-3" />
                    <div className="tracker tr-4" />
                    <div className="tracker tr-5" />
                    <div className="tracker tr-6" />
                    <div className="tracker tr-7" />
                    <div className="tracker tr-8" />
                    <div className="tracker tr-9" />
                    <div
                      id="card"
                      className={cn(activeMode === zone.id && "active-card")}
                    >
                      <div className="card-content">
                        <div className="card-glare" />
                        <div className="cyber-lines">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="icon-container">
                          <Icon className="card-icon" />
                        </div>
                        <div className="title">{zone.name.toUpperCase()}</div>
                        <div className="glowing-elements">
                          <div className="glow-1" />
                          <div className="glow-2" />
                          <div className="glow-3" />
                        </div>
                        <div className="subtitle">
                          <span className="description">
                            {zone.description}
                          </span>
                        </div>
                        <div className="card-particles">
                          <span />
                          <span />
                          <span /> <span />
                          <span />
                          <span />
                        </div>
                        <div className="corner-elements">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="scan-line" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MASSIVE Hero-Style Content Area */}
        <div className="relative">
          {/* Giant SaaS Hero-Style Container */}
          <Card className="bg-black/95 border border-primary/30 backdrop-blur-xl shadow-[0_0_40px_rgba(212,172,53,0.6)] min-h-[600px] rounded-3xl overflow-hidden">
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

            <CardContent className="relative p-16 space-y-8">
              {!activeMode ? (
                // Default State - Show Instructions
                <div className="text-center space-y-8 py-20">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full bg-black/90 rounded-full border-2 border-primary/50">
                      <Sparkles className="w-12 h-12 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                      Ready to Create
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Select a mode above to start generating with AI
                    </p>
                  </div>
                </div>
              ) : (
                // Active Mode - Show Generation Interface
                <div className="space-y-8">
                  {/* Mode Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={resetMode}
                        className="bg-black/60 border-primary/30 hover:bg-primary/10"
                      >
                        ← Back
                      </Button>
                      {(() => {
                        const zone = CONTENT_ZONES.find(
                          (z) => z.id === activeMode,
                        );
                        const Icon = zone?.icon;
                        return (
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12">
                              <div
                                className={cn(
                                  "absolute inset-0 rounded-lg blur-xl opacity-40",
                                  zone?.color
                                    .replace("from-", "bg-")
                                    .split(" ")[0],
                                )}
                              />
                              <div className="relative flex items-center justify-center w-full h-full bg-black/90 rounded-lg border border-primary/50">
                                <Icon className="w-6 h-6 text-primary" />
                              </div>
                            </div>
                            <h2
                              className={cn(
                                "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                                zone?.color,
                              )}
                            >
                              {zone?.name} Generator
                            </h2>
                          </div>
                        );
                      })()}
                    </div>

                    {result && (
                      <Button
                        onClick={handleDownload}
                        className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>

                  {/* Specialized Generation Interface */}
                  {activeMode === "music" && (
                    <MusicGenerator
                      prompt={prompt}
                      setPrompt={setPrompt}
                      isGenerating={isGenerating}
                      onGenerate={handleGenerate}
                      result={result}
                    />
                  )}

                  {activeMode === "code" && (
                    <CodeGenerator
                      prompt={prompt}
                      setPrompt={setPrompt}
                      isGenerating={isGenerating}
                      onGenerate={handleGenerate}
                      result={result}
                    />
                  )}

                  {activeMode === "image" && (
                    <ImageGenerator
                      prompt={prompt}
                      setPrompt={setPrompt}
                      isGenerating={isGenerating}
                      onGenerate={handleGenerate}
                      result={result}
                    />
                  )}

                  {activeMode === "convert" && (
                    <div className="space-y-8">
                      {/* File Upload Section */}
                      {generatedCodes.length === 0 && !error && (
                        <FileUpload
                          onFileSelect={handleFileSelect}
                          isProcessing={isProcessing}
                          maxFiles={5}
                        />
                      )}

                      {/* Processing Section */}
                      {(isProcessing || stage === "completed") && (
                        <AIProcessor
                          isProcessing={isProcessing}
                          progress={progress}
                          stage={stage}
                        />
                      )}

                      {/* Error Section */}
                      {error && (
                        <Card className="glass-strong border-red-500/50">
                          <CardContent className="p-6 text-center space-y-4">
                            <div className="relative mx-auto w-16 h-16">
                              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                              <div className="relative flex items-center justify-center w-full h-full glass rounded-full border-red-500/50">
                                <FileText className="w-8 h-8 text-red-500" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-red-500 mb-2">
                                Conversion Failed
                              </h3>
                              <p className="text-muted-foreground">{error}</p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setError(null);
                                setSelectedFiles([]);
                                setGeneratedCodes([]);
                              }}
                              className="glass hover:neon-border"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Try Again
                            </Button>
                          </CardContent>
                        </Card>
                      )}

                      {/* Results Section */}
                      {generatedCodes.length > 0 && (
                        <div className="space-y-6">
                          {/* Success Header */}
                          <div className="text-center space-y-4">
                            <div className="relative mx-auto w-16 h-16">
                              <div className="absolute inset-0 bg-fire-orange/20 rounded-full blur-xl" />
                              <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
                                <Code className="w-8 h-8 text-fire-orange" />
                              </div>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
                              Code Generated Successfully!
                            </h2>
                          </div>

                          {/* File Navigation (if multiple files) */}
                          {generatedCodes.length > 1 && (
                            <div className="flex justify-center space-x-2">
                              {generatedCodes.map((_, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant={
                                    currentFileIndex === index
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => setCurrentFileIndex(index)}
                                  className="glass hover:neon-border"
                                >
                                  {index + 1}
                                </Button>
                              ))}
                            </div>
                          )}

                          {/* Generated Code */}
                          {generatedCodes[currentFileIndex] && (
                            <CodeViewer
                              reactCode={generatedCodes[currentFileIndex].react}
                              htmlCode={generatedCodes[currentFileIndex].html}
                              cssCode={generatedCodes[currentFileIndex].css}
                              fileName={
                                generatedCodes[currentFileIndex].fileName
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {(activeMode === "text" || activeMode === "video") && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[400px]">
                      {/* Input Side */}
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-xl font-bold text-primary">
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
                            className="bg-black/40 border-primary/30 text-white placeholder:text-muted-foreground resize-none h-32 text-lg p-6 rounded-2xl"
                            disabled={isGenerating}
                          />

                          {/* Image Upload for Text/Video */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-primary/80">
                              Upload Reference Image (Optional)
                            </label>
                            <FileUpload
                              onFileSelect={(files) => {
                                if (files.length > 0) {
                                  const fileName = files[0].name;
                                  setPrompt(
                                    (prev) =>
                                      prev +
                                      (prev ? "\n\n" : "") +
                                      `[Reference image uploaded: ${fileName}] Please analyze this image and incorporate its elements into the ${activeMode} generation.`,
                                  );
                                }
                              }}
                              maxFiles={1}
                              isProcessing={false}
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleGenerate}
                          disabled={!prompt.trim() || isGenerating}
                          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 h-14 text-xl rounded-2xl"
                        >
                          {isGenerating ? (
                            <>
                              <Zap className="w-6 h-6 mr-3 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 mr-3" />
                              Generate{" "}
                              {activeMode.charAt(0).toUpperCase() +
                                activeMode.slice(1)}
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Output Side */}
                      <div className="space-y-4">
                        <label className="text-xl font-bold text-primary">
                          Result
                        </label>
                        <div className="bg-black/40 border border-primary/30 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
                          {isGenerating ? (
                            <div className="text-center space-y-6">
                              <Zap className="w-12 h-12 text-primary animate-spin mx-auto" />
                              <div className="space-y-2">
                                <p className="text-xl font-bold text-primary">
                                  GROQ Orchestrator Working
                                </p>
                                <p className="text-muted-foreground">
                                  Creating your {activeMode} content...
                                </p>
                              </div>
                            </div>
                          ) : result ? (
                            <div className="w-full">
                              <div className="text-white text-lg whitespace-pre-wrap">
                                {typeof result === "string"
                                  ? result
                                  : result.content ||
                                    JSON.stringify(result, null, 2)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <p className="text-lg">
                                Your generated content will appear here
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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

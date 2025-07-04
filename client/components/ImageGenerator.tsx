import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Image as ImageIcon, Download, RefreshCw } from "lucide-react";

interface ImageGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  result: any;
}

export default function ImageGenerator({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
  result,
}: ImageGeneratorProps) {
  const [style, setStyle] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("standard");

  const handleGenerate = () => {
    const enhancedPrompt = `${prompt}${style ? `, ${style} style` : ""}${
      aspectRatio !== "1:1" ? `, ${aspectRatio} aspect ratio` : ""
    }${quality === "hd" ? ", high quality, detailed" : ""}`;

    setPrompt(enhancedPrompt);
    onGenerate();
  };

  const downloadImage = () => {
    if (result?.downloadUrl) {
      const a = document.createElement("a");
      a.href = result.downloadUrl;
      a.download = "generated-image.png";
      a.click();
    }
  };

  const isImageUrl = (content: string) => {
    return content.startsWith("http") && content.includes("image");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
      {/* Image Parameters */}
      <div className="space-y-6">
        <Card className="bg-black/40 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Image Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Prompt */}
            <div className="space-y-2">
              <Label className="text-white">Image Description</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate...
Example: A futuristic city at sunset with neon lights reflecting on wet streets, cyberpunk style, highly detailed"
                className="bg-black/60 border-primary/30 text-white h-32"
                disabled={isGenerating}
              />
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <Label className="text-white">Artistic Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-black/60 border-primary/30">
                  <SelectValue placeholder="Choose style (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific style</SelectItem>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="digital art">Digital Art</SelectItem>
                  <SelectItem value="oil painting">Oil Painting</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="sketch">Sketch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label className="text-white">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger className="bg-black/60 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                  <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                  <SelectItem value="4:3">Classic (4:3)</SelectItem>
                  <SelectItem value="3:2">Photo (3:2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label className="text-white">Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="bg-black/60 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="hd">High Definition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 h-12"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Image Display */}
      <div className="space-y-6">
        <Card className="bg-black/40 border-primary/30 min-h-[500px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary">Generated Image</CardTitle>
            {result?.downloadUrl && (
              <Button
                onClick={downloadImage}
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-primary font-semibold">
                  AI is creating your image...
                </p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Display actual image if URL provided */}
                {result.downloadUrl || isImageUrl(result.content) ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-primary/30">
                      <img
                        src={result.downloadUrl || result.content}
                        alt="Generated image"
                        className="w-full h-auto max-h-96 object-contain bg-black"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Display enhanced prompt if no image URL */
                  <div className="space-y-4">
                    <div className="p-4 bg-black/60 rounded-lg border border-primary/30">
                      <Label className="text-primary">Enhanced Prompt</Label>
                      <p className="text-white mt-2 text-sm leading-relaxed">
                        {result.content}
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-primary text-sm">
                        💡 This is an enhanced prompt for image generation. Copy
                        this and use it with DALL-E, Midjourney, or Stable
                        Diffusion for best results.
                      </p>
                    </div>
                  </div>
                )}

                {/* Image metadata if available */}
                {result.metadata && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {result.metadata.style && (
                      <div>
                        <Label className="text-primary">Style</Label>
                        <p className="text-white">{result.metadata.style}</p>
                      </div>
                    )}
                    {result.metadata.dimensions && (
                      <div>
                        <Label className="text-primary">Dimensions</Label>
                        <p className="text-white">
                          {result.metadata.dimensions}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                <ImageIcon className="w-16 h-16 text-primary/40" />
                <p className="text-primary/60">
                  Describe your image to start generating
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

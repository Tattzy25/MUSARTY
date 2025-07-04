import { useState } from "react";
import Navigation from "@/components/Navigation";
import FileUpload from "@/components/FileUpload";
import CodeViewer from "@/components/CodeViewer";
import AIProcessor from "@/components/AIProcessor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Code,
  Download,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  ChevronRight,
} from "lucide-react";

type ProcessingStage = "analyzing" | "converting" | "optimizing" | "completed";

interface GeneratedCode {
  react: string;
  html: string;
  css: string;
  fileName: string;
  originalFileName: string;
}

export default function Index() {
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

  const handleReset = () => {
    setSelectedFiles([]);
    setIsProcessing(false);
    setProgress(0);
    setStage("analyzing");
    setGeneratedCodes([]);
    setError(null);
    setCurrentFileIndex(0);
  };

  const downloadAllFiles = () => {
    generatedCodes.forEach((code) => {
      // Create and download React file
      downloadFile(code.react, `${code.fileName}.tsx`);
      // Create and download HTML file
      downloadFile(code.html, `${code.fileName}.html`);
      // Create and download CSS file
      downloadFile(code.css, `${code.fileName}.css`);
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Advanced computer vision analyzes your images",
    },
    {
      icon: Code,
      title: "Production Ready",
      description: "Clean, optimized code that follows best practices",
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Convert images to code in seconds, not hours",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        {!selectedFile && !generatedCode && (
          <div className="text-center py-12 space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium neon-border text-neon-blue"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Advanced AI
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent">
                Transform Images
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Into Perfect Code
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Upload any PNG, JPG, or SVG image and watch our AI instantly
                convert it into production-ready React components, HTML, and CSS
                - optimized and ready to use.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="glass-strong neon-border">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative mx-auto w-12 h-12">
                      <div className="absolute inset-0 bg-neon-blue/20 rounded-lg blur-xl" />
                      <div className="relative flex items-center justify-center w-full h-full glass rounded-lg neon-border">
                        <feature.icon className="w-6 h-6 text-neon-blue" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Section */}
        {generatedCodes.length === 0 && !error && (
          <div className="max-w-2xl mx-auto">
            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
              maxFiles={5}
            />
          </div>
        )}

        {/* Processing Section */}
        {(isProcessing || stage === "completed") && (
          <div className="max-w-2xl mx-auto mt-8">
            <AIProcessor
              isProcessing={isProcessing}
              progress={progress}
              stage={stage}
            />
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8">
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
                  onClick={handleReset}
                  className="glass hover:neon-border"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {generatedCodes.length > 0 && (
          <div className="space-y-8 mt-8">
            {/* Success Header */}
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-xl" />
                <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
                  <Code className="w-8 h-8 text-neon-green" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
                Code Generated Successfully!
              </h2>
              <p className="text-muted-foreground">
                {generatedCodes.length === 1
                  ? "Your image has been converted to production-ready code"
                  : `${generatedCodes.length} images have been converted to production-ready code`}
              </p>
            </div>

            {/* File Navigation (if multiple files) */}
            {generatedCodes.length > 1 && (
              <div className="flex justify-center space-x-2">
                {generatedCodes.map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={currentFileIndex === index ? "default" : "outline"}
                    onClick={() => setCurrentFileIndex(index)}
                    className="glass hover:neon-border"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}

            {/* File Info */}
            {selectedFiles[currentFileIndex] && (
              <Card className="glass-strong neon-border max-w-md mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 glass rounded-lg">
                      <ImageIcon className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {selectedFiles[currentFileIndex].name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFiles[currentFileIndex].size / 1024).toFixed(
                          1,
                        )}{" "}
                        KB
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neon-green" />
                    <div className="p-2 glass rounded-lg">
                      <FileText className="w-5 h-5 text-neon-green" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Code */}
            {generatedCodes[currentFileIndex] && (
              <CodeViewer
                reactCode={generatedCodes[currentFileIndex].react}
                htmlCode={generatedCodes[currentFileIndex].html}
                cssCode={generatedCodes[currentFileIndex].css}
                fileName={generatedCodes[currentFileIndex].fileName}
              />
            )}

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="glass hover:neon-border"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Convert More Images
              </Button>
              <Button
                onClick={downloadAllFiles}
                className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 neon-glow"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All Files ({generatedCodes.length * 3} files)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

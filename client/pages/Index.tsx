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

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<ProcessingStage>("analyzing");
  const [generatedCode, setGeneratedCode] = useState<{
    react: string;
    html: string;
    css: string;
  } | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setProgress(0);
    setStage("analyzing");
    setGeneratedCode(null);

    // Simulate AI processing stages
    setTimeout(() => {
      setProgress(25);
      setStage("converting");
    }, 1500);

    setTimeout(() => {
      setProgress(65);
      setStage("optimizing");
    }, 3000);

    setTimeout(() => {
      setProgress(100);
      setStage("completed");
      setIsProcessing(false);

      // Generate mock code based on file name for demo
      const fileName = file.name.split(".")[0];
      setGeneratedCode({
        react: `import React from 'react';
import './styles.css';

interface ${fileName.charAt(0).toUpperCase() + fileName.slice(1)}Props {
  className?: string;
}

export const ${fileName.charAt(0).toUpperCase() + fileName.slice(1)}: React.FC<${fileName.charAt(0).toUpperCase() + fileName.slice(1)}Props> = ({
  className
}) => {
  return (
    <div className={\`${fileName.toLowerCase()}-container \${className || ''}\`}>
      <div className="${fileName.toLowerCase()}-content">
        <h1 className="${fileName.toLowerCase()}-title">
          Generated Component
        </h1>
        <p className="${fileName.toLowerCase()}-description">
          This component was automatically generated from your image using AI.
          It includes responsive design, accessibility features, and optimized code.
        </p>
        <button className="${fileName.toLowerCase()}-button">
          Click Me
        </button>
      </div>
    </div>
  );
};

export default ${fileName.charAt(0).toUpperCase() + fileName.slice(1)};`,

        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName.charAt(0).toUpperCase() + fileName.slice(1)} Component</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="${fileName.toLowerCase()}-container">
        <div class="${fileName.toLowerCase()}-content">
            <h1 class="${fileName.toLowerCase()}-title">
                Generated Component
            </h1>
            <p class="${fileName.toLowerCase()}-description">
                This component was automatically generated from your image using AI.
                It includes responsive design, accessibility features, and optimized code.
            </p>
            <button class="${fileName.toLowerCase()}-button">
                Click Me
            </button>
        </div>
    </div>
</body>
</html>`,

        css: `.${fileName.toLowerCase()}-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.${fileName.toLowerCase()}-content {
  max-width: 600px;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.${fileName.toLowerCase()}-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.${fileName.toLowerCase()}-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 2rem;
}

.${fileName.toLowerCase()}-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.${fileName.toLowerCase()}-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Responsive Design */
@media (max-width: 768px) {
  .${fileName.toLowerCase()}-content {
    padding: 2rem;
    margin: 1rem;
  }

  .${fileName.toLowerCase()}-title {
    font-size: 2rem;
  }

  .${fileName.toLowerCase()}-description {
    font-size: 1rem;
  }
}`,
      });
    }, 4500);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProgress(0);
    setStage("analyzing");
    setGeneratedCode(null);
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
        {!generatedCode && (
          <div className="max-w-2xl mx-auto">
            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
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

        {/* Results Section */}
        {generatedCode && (
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
                Your image has been converted to production-ready code
              </p>
            </div>

            {/* File Info */}
            {selectedFile && (
              <Card className="glass-strong neon-border max-w-md mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 glass rounded-lg">
                      <ImageIcon className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
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
            <CodeViewer
              reactCode={generatedCode.react}
              htmlCode={generatedCode.html}
              cssCode={generatedCode.css}
              fileName={selectedFile?.name.split(".")[0]}
            />

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="glass hover:neon-border"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Convert Another Image
              </Button>
              <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 neon-glow">
                <Download className="w-4 h-4 mr-2" />
                Download All Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye, Download, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import FileUpload from "./FileUpload";

interface CodeGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  result: string | null;
}

export default function CodeGenerator({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
  result,
}: CodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (result) {
      // Extract JSX/HTML from the generated code for preview
      generatePreview(result);
    }
  }, [result]);

  const generatePreview = (code: string) => {
    // Convert React/JSX code to HTML for preview
    // This is a simplified version - in production, you'd want a proper JSX transformer
    try {
      let html = code;

      // Basic JSX to HTML conversion
      html = html.replace(/className=/g, "class=");
      html = html.replace(/onClick=/g, "onclick=");
      html = html.replace(/onChange=/g, "onchange=");

      // Remove imports and exports
      html = html.replace(/import.*?;/g, "");
      html = html.replace(/export.*?{/g, "");
      html = html.replace(/^export default.*$/gm, "");

      // Extract JSX from function component
      const jsxMatch = html.match(/return\s*\(([\s\S]*?)\);?\s*}?\s*$/);
      if (jsxMatch) {
        html = jsxMatch[1];
      }

      // Wrap in basic HTML structure
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; background: #000; color: #fff; }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;

      setPreviewHtml(fullHtml);
    } catch (error) {
      setPreviewHtml(`
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body style="padding: 20px; background: #000; color: #fff;">
          <p>Preview not available - please check the generated code</p>
        </body>
        </html>
      `);
    }
  };

  const copyCode = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCode = () => {
    if (result) {
      const blob = new Blob([result], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-component.tsx";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
      {/* Code Input */}
      <div className="space-y-6">
        <Card className="bg-black/40 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Code Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Component Description</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the React component you want to generate...
Example: Create a modern contact form with name, email, and message fields. Use Tailwind CSS for styling with a dark theme and orange accents."
                className="bg-black/60 border-primary/30 text-white h-32 text-lg"
                disabled={isGenerating}
              />
            </div>

            {/* Image Upload for Design Reference */}
            <div className="space-y-2">
              <Label className="text-white">
                Upload Design Reference (Optional)
              </Label>
              <FileUpload
                onFileSelect={(files) => {
                  if (files.length > 0) {
                    const fileName = files[0].name;
                    setPrompt(
                      (prev) =>
                        prev +
                        (prev ? "\n\n" : "") +
                        `[Design reference uploaded: ${fileName}] Create a React component that matches the design and layout shown in this image.`,
                    );
                  }
                }}
                maxFiles={1}
                isProcessing={false}
              />
            </div>

            <Button
              onClick={onGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 h-12"
            >
              {isGenerating ? (
                <>
                  <Code className="w-5 h-5 mr-2 animate-pulse" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Code className="w-5 h-5 mr-2" />
                  Generate Component
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Code Output & Preview */}
      <div className="space-y-6">
        <Card className="bg-black/40 border-primary/30 min-h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary">Generated Code</CardTitle>
            {result && (
              <div className="flex space-x-2">
                <Button
                  onClick={copyCode}
                  size="sm"
                  className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-1" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  onClick={downloadCode}
                  size="sm"
                  className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
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
                  AI is writing your code...
                </p>
              </div>
            ) : result ? (
              <Tabs defaultValue="code" className="h-full">
                <TabsList className="mb-4 bg-black/60">
                  <TabsTrigger value="code" className="text-white">
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="h-96">
                  <div className="h-full bg-black/60 rounded-lg border border-primary/30 p-4 overflow-auto">
                    <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                      <code>{result}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="h-96">
                  <div className="h-full border border-primary/30 rounded-lg overflow-hidden">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-full"
                      title="Component Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                <Code className="w-16 h-16 text-primary/40" />
                <p className="text-primary/60">
                  Describe your component to generate code
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

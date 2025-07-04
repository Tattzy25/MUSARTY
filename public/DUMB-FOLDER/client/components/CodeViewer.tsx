import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Download, Code, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  reactCode: string;
  htmlCode: string;
  cssCode: string;
  fileName?: string;
}

export default function CodeViewer({
  reactCode,
  htmlCode,
  cssCode,
  fileName = "converted-component",
}: CodeViewerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
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

  const codeBlocks = [
    {
      id: "react",
      label: "React",
      icon: Code,
      code: reactCode,
      filename: `${fileName}.tsx`,
      language: "typescript",
    },
    {
      id: "html",
      label: "HTML",
      icon: FileText,
      code: htmlCode,
      filename: `${fileName}.html`,
      language: "html",
    },
    {
      id: "css",
      label: "CSS",
      icon: FileText,
      code: cssCode,
      filename: `${fileName}.css`,
      language: "css",
    },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
            Generated Code
          </h3>
          <p className="text-sm text-muted-foreground">
            Production-ready code optimized by AI
          </p>
        </div>
      </div>

      <Tabs defaultValue="react" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass">
          {codeBlocks.map((block) => (
            <TabsTrigger
              key={block.id}
              value={block.id}
              className="flex items-center space-x-2 data-[state=active]:neon-border data-[state=active]:bg-primary/10"
            >
              <block.icon className="w-4 h-4" />
              <span>{block.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {codeBlocks.map((block) => (
          <TabsContent key={block.id} value={block.id} className="mt-4">
            <div className="relative">
              {/* Header with actions */}
              <div className="flex items-center justify-between p-3 glass border-b border-glass-border/30">
                <span className="text-sm font-mono text-muted-foreground">
                  {block.filename}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(block.code, block.id)}
                    className="h-8 px-3 hover:neon-border hover:bg-primary/10"
                  >
                    {copiedCode === block.id ? (
                      <Check className="w-4 h-4 text-neon-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadFile(block.code, block.filename)}
                    className="h-8 px-3 hover:neon-border hover:bg-primary/10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Code content */}
              <div className="relative overflow-hidden rounded-b-lg">
                {/* Cyber grid background */}
                <div className="absolute inset-0 cyber-grid opacity-20" />

                {/* Syntax highlighted code */}
                <div className="relative z-10 max-h-96 overflow-auto">
                  <SyntaxHighlighter
                    language={block.language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      background: "transparent",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                    }}
                    wrapLongLines
                  >
                    {block.code}
                  </SyntaxHighlighter>
                </div>

                {/* Holographic overlay */}
                <div className="absolute inset-0 holographic opacity-10 pointer-events-none" />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

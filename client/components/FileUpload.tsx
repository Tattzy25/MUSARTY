import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export default function FileUpload({
  onFileSelect,
  isProcessing,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "glass-strong rounded-2xl p-12 border-2 border-dashed",
        "hover:neon-border hover:scale-[1.02]",
        isDragActive && "neon-border scale-[1.02] pulse-glow",
        isProcessing && "cursor-not-allowed opacity-50",
      )}
    >
      <input {...getInputProps()} />

      {/* Background Effects */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-blue/5 via-neon-purple/5 to-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Cyber scan line effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-cyber-scan" />
      </div>

      <div className="relative z-10 text-center space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl group-hover:bg-neon-blue/30 transition-all duration-300" />
          <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
            {isProcessing ? (
              <Zap className="w-10 h-10 text-neon-blue animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-neon-blue group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent">
            {isProcessing ? "Processing Image..." : "Drop Your Image Here"}
          </h3>
          <p className="text-muted-foreground mt-2">
            {isProcessing
              ? "AI is analyzing and converting your image"
              : "Upload PNG, JPG, or SVG files to convert to React code"}
          </p>
        </div>

        {/* Supported formats */}
        {!isProcessing && (
          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Image className="w-4 h-4 text-neon-blue" />
              <span>PNG</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Image className="w-4 h-4 text-neon-purple" />
              <span>JPG</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 text-neon-green" />
              <span>SVG</span>
            </div>
          </div>
        )}

        {/* Processing animation */}
        {isProcessing && (
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-neon-blue rounded-full animate-data-flow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isProcessing?: boolean;
  maxFiles?: number;
}

export default function FileUpload({
  onFileSelect,
  isProcessing,
  maxFiles = 5,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles.slice(0, maxFiles));
      }
    },
    [onFileSelect, maxFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
    },
    multiple: maxFiles > 1,
    maxFiles,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "bg-black/95 backdrop-blur-xl rounded-2xl p-12 border-2 border-dashed border-primary/30",
        "shadow-[0_0_20px_rgba(212,172,53,0.2)] hover:shadow-[0_0_30px_rgba(212,172,53,0.4)]",
        "hover:border-primary/50 hover:scale-[1.02]",
        isDragActive &&
          "border-primary/70 scale-[1.02] shadow-[0_0_40px_rgba(212,172,53,0.6)]",
        isProcessing && "cursor-not-allowed opacity-50",
      )}
    >
      <input {...getInputProps()} />

      {/* Background Effects */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Cyber scan line effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-cyber-scan" />
      </div>

      <div className="relative z-10 text-center space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-300" />
          <div className="relative flex items-center justify-center w-full h-full bg-black/90 rounded-full border border-primary/50">
            {isProcessing ? (
              <Zap className="w-10 h-10 text-primary animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
            {isProcessing
              ? "Processing Images..."
              : maxFiles > 1
                ? "Drop Your Images Here"
                : "Drop Your Image Here"}
          </h3>
          <p className="text-muted-foreground mt-2">
            {isProcessing
              ? "AI is analyzing and converting your images"
              : `Upload PNG, JPG, or SVG files to convert to React code${maxFiles > 1 ? ` (up to ${maxFiles} files)` : ""}`}
          </p>
        </div>

        {/* Supported formats */}
        {!isProcessing && (
          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Image className="w-4 h-4 text-primary" />
              <span>PNG</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Image className="w-4 h-4 text-primary" />
              <span>JPG</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 text-primary" />
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
                className="w-2 h-2 bg-fire-orange rounded-full animate-data-flow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

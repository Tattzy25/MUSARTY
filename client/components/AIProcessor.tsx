import { useEffect, useState } from "react";
import { Brain, Zap, Code, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIProcessorProps {
  isProcessing: boolean;
  progress: number;
  stage: "analyzing" | "converting" | "optimizing" | "completed";
}

const stages = [
  {
    id: "analyzing",
    label: "Analyzing Image",
    icon: Brain,
    description: "AI is examining your image structure and components",
  },
  {
    id: "converting",
    label: "Converting to Code",
    icon: Code,
    description: "Generating React components and HTML/CSS",
  },
  {
    id: "optimizing",
    label: "Optimizing Output",
    icon: Zap,
    description: "Refining code for production readiness",
  },
  {
    id: "completed",
    label: "Process Complete",
    icon: CheckCircle2,
    description: "Your code is ready for download",
  },
];

export default function AIProcessor({
  isProcessing,
  progress,
  stage,
}: AIProcessorProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing && stage !== "completed") return null;

  const currentStageIndex = stages.findIndex((s) => s.id === stage);
  const currentStage = stages[currentStageIndex];

  return (
    <div className="glass-strong rounded-2xl p-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl animate-pulse-glow" />
          <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
            <currentStage.icon
              className={cn(
                "w-8 h-8 text-neon-blue",
                isProcessing && "animate-spin",
                stage === "completed" && "text-neon-green",
              )}
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground">
          {currentStage.label}
          {isProcessing && dots}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {currentStage.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 glass rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-cyber-scan" />
          </div>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-between">
        {stages.map((stageItem, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isUpcoming = index > currentStageIndex;

          return (
            <div
              key={stageItem.id}
              className={cn(
                "flex flex-col items-center space-y-2 text-center",
                "transition-all duration-300",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                  isCompleted &&
                    "bg-neon-green/20 border-neon-green text-neon-green",
                  isCurrent &&
                    "bg-neon-blue/20 border-neon-blue text-neon-blue pulse-glow",
                  isUpcoming && "bg-muted border-muted-foreground/30",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent && isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <stageItem.icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isCompleted && "text-neon-green",
                  isCurrent && "text-neon-blue",
                  isUpcoming && "text-muted-foreground",
                )}
              >
                {stageItem.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Data flow animation */}
      {isProcessing && (
        <div className="flex justify-center space-x-1 pt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-gradient-to-t from-neon-blue to-neon-purple rounded-full animate-data-flow"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

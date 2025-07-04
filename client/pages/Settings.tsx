import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Zap,
  Code,
  Palette,
  Download,
  Cpu,
  Shield,
  Bell,
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    aiModel: "gpt-4-vision",
    codeStyle: "modern",
    optimization: "balanced",
    includeComments: true,
    generateTypeScript: true,
    includeTailwind: true,
    responsiveDesign: true,
    accessibilityFeatures: true,
    performanceOptimization: true,
    notifications: true,
    qualityLevel: [85],
    processingSpeed: [70],
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-neon-purple/20 rounded-full blur-xl" />
            <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
              <SettingsIcon className="w-10 h-10 text-neon-purple" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-neon-blue to-neon-green bg-clip-text text-transparent">
              Settings & Configuration
            </h1>
            <p className="text-muted-foreground mt-2">
              Customize your AI code generation experience
            </p>
          </div>
        </div>

        {/* AI Model Settings */}
        <Card className="glass-strong neon-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-neon-blue" />
              <span>AI Model Configuration</span>
            </CardTitle>
            <CardDescription>
              Choose the AI model and processing parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <Select
                  value={settings.aiModel}
                  onValueChange={(value) => updateSetting("aiModel", value)}
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong">
                    <SelectItem value="gpt-4-vision">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-neon-blue border-neon-blue"
                        >
                          Premium
                        </Badge>
                        <span>GPT-4 Vision (Recommended)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="claude-3">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-neon-purple border-neon-purple"
                        >
                          Pro
                        </Badge>
                        <span>Claude 3 Opus</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gemini-pro">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-neon-green border-neon-green"
                        >
                          Standard
                        </Badge>
                        <span>Gemini Pro</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Code Style</label>
                <Select
                  value={settings.codeStyle}
                  onValueChange={(value) => updateSetting("codeStyle", value)}
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong">
                    <SelectItem value="modern">
                      Modern React (Hooks + Functional)
                    </SelectItem>
                    <SelectItem value="classic">Class Components</SelectItem>
                    <SelectItem value="nextjs">Next.js Style</SelectItem>
                    <SelectItem value="minimal">Minimal & Clean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-glass-border/30" />

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Quality Level</label>
                  <span className="text-sm text-muted-foreground">
                    {settings.qualityLevel[0]}%
                  </span>
                </div>
                <Slider
                  value={settings.qualityLevel}
                  onValueChange={(value) =>
                    updateSetting("qualityLevel", value)
                  }
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher quality means more detailed analysis but slower
                  processing
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Processing Speed
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {settings.processingSpeed[0]}%
                  </span>
                </div>
                <Slider
                  value={settings.processingSpeed}
                  onValueChange={(value) =>
                    updateSetting("processingSpeed", value)
                  }
                  max={100}
                  min={30}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Balance between speed and thoroughness of code generation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Generation Settings */}
        <Card className="glass-strong neon-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-neon-green" />
              <span>Code Generation Options</span>
            </CardTitle>
            <CardDescription>
              Configure how your code is generated and optimized
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  key: "generateTypeScript",
                  label: "Generate TypeScript",
                  description: "Use TypeScript for better type safety",
                },
                {
                  key: "includeTailwind",
                  label: "Include Tailwind CSS",
                  description: "Use Tailwind utility classes for styling",
                },
                {
                  key: "responsiveDesign",
                  label: "Responsive Design",
                  description: "Generate mobile-friendly responsive code",
                },
                {
                  key: "accessibilityFeatures",
                  label: "Accessibility Features",
                  description: "Include ARIA labels and semantic HTML",
                },
                {
                  key: "performanceOptimization",
                  label: "Performance Optimization",
                  description: "Optimize for loading speed and bundle size",
                },
                {
                  key: "includeComments",
                  label: "Include Comments",
                  description: "Add explanatory comments to generated code",
                },
              ].map((option) => (
                <div
                  key={option.key}
                  className="flex items-center justify-between space-x-4 p-4 glass rounded-lg"
                >
                  <div className="flex-1">
                    <label className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                  <Switch
                    checked={
                      settings[option.key as keyof typeof settings] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateSetting(option.key, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Output Settings */}
        <Card className="glass-strong neon-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-neon-pink" />
              <span>Output & Export Settings</span>
            </CardTitle>
            <CardDescription>
              Customize how your generated code is packaged and delivered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Optimization Level</label>
              <Select
                value={settings.optimization}
                onValueChange={(value) => updateSetting("optimization", value)}
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong">
                  <SelectItem value="minimal">
                    Minimal - Fast generation
                  </SelectItem>
                  <SelectItem value="balanced">
                    Balanced - Good quality & speed
                  </SelectItem>
                  <SelectItem value="maximum">
                    Maximum - Best quality
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div>
                <label className="text-sm font-medium">
                  Desktop Notifications
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Get notified when processing is complete
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-center space-x-4 pt-4">
          <Button variant="outline" className="glass hover:neon-border">
            Reset to Defaults
          </Button>
          <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 neon-glow">
            <Zap className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

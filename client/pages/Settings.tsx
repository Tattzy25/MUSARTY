import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
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
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

interface AppSettings {
  openaiApiKey?: string;
  aiModel: string;
  codeStyle: string;
  optimization: string;
  includeComments: boolean;
  generateTypeScript: boolean;
  includeTailwind: boolean;
  responsiveDesign: boolean;
  accessibilityFeatures: boolean;
  performanceOptimization: boolean;
  notifications: boolean;
  qualityLevel: number;
  processingSpeed: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    aiModel: "gpt-4-vision-preview",
    codeStyle: "modern",
    optimization: "balanced",
    includeComments: true,
    generateTypeScript: true,
    includeTailwind: true,
    responsiveDesign: true,
    accessibilityFeatures: true,
    performanceOptimization: true,
    notifications: true,
    qualityLevel: 85,
    processingSpeed: 70,
  });

  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingApiKey, setIsTestingApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"valid" | "invalid" | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        if (data.data.openaiApiKey === "***configured***") {
          setApiKeyStatus("valid");
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const testApiKey = async (key: string) => {
    if (!key.trim()) return;

    setIsTestingApiKey(true);
    try {
      const response = await fetch("/api/settings/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await response.json();
      setApiKeyStatus(data.valid ? "valid" : "invalid");
    } catch (error) {
      setApiKeyStatus("invalid");
    } finally {
      setIsTestingApiKey(false);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = { ...settings };
      if (apiKey.trim()) {
        settingsToSave.openaiApiKey = apiKey.trim();
      }

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      });

      const data = await response.json();
      if (data.success) {
        setLastSaved(new Date());
        setSettings(data.data);
        if (apiKey.trim()) {
          setApiKeyStatus("valid");
          setApiKey("");
        }
      } else {
        throw new Error(data.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert(
        "Failed to save settings: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      aiModel: "gpt-4-vision-preview",
      codeStyle: "modern",
      optimization: "balanced",
      includeComments: true,
      generateTypeScript: true,
      includeTailwind: true,
      responsiveDesign: true,
      accessibilityFeatures: true,
      performanceOptimization: true,
      notifications: true,
      qualityLevel: 85,
      processingSpeed: 70,
    });
    setApiKey("");
    setApiKeyStatus(null);
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

        {/* OpenAI API Key Configuration */}
        <Card className="glass-strong neon-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-neon-pink" />
              <span>OpenAI API Configuration</span>
              {apiKeyStatus === "valid" && (
                <CheckCircle2 className="w-5 h-5 text-neon-green" />
              )}
              {apiKeyStatus === "invalid" && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>
              Configure your OpenAI API key to enable AI-powered image to code
              conversion. Get your API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:underline"
              >
                OpenAI Platform
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API Key</label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  placeholder={
                    settings.openaiApiKey === "***configured***"
                      ? "API key is configured"
                      : "sk-..."
                  }
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setApiKeyStatus(null);
                  }}
                  className="glass pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="h-6 w-6 p-0"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  {apiKey.trim() && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => testApiKey(apiKey)}
                      disabled={isTestingApiKey}
                      className="h-6 w-6 p-0"
                    >
                      {isTestingApiKey ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {apiKeyStatus === "valid" && (
                <p className="text-xs text-neon-green flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>API key is valid</span>
                </p>
              )}
              {apiKeyStatus === "invalid" && (
                <p className="text-xs text-red-500 flex items-center space-x-1">
                  <XCircle className="w-3 h-3" />
                  <span>API key is invalid</span>
                </p>
              )}
              {settings.openaiApiKey === "***configured***" && !apiKey && (
                <p className="text-xs text-neon-green flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>API key is configured and ready to use</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

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
                    <SelectItem value="gpt-4-vision-preview">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-neon-blue border-neon-blue"
                        >
                          Premium
                        </Badge>
                        <span>GPT-4 Vision Preview (Recommended)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4-turbo">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-neon-purple border-neon-purple"
                        >
                          Fast
                        </Badge>
                        <span>GPT-4 Turbo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-neon-green border-neon-green"
                        >
                          Standard
                        </Badge>
                        <span>GPT-4</span>
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
                    {settings.qualityLevel}%
                  </span>
                </div>
                <Slider
                  value={[settings.qualityLevel]}
                  onValueChange={(value) =>
                    updateSetting("qualityLevel", value[0])
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
                    {settings.processingSpeed}%
                  </span>
                </div>
                <Slider
                  value={[settings.processingSpeed]}
                  onValueChange={(value) =>
                    updateSetting("processingSpeed", value[0])
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
        <div className="flex flex-col items-center space-y-4 pt-4">
          {lastSaved && (
            <p className="text-xs text-muted-foreground flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-neon-green" />
              <span>Settings saved at {lastSaved.toLocaleTimeString()}</span>
            </p>
          )}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="glass hover:neon-border"
              disabled={isSaving}
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 neon-glow"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

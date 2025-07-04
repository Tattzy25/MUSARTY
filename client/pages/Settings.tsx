import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  groqApiKey?: string;
  v0ApiKey?: string;
  openaiApiKey?: string;
  geminiApiKey?: string;
  aiProvider: string;
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
  availableProviders?: any;
}

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    aiProvider: "groq",
    aiModel: "meta-llama/llama-4-scout-17b-16e-instruct",
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

  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    primary: "",
  });
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({
    primary: false,
  });
  const [isTestingApiKey, setIsTestingApiKey] = useState<string | null>(null);
  const [apiKeyStatuses, setApiKeyStatuses] = useState<
    Record<string, "valid" | "invalid" | null>
  >({
    primary: null,
  });
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
        // Update API key statuses based on configured keys
        const newStatuses: Record<string, "valid" | "invalid" | null> = {};
        Object.keys(apiKeys).forEach((provider) => {
          const keyField = `${provider}ApiKey` as keyof AppSettings;
          newStatuses[provider] =
            data.data[keyField] === "***configured***" ? "valid" : null;
        });
        setApiKeyStatuses(newStatuses);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const testApiKey = async (provider: string, key: string) => {
    if (!key.trim()) return;

    setIsTestingApiKey(provider);
    try {
      const response = await fetch("/api/settings/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: key }),
      });
      const data = await response.json();
      setApiKeyStatuses((prev) => ({
        ...prev,
        [provider]: data.valid ? "valid" : "invalid",
      }));
    } catch (error) {
      setApiKeyStatuses((prev) => ({
        ...prev,
        [provider]: "invalid",
      }));
    } finally {
      setIsTestingApiKey(null);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = { ...settings };

      // Add API keys that have been entered
      Object.entries(apiKeys).forEach(([provider, key]) => {
        if (key.trim()) {
          const keyField = `${provider}ApiKey` as keyof AppSettings;
          settingsToSave[keyField] = key.trim() as any;
        }
      });

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      });

      const data = await response.json();
      if (data.success) {
        setLastSaved(new Date());
        setSettings(data.data);

        // Update statuses and clear entered keys
        Object.keys(apiKeys).forEach((provider) => {
          if (apiKeys[provider].trim()) {
            setApiKeyStatuses((prev) => ({ ...prev, [provider]: "valid" }));
            setApiKeys((prev) => ({ ...prev, [provider]: "" }));
          }
        });
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
      aiProvider: "groq",
      aiModel: "meta-llama/llama-4-scout-17b-16e-instruct",
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
    setApiKeys({ groq: "", v0: "", openai: "", gemini: "" });
    setApiKeyStatuses({ groq: null, v0: null, openai: null, gemini: null });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-fire-orange/20 rounded-full blur-xl" />
            <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
              <SettingsIcon className="w-10 h-10 text-fire-orange" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
              Settings & Configuration
            </h1>
            <p className="text-muted-foreground mt-2">
              Customize your AI code generation experience
            </p>
          </div>
        </div>

        {/* Secure API Key Configuration */}
        <Card className="glass-strong neon-border border-fire-orange/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow" />
          <CardHeader className="text-center pb-6">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-fire-orange/30 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border border-fire-orange/50">
                <div className="relative">
                  <Shield className="w-10 h-10 text-fire-orange drop-shadow-[0_0_15px_rgba(230,68,17,0.5)]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-fire-orange to-fire-red rounded-full flex items-center justify-center">
                    <Key className="w-2 h-2 text-black" />
                  </div>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
              Secure API Vault
            </CardTitle>
            <CardDescription className="text-center max-w-lg mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-fire-orange" />
                <span className="text-fire-orange font-semibold">
                  Military-Grade Encryption
                </span>
              </div>
              Your API key is encrypted with AES-256 before storage. Never
              logged, never exposed, never compromised.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Security Features Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: Shield,
                  text: "AES-256 Encryption",
                  color: "text-fire-orange",
                },
                { icon: Eye, text: "Zero Logging", color: "text-fire-red" },
                {
                  icon: Key,
                  text: "Server-Only Access",
                  color: "text-fire-yellow",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 glass rounded-lg border border-fire-orange/20"
                >
                  <div className="p-2 rounded-full bg-fire-orange/10">
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Main API Key Input */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <label className="text-lg font-semibold bg-gradient-to-r from-fire-orange to-fire-red bg-clip-text text-transparent">
                  Your API Key
                </label>
                <p className="text-sm text-muted-foreground">
                  Paste your OpenAI, Groq, or any compatible API key below
                </p>
              </div>

              <div className="relative group">
                {/* Glow effect container */}
                <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>

                {/* Main input container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/10 via-fire-red/10 to-fire-yellow/10 rounded-lg"></div>
                  <div className="relative flex">
                    <div className="flex items-center px-4 glass rounded-l-lg border border-r-0 border-fire-orange/30">
                      <Key className="w-5 h-5 text-fire-orange" />
                    </div>
                    <Input
                      type={showApiKeys.primary ? "text" : "password"}
                      placeholder="sk-... or gsk-... or any API key"
                      value={apiKeys.primary || ""}
                      onChange={(e) => {
                        setApiKeys((prev) => ({
                          ...prev,
                          primary: e.target.value,
                        }));
                        setApiKeyStatuses((prev) => ({
                          ...prev,
                          primary: null,
                        }));
                      }}
                      className="flex-1 glass border-y border-fire-orange/30 rounded-none bg-background/50 text-lg font-mono tracking-wider backdrop-blur-xl"
                    />
                    <div className="flex items-center space-x-1 px-2 glass rounded-r-lg border border-l-0 border-fire-orange/30">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setShowApiKeys((prev) => ({
                            ...prev,
                            primary: !prev.primary,
                          }))
                        }
                        className="h-8 w-8 p-0 hover:bg-fire-orange/20"
                      >
                        {showApiKeys.primary ? (
                          <EyeOff className="w-4 h-4 text-fire-orange" />
                        ) : (
                          <Eye className="w-4 h-4 text-fire-orange" />
                        )}
                      </Button>
                      {apiKeys.primary?.trim() && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => testApiKey("primary", apiKeys.primary)}
                          disabled={isTestingApiKey === "primary"}
                          className="h-8 w-8 p-0 hover:bg-fire-orange/20"
                        >
                          {isTestingApiKey === "primary" ? (
                            <Loader2 className="w-4 h-4 animate-spin text-fire-orange" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-fire-orange" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center justify-center space-x-4">
                {apiKeyStatuses.primary === "valid" && (
                  <div className="flex items-center space-x-2 px-4 py-2 glass rounded-full border border-fire-orange/30">
                    <CheckCircle2 className="w-4 h-4 text-fire-orange" />
                    <span className="text-sm text-fire-orange font-medium">
                      API Key Verified
                    </span>
                  </div>
                )}
                {apiKeyStatuses.primary === "invalid" && (
                  <div className="flex items-center space-x-2 px-4 py-2 glass rounded-full border border-red-500/30">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500 font-medium">
                      Invalid Key
                    </span>
                  </div>
                )}
                {settings.openaiApiKey === "***configured***" &&
                  !apiKeys.primary && (
                    <div className="flex items-center space-x-2 px-4 py-2 glass rounded-full border border-fire-orange/30">
                      <Shield className="w-4 h-4 text-fire-orange" />
                      <span className="text-sm text-fire-orange font-medium">
                        Securely Stored
                      </span>
                    </div>
                  )}
              </div>

              {/* Provider links */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Need an API key?
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    {
                      name: "OpenAI",
                      url: "https://platform.openai.com/api-keys",
                      prefix: "sk-",
                    },
                    {
                      name: "Groq",
                      url: "https://console.groq.com/keys",
                      prefix: "gsk-",
                    },
                    {
                      name: "Anthropic",
                      url: "https://console.anthropic.com/keys",
                      prefix: "sk-ant-",
                    },
                  ].map((provider) => (
                    <a
                      key={provider.name}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-lg border border-fire-orange/20 hover:border-fire-orange/50 hover:bg-fire-orange/5 transition-all duration-200"
                    >
                      <Key className="w-3 h-3 text-fire-orange" />
                      <span className="text-sm font-medium">
                        {provider.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({provider.prefix}...)
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Security guarantee */}
              <div className="text-center p-6 glass rounded-lg border border-fire-orange/20 bg-fire-orange/5">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-fire-orange" />
                  <span className="font-semibold text-fire-orange">
                    Security Guarantee
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your API key is encrypted using military-grade AES-256
                  encryption before being stored. It's never logged, never
                  cached in plain text, and only decrypted server-side when
                  needed. If there's ever a breach, your key remains completely
                  secure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Model Settings */}
        <Card className="glass-strong neon-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-fire-orange" />
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
                  <SelectTrigger className="glass max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong">
                    {settings.aiProvider === "groq" && (
                      <>
                        <SelectItem value="meta-llama/llama-4-scout-17b-16e-instruct">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-orange border-fire-orange"
                            >
                              🚀 SCOUT
                            </Badge>
                            <span>Llama 4 Scout 17B (Recommended)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="llama-3.3-70b-versatile">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-red border-fire-red"
                            >
                              Latest
                            </Badge>
                            <span>Llama 3.3 70B</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="llama-3.2-90b-vision-preview">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-yellow border-fire-yellow"
                            >
                              Vision
                            </Badge>
                            <span>Llama 3.2 90B Vision</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="llama-3.2-11b-vision-preview">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-ember-red border-ember-red"
                            >
                              Fast
                            </Badge>
                            <span>Llama 3.2 11B Vision</span>
                          </div>
                        </SelectItem>
                      </>
                    )}
                    {settings.aiProvider === "v0" && (
                      <>
                        <SelectItem value="v0-1.5-lg">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-orange border-fire-orange"
                            >
                              🎨 UI Expert
                            </Badge>
                            <span>v0 1.5 Large (Recommended)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="v0-1.5-md">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-red border-fire-red"
                            >
                              Everyday Tasks
                            </Badge>
                            <span>v0 1.5 Medium</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="v0-1.0-md">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-yellow border-fire-yellow"
                            >
                              Legacy
                            </Badge>
                            <span>v0 1.0 Medium</span>
                          </div>
                        </SelectItem>
                      </>
                    )}
                    {settings.aiProvider === "openai" && (
                      <>
                        <SelectItem value="gpt-4o">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-orange border-fire-orange"
                            >
                              Latest & Best
                            </Badge>
                            <span>GPT-4o</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gpt-4o-mini">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-red border-fire-red"
                            >
                              Fast & Cheap
                            </Badge>
                            <span>GPT-4o Mini</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gpt-4-turbo">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-yellow border-fire-yellow"
                            >
                              Turbo
                            </Badge>
                            <span>GPT-4 Turbo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gpt-4-vision-preview">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-ember-red border-ember-red"
                            >
                              Vision
                            </Badge>
                            <span>GPT-4 Vision</span>
                          </div>
                        </SelectItem>
                      </>
                    )}
                    {settings.aiProvider === "gemini" && (
                      <>
                        <SelectItem value="gemini-2.0-flash-exp">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-orange border-fire-orange"
                            >
                              Latest
                            </Badge>
                            <span>Gemini 2.0 Flash (New!)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gemini-1.5-pro-002">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-red border-fire-red"
                            >
                              Premium
                            </Badge>
                            <span>Gemini 1.5 Pro</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gemini-1.5-flash-002">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-fire-yellow border-fire-yellow"
                            >
                              Fast
                            </Badge>
                            <span>Gemini 1.5 Flash</span>
                          </div>
                        </SelectItem>
                      </>
                    )}
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
              <Code className="w-5 h-5 text-fire-orange" />
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
              <Download className="w-5 h-5 text-fire-orange" />
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
              <CheckCircle2 className="w-3 h-3 text-fire-orange" />
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
              className="bg-gradient-to-r from-fire-orange to-fire-red hover:from-fire-orange/80 hover:to-fire-red/80 neon-glow"
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

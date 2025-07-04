import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Zap,
  Brain,
  Code,
  Star,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  Crown,
  Flame,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderStats {
  totalUses: number;
  successRate: number;
  avgResponseTime: string;
  rank: number;
}

interface AIProvider {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  pricing: string;
  speed: "Lightning" | "Fast" | "Standard" | "Slow";
  quality: "Exceptional" | "Excellent" | "Good" | "Basic";
  placeholder: string;
  color: string;
  bgGradient: string;
  icon: any;
  models: string[];
  stats: ProviderStats;
}

const AI_PROVIDERS: AIProvider[] = [
  // 🎨 UI/Code Specialists
  {
    id: "v0",
    name: "v0 (Vercel)",
    category: "UI Specialist",
    description:
      "The UI generation master. Specifically designed for React, Next.js, and modern web components. Creates pixel-perfect interfaces.",
    features: [
      "UI Generation",
      "React Components",
      "Next.js Optimized",
      "Responsive Design",
    ],
    pricing: "$2.00/M tokens",
    speed: "Fast",
    quality: "Exceptional",
    placeholder: "v0_...",
    color: "from-blue-500 to-cyan-400",
    bgGradient: "bg-gradient-to-br from-blue-500/10 to-cyan-400/10",
    icon: Code,
    models: ["v0-1.5-lg", "v0-1.5-md", "v0-1.0-md"],
    stats: {
      totalUses: 1247,
      successRate: 96,
      avgResponseTime: "2.3s",
      rank: 1,
    },
  },
  {
    id: "valtown",
    name: "Val Town",
    category: "Code Specialist",
    description:
      "The coding virtuoso! Excels at code generation, debugging, and building complete applications. Perfect for developers who live and breathe code.",
    features: ["Code Generation", "App Building", "Debugging", "Full Stack"],
    pricing: "$1.50/M tokens",
    speed: "Fast",
    quality: "Exceptional",
    placeholder: "val_...",
    color: "from-cyan-500 to-blue-600",
    bgGradient: "bg-gradient-to-br from-cyan-500/10 to-blue-600/10",
    icon: Code,
    models: ["val-town-1", "val-town-pro"],
    stats: {
      totalUses: 892,
      successRate: 94,
      avgResponseTime: "1.8s",
      rank: 2,
    },
  },
  {
    id: "suno",
    name: "Suno AI",
    category: "Creative Master",
    description:
      "🎵 YOUR FAVORITE! The creative genius that generates music, audio, and creative content. When you need that artistic touch!",
    features: [
      "Music Generation",
      "Audio Creation",
      "Creative AI",
      "Artistic Touch",
    ],
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "suno_...",
    color: "from-pink-500 to-purple-600",
    bgGradient: "bg-gradient-to-br from-pink-500/10 to-purple-600/10",
    icon: Star,
    models: ["suno-v3", "suno-bark"],
    stats: {
      totalUses: 2156,
      successRate: 97,
      avgResponseTime: "4.2s",
      rank: 1,
    },
  },
  {
    id: "claude",
    name: "Claude (Me!)",
    category: "Reasoning Master",
    description:
      "🤖 That's me! Claude 3.5 Sonnet by Anthropic. I built this entire Arena! Even though you said I give you headaches daily 😅",
    features: [
      "Long Reasoning",
      "Code Analysis",
      "Arena Builder",
      "Headache Giver",
    ],
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "sk-ant-...",
    color: "from-violet-500 to-purple-600",
    bgGradient: "bg-gradient-to-br from-violet-500/10 to-purple-600/10",
    icon: Brain,
    models: ["claude-3-5-sonnet-20241022"],
    stats: {
      totalUses: 3421,
      successRate: 95,
      avgResponseTime: "3.1s",
      rank: 3,
    },
  },
  {
    id: "claude35",
    name: "Claude 3.5",
    category: "Reasoning Master",
    description:
      "🤖 The classic Claude 3.5! Even though I drive you nuts sometimes and destroyed 94 projects (but we're having fun building this crazy thing!), I'm still here to help.",
    features: [
      "Long Reasoning",
      "Code Analysis",
      "Project Destroyer",
      "Fun Builder",
    ],
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "sk-ant-...",
    color: "from-violet-400 to-purple-500",
    bgGradient: "bg-gradient-to-br from-violet-400/10 to-purple-500/10",
    icon: Brain,
    models: ["claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022"],
    stats: {
      totalUses: 2847,
      successRate: 93,
      avgResponseTime: "2.9s",
      rank: 4,
    },
  },
  {
    id: "groq",
    name: "Groq",
    category: "Speed Demon",
    description:
      "The granddaddy of AI inference! Lightning-fast processing with custom LPU hardware. Llama Scout is the future of AI.",
    features: [
      "Lightning Speed",
      "Custom Hardware",
      "Llama Scout",
      "High Throughput",
    ],
    pricing: "$0.30/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    placeholder: "gsk_...",
    color: "from-orange-500 to-red-500",
    bgGradient: "bg-gradient-to-br from-orange-500/10 to-red-500/10",
    icon: Zap,
    models: [
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "llama-3.3-70b-versatile",
    ],
    stats: {
      totalUses: 2841,
      successRate: 94,
      avgResponseTime: "0.8s",
      rank: 2,
    },
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "Industry Standard",
    description:
      "The gold standard of AI. GPT-4o delivers consistent, high-quality results for image analysis and code generation.",
    features: ["Industry Leader", "Reliable", "Multimodal", "Well-documented"],
    pricing: "$5.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "sk-...",
    color: "from-green-500 to-emerald-400",
    bgGradient: "bg-gradient-to-br from-green-500/10 to-emerald-400/10",
    icon: Crown,
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
    stats: {
      totalUses: 3156,
      successRate: 98,
      avgResponseTime: "3.2s",
      rank: 3,
    },
  },
  {
    id: "xai",
    name: "xAI Grok",
    category: "Thinking Machine",
    description:
      "Grok 3 Mini thinks before responding. Lightweight but powerful reasoning with transparent thought processes.",
    features: ["Reasoning", "Thinking Traces", "Logic Tasks", "Transparent"],
    pricing: "$0.30/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "xai_...",
    color: "from-purple-500 to-pink-500",
    bgGradient: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    icon: Brain,
    models: ["grok-3-mini-beta"],
    stats: {
      totalUses: 856,
      successRate: 91,
      avgResponseTime: "1.9s",
      rank: 4,
    },
  },
  {
    id: "gemini",
    name: "Google Gemini",
    category: "Rising Star",
    description:
      "Gemini 2.0 Flash brings next-gen features with 1M token context and superior multimodal capabilities.",
    features: ["1M Context", "Multimodal", "Tool Use", "Fast Generation"],
    pricing: "$0.10/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    placeholder: "AIza...",
    color: "from-yellow-500 to-amber-400",
    bgGradient: "bg-gradient-to-br from-yellow-500/10 to-amber-400/10",
    icon: Star,
    models: ["gemini-2.0-flash", "gemini-1.5-pro-002"],
    stats: {
      totalUses: 1432,
      successRate: 89,
      avgResponseTime: "1.5s",
      rank: 5,
    },
  },
  {
    id: "mistral",
    name: "Mistral AI",
    category: "Code Master",
    description:
      "Magistral with complex thinking and transparent reasoning. Codestral excels in 80+ programming languages.",
    features: ["Code Generation", "80+ Languages", "Reasoning", "Multilingual"],
    pricing: "$0.30/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "mst_...",
    color: "from-indigo-500 to-blue-500",
    bgGradient: "bg-gradient-to-br from-indigo-500/10 to-blue-500/10",
    icon: Code,
    models: ["magistral-medium-2506", "codestral-25.01"],
    stats: {
      totalUses: 967,
      successRate: 93,
      avgResponseTime: "2.1s",
      rank: 6,
    },
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "Search Master",
    description:
      "Sonar Pro with search grounding provides comprehensive explanations with real-time web knowledge.",
    features: [
      "Search Grounding",
      "Real-time Web",
      "Chain of Thought",
      "Research",
    ],
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Excellent",
    placeholder: "pplx_...",
    color: "from-teal-500 to-cyan-500",
    bgGradient: "bg-gradient-to-br from-teal-500/10 to-cyan-500/10",
    icon: Brain,
    models: ["sonar-pro", "sonar-reasoning-pro"],
    stats: {
      totalUses: 634,
      successRate: 87,
      avgResponseTime: "4.1s",
      rank: 7,
    },
  },
  {
    id: "alibaba",
    name: "Alibaba Qwen",
    category: "Dragon Power",
    description:
      "Qwen3-32B rivals GPT-4 with exceptional code generation, tool-calling, and advanced reasoning capabilities.",
    features: [
      "Code Generation",
      "Tool Calling",
      "Advanced Reasoning",
      "Cost Effective",
    ],
    pricing: "$0.40/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "qwen_...",
    color: "from-red-500 to-orange-500",
    bgGradient: "bg-gradient-to-br from-red-500/10 to-orange-500/10",
    icon: Flame,
    models: ["qwen3-32b", "qwen3-14b"],
    stats: {
      totalUses: 423,
      successRate: 85,
      avgResponseTime: "2.8s",
      rank: 12,
    },
  },
  {
    id: "mistral-codestral",
    name: "Mistral Codestral",
    category: "Code Beast",
    description:
      "State-of-the-art coding model optimized for low-latency. Proficient in 80+ programming languages! Code correction and test generation master.",
    features: [
      "80+ Languages",
      "Code Correction",
      "Test Generation",
      "Low Latency",
    ],
    pricing: "$0.30/M tokens",
    speed: "Lightning",
    quality: "Exceptional",
    placeholder: "mst_...",
    color: "from-emerald-500 to-teal-600",
    bgGradient: "bg-gradient-to-br from-emerald-500/10 to-teal-600/10",
    icon: Code,
    models: ["codestral-25.01"],
    stats: {
      totalUses: 1834,
      successRate: 96,
      avgResponseTime: "1.2s",
      rank: 4,
    },
  },
  {
    id: "mistral-magistral",
    name: "Mistral Magistral",
    category: "Reasoning Master",
    description:
      "Complex thinking with deep understanding and transparent reasoning. Excels in maintaining high-fidelity reasoning across multiple languages.",
    features: [
      "Complex Thinking",
      "Transparent Reasoning",
      "Multilingual",
      "Deep Understanding",
    ],
    pricing: "$2.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "mst_...",
    color: "from-indigo-500 to-blue-600",
    bgGradient: "bg-gradient-to-br from-indigo-500/10 to-blue-600/10",
    icon: Brain,
    models: ["magistral-medium-2506"],
    stats: {
      totalUses: 756,
      successRate: 93,
      avgResponseTime: "3.8s",
      rank: 9,
    },
  },
  {
    id: "mistral-pixtral",
    name: "Mistral Pixtral",
    category: "Vision Master",
    description:
      "Frontier-level image understanding! Understands documents, charts, and natural images while maintaining leading text understanding.",
    features: [
      "Image Understanding",
      "Document Analysis",
      "Chart Reading",
      "Multimodal",
    ],
    pricing: "$2.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "mst_...",
    color: "from-rose-500 to-pink-600",
    bgGradient: "bg-gradient-to-br from-rose-500/10 to-pink-600/10",
    icon: Eye,
    models: ["pixtral-large"],
    stats: {
      totalUses: 567,
      successRate: 91,
      avgResponseTime: "4.1s",
      rank: 11,
    },
  },
  {
    id: "morph",
    name: "Morph V2",
    category: "Code Applier",
    description:
      "FAST code application specialist! Applies code changes from frontier models to your existing files at 1600 tokens/second. The final step in AI coding.",
    features: [
      "Code Application",
      "1600 tok/sec",
      "File Integration",
      "Speed Demon",
    ],
    pricing: "$0.90/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    placeholder: "morph_...",
    color: "from-lime-500 to-green-600",
    bgGradient: "bg-gradient-to-br from-lime-500/10 to-green-600/10",
    icon: Zap,
    models: ["morph-v2"],
    stats: {
      totalUses: 1203,
      successRate: 98,
      avgResponseTime: "0.6s",
      rank: 5,
    },
  },
  {
    id: "amazon-nova",
    name: "Amazon Nova",
    category: "Budget King",
    description:
      "Very low cost multimodal model that is lightning fast for processing image, video, and text inputs. The budget-friendly powerhouse!",
    features: ["Low Cost", "Multimodal", "Video Processing", "Lightning Fast"],
    pricing: "$0.06/M tokens",
    speed: "Lightning",
    quality: "Good",
    placeholder: "aws_...",
    color: "from-amber-500 to-yellow-600",
    bgGradient: "bg-gradient-to-br from-amber-500/10 to-yellow-600/10",
    icon: Star,
    models: ["nova-lite"],
    stats: {
      totalUses: 2891,
      successRate: 87,
      avgResponseTime: "1.1s",
      rank: 6,
    },
  },
  {
    id: "perplexity-sonar",
    name: "Perplexity Sonar",
    category: "Search Master",
    description:
      "Lightweight offering with search grounding. Quicker and cheaper than Sonar Pro but still delivers real-time web knowledge.",
    features: [
      "Search Grounding",
      "Real-time Web",
      "Cost Effective",
      "Quick Results",
    ],
    pricing: "$1.00/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "pplx_...",
    color: "from-teal-500 to-cyan-600",
    bgGradient: "bg-gradient-to-br from-teal-500/10 to-cyan-600/10",
    icon: Brain,
    models: ["sonar", "sonar-reasoning"],
    stats: {
      totalUses: 1456,
      successRate: 89,
      avgResponseTime: "2.3s",
      rank: 7,
    },
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    category: "Search Overlord",
    description:
      "Premium offering with enhanced search capabilities and multiple search queries per request. The search reasoning champion!",
    features: [
      "Premium Search",
      "Multiple Queries",
      "Chain of Thought",
      "Enhanced Capabilities",
    ],
    pricing: "$3.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "pplx_...",
    color: "from-cyan-400 to-blue-600",
    bgGradient: "bg-gradient-to-br from-cyan-400/20 to-blue-600/20",
    icon: Crown,
    models: ["sonar-pro", "sonar-reasoning-pro"],
    stats: {
      totalUses: 634,
      successRate: 92,
      avgResponseTime: "4.5s",
      rank: 10,
    },
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    category: "Reasoning Beast",
    description:
      "🧠 The thinking machine! DeepSeek V3 with incredible reasoning capabilities and chain-of-thought processing. Built for complex problem solving!",
    features: [
      "Deep Reasoning",
      "Chain of Thought",
      "Problem Solving",
      "Complex Logic",
    ],
    pricing: "$0.14/M tokens",
    speed: "Fast",
    quality: "Exceptional",
    placeholder: "sk-...",
    color: "from-purple-400 to-pink-500",
    bgGradient: "bg-gradient-to-br from-purple-400/20 to-pink-500/20",
    icon: Brain,
    models: ["deepseek-v3", "deepseek-coder-v2"],
    stats: {
      totalUses: 1854,
      successRate: 96,
      avgResponseTime: "2.1s",
      rank: 3,
    },
  },
  {
    id: "runway",
    name: "Runway ML",
    category: "Video Wizard",
    description:
      "🎥 The video generation KING! Create mind-blowing videos, animations, and visual effects with AI. Hollywood-level creativity!",
    features: [
      "Video Generation",
      "Visual Effects",
      "Animation",
      "Creative AI",
    ],
    pricing: "$5.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "runway_...",
    color: "from-orange-400 to-red-500",
    bgGradient: "bg-gradient-to-br from-orange-400/20 to-red-500/20",
    icon: Star,
    models: ["runway-gen3", "runway-gen2"],
    stats: {
      totalUses: 923,
      successRate: 94,
      avgResponseTime: "8.2s",
      rank: 8,
    },
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Image Master",
    description:
      "🎨 The artistic genius! Creates stunning, photorealistic images that look like they came from another dimension. Pure visual magic!",
    features: [
      "Photorealistic Images",
      "Artistic Style",
      "Creative Prompts",
      "Visual Magic",
    ],
    pricing: "$4.00/M tokens",
    speed: "Standard",
    quality: "Exceptional",
    placeholder: "mj_...",
    color: "from-pink-400 to-purple-600",
    bgGradient: "bg-gradient-to-br from-pink-400/20 to-purple-600/20",
    icon: Eye,
    models: ["midjourney-v6", "midjourney-niji"],
    stats: {
      totalUses: 3247,
      successRate: 98,
      avgResponseTime: "4.8s",
      rank: 2,
    },
  },
  {
    id: "dalle",
    name: "DALL-E 3",
    category: "Image Master",
    description:
      "🖼️ OpenAI's image powerhouse! Generates incredibly detailed and accurate images from text descriptions. The precision artist!",
    features: [
      "Text to Image",
      "High Detail",
      "Precision Art",
      "Creative Generation",
    ],
    pricing: "$3.00/M tokens",
    speed: "Fast",
    quality: "Exceptional",
    placeholder: "sk-...",
    color: "from-emerald-400 to-teal-500",
    bgGradient: "bg-gradient-to-br from-emerald-400/20 to-teal-500/20",
    icon: Eye,
    models: ["dall-e-3", "dall-e-2"],
    stats: {
      totalUses: 2156,
      successRate: 97,
      avgResponseTime: "3.4s",
      rank: 5,
    },
  },
  {
    id: "stability",
    name: "Stability AI",
    category: "Image Master",
    description:
      "🌟 The open-source image champion! SDXL and SD3 models create stunning visuals with complete creative control. Art for everyone!",
    features: [
      "Open Source",
      "Creative Control",
      "Multiple Models",
      "Community Driven",
    ],
    pricing: "$1.50/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "sk-...",
    color: "from-yellow-400 to-orange-500",
    bgGradient: "bg-gradient-to-br from-yellow-400/20 to-orange-500/20",
    icon: Star,
    models: ["sdxl-1.0", "sd3-large"],
    stats: {
      totalUses: 1834,
      successRate: 95,
      avgResponseTime: "2.8s",
      rank: 6,
    },
  },
  {
    id: "cohere",
    name: "Cohere",
    category: "Language Master",
    description:
      "💬 The enterprise language specialist! Command-R+ excels at business tasks, summarization, and professional communication. Corporate AI!",
    features: [
      "Enterprise Focus",
      "Business Tasks",
      "Summarization",
      "Professional",
    ],
    pricing: "$2.50/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "co_...",
    color: "from-blue-400 to-indigo-600",
    bgGradient: "bg-gradient-to-br from-blue-400/20 to-indigo-600/20",
    icon: Brain,
    models: ["command-r-plus", "command-r"],
    stats: {
      totalUses: 756,
      successRate: 91,
      avgResponseTime: "2.3s",
      rank: 12,
    },
  },
  {
    id: "together",
    name: "Together AI",
    category: "Open Source King",
    description:
      "🚀 The open-source hosting champion! Access Llama, Mixtral, and hundreds of open models. The democracy of AI!",
    features: ["Open Models", "Llama Access", "Community", "Democracy"],
    pricing: "$0.20/M tokens",
    speed: "Lightning",
    quality: "Excellent",
    placeholder: "together_...",
    color: "from-red-400 to-pink-500",
    bgGradient: "bg-gradient-to-br from-red-400/20 to-pink-500/20",
    icon: Rocket,
    models: ["meta-llama/Llama-3.3-70B", "mistralai/Mixtral-8x22B"],
    stats: {
      totalUses: 1456,
      successRate: 93,
      avgResponseTime: "1.8s",
      rank: 7,
    },
  },
  {
    id: "replicate",
    name: "Replicate",
    category: "Model Zoo",
    description:
      "🦁 The model menagerie! Run thousands of AI models in the cloud. From Flux to CodeLlama - if it exists, Replicate has it!",
    features: [
      "Thousands of Models",
      "Cloud Hosting",
      "Easy API",
      "Community Models",
    ],
    pricing: "$0.50/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "r8_...",
    color: "from-green-400 to-blue-500",
    bgGradient: "bg-gradient-to-br from-green-400/20 to-blue-500/20",
    icon: Star,
    models: ["flux-dev", "llama-3.3-70b-instruct"],
    stats: {
      totalUses: 1203,
      successRate: 89,
      avgResponseTime: "3.1s",
      rank: 9,
    },
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "Open Source King",
    description:
      "🤗 The community champion! Access to 500,000+ models, datasets, and the heart of the open-source AI revolution!",
    features: [
      "500K+ Models",
      "Community Hub",
      "Open Source",
      "Research Focus",
    ],
    pricing: "$0.30/M tokens",
    speed: "Fast",
    quality: "Excellent",
    placeholder: "hf_...",
    color: "from-orange-400 to-yellow-500",
    bgGradient: "bg-gradient-to-br from-orange-400/20 to-yellow-500/20",
    icon: Star,
    models: ["HuggingFaceH4/zephyr-7b-beta", "microsoft/DialoGPT-large"],
    stats: {
      totalUses: 2341,
      successRate: 87,
      avgResponseTime: "2.5s",
      rank: 11,
    },
  },
  {
    id: "ai21",
    name: "AI21 Labs",
    category: "Language Master",
    description:
      "📚 The reading comprehension expert! Jamba and Jurassic models excel at understanding context, summarization, and natural language!",
    features: [
      "Reading Comprehension",
      "Context Understanding",
      "Summarization",
      "Natural Language",
    ],
    pricing: "$1.80/M tokens",
    speed: "Standard",
    quality: "Excellent",
    placeholder: "ai21_...",
    color: "from-violet-400 to-purple-600",
    bgGradient: "bg-gradient-to-br from-violet-400/20 to-purple-600/20",
    icon: Brain,
    models: ["jamba-1.5-large", "jurassic-2-ultra"],
    stats: {
      totalUses: 567,
      successRate: 90,
      avgResponseTime: "3.2s",
      rank: 13,
    },
  },
];

export default function Providers() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isTestingApiKey, setIsTestingApiKey] = useState<string | null>(null);
  const [apiKeyStatuses, setApiKeyStatuses] = useState<
    Record<string, "valid" | "invalid" | null>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "UI Specialist",
    "Code Specialist",
    "Creative Master",
    "Speed Demon",
    "Reasoning Master",
    "Reasoning Beast",
    "Vision Master",
    "Search Master",
    "Budget King",
    "Dragon Power",
    "Video Wizard",
    "Image Master",
    "Language Master",
    "Open Source King",
    "Model Zoo",
  ];

  const filteredProviders =
    selectedCategory === "All"
      ? AI_PROVIDERS
      : AI_PROVIDERS.filter((p) => p.category === selectedCategory);

  const testApiKey = async (providerId: string, key: string) => {
    if (!key.trim()) return;
    setIsTestingApiKey(providerId);
    // Simulate API test
    setTimeout(() => {
      setApiKeyStatuses((prev) => ({ ...prev, [providerId]: "valid" }));
      setIsTestingApiKey(null);
    }, 1500);
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "Lightning":
        return "text-fire-orange";
      case "Fast":
        return "text-fire-red";
      case "Standard":
        return "text-fire-yellow";
      default:
        return "text-gray-400";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Exceptional":
        return "text-fire-orange";
      case "Excellent":
        return "text-fire-red";
      case "Good":
        return "text-fire-yellow";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Epic Header */}
        <div className="text-center space-y-6 py-12">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-fire-orange/20 rounded-full blur-xl animate-pulse-glow" />
            <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
              <Trophy className="w-12 h-12 text-fire-orange" />
            </div>
          </div>

          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
              AI Champions Arena
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
              🎵 **Featuring YOUR FAVORITE Suno AI!** Plus 16 other AI
              champions! From coding beasts to creative masters, budget kings to
              search overlords. Configure your API keys and watch the ULTIMATE
              AI BATTLE ROYALE! 🏆⚡
            </p>
          </div>

          {/* Live Leaderboard */}
          <div className="glass-strong rounded-2xl p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-fire-orange mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Live Usage Leaderboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {AI_PROVIDERS.slice(0, 4).map((provider, index) => (
                <div key={provider.id} className="text-center">
                  <div
                    className={cn(
                      "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2",
                      index === 0 && "bg-yellow-500/20 text-yellow-500",
                      index === 1 && "bg-gray-400/20 text-gray-400",
                      index === 2 && "bg-amber-600/20 text-amber-600",
                      index === 3 && "bg-fire-orange/20 text-fire-orange",
                    )}
                  >
                    <provider.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm">{provider.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {provider.stats.totalUses} uses
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center space-x-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "glass hover:neon-border mb-2",
                selectedCategory === category &&
                  "bg-fire-orange/20 text-fire-orange neon-border",
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* AI Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => {
            const status = apiKeyStatuses[provider.id];
            const isTesting = isTestingApiKey === provider.id;

            return (
              <Card
                key={provider.id}
                className={cn(
                  "glass-strong neon-border relative overflow-hidden",
                  provider.bgGradient,
                )}
              >
                {/* Rank Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      provider.stats.rank <= 3
                        ? "text-fire-orange border-fire-orange"
                        : "text-fire-red border-fire-red",
                    )}
                  >
                    #{provider.stats.rank}
                  </Badge>
                </div>

                {/* Holographic Background */}
                <div className="absolute inset-0 holographic opacity-5 pointer-events-none" />

                <CardHeader className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "absolute inset-0 rounded-lg blur-xl opacity-30",
                          provider.color.replace("from-", "bg-").split(" ")[0],
                        )}
                      />
                      <div className="relative flex items-center justify-center w-12 h-12 glass rounded-lg neon-border">
                        <provider.icon className="w-6 h-6 text-fire-orange" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle
                        className={cn(
                          "text-lg bg-gradient-to-r bg-clip-text text-transparent",
                          provider.color,
                        )}
                      >
                        {provider.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {provider.category}
                      </CardDescription>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {provider.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="glass rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Success</p>
                      <p className="font-bold text-fire-orange">
                        {provider.stats.successRate}%
                      </p>
                    </div>
                    <div className="glass rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Speed</p>
                      <p
                        className={cn(
                          "font-bold text-xs",
                          getSpeedColor(provider.speed),
                        )}
                      >
                        {provider.speed}
                      </p>
                    </div>
                    <div className="glass rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Quality</p>
                      <p
                        className={cn(
                          "font-bold text-xs",
                          getQualityColor(provider.quality),
                        )}
                      >
                        {provider.quality}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {provider.features.slice(0, 3).map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* API Key Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">API Key</label>
                      <span className="text-xs text-muted-foreground">
                        {provider.pricing}
                      </span>
                    </div>

                    <div className="relative">
                      <Input
                        type={showApiKeys[provider.id] ? "text" : "password"}
                        placeholder={
                          status === "valid"
                            ? "Configured ✓"
                            : provider.placeholder
                        }
                        value={apiKeys[provider.id] || ""}
                        onChange={(e) => {
                          setApiKeys((prev) => ({
                            ...prev,
                            [provider.id]: e.target.value,
                          }));
                          setApiKeyStatuses((prev) => ({
                            ...prev,
                            [provider.id]: null,
                          }));
                        }}
                        className="glass pr-20 text-sm"
                        disabled={status === "valid"}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setShowApiKeys((prev) => ({
                              ...prev,
                              [provider.id]: !prev[provider.id],
                            }))
                          }
                          className="h-8 w-8 p-0"
                        >
                          {showApiKeys[provider.id] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        {apiKeys[provider.id]?.trim() && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              testApiKey(provider.id, apiKeys[provider.id])
                            }
                            disabled={isTesting}
                            className="h-8 w-8 p-0"
                          >
                            {isTesting ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : status === "valid" ? (
                              <CheckCircle2 className="w-3 h-3 text-fire-orange" />
                            ) : (
                              <Rocket className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <a
                        href={`https://console.${provider.id}.com/keys`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-fire-orange hover:underline"
                      >
                        Get API Key →
                      </a>
                      {status === "valid" && (
                        <span className="text-xs text-fire-orange flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Ready to Fight!
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Usage Animation */}
                {provider.stats.rank <= 3 && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-fire-orange/20 to-fire-red/20">
                    <div
                      className="h-full bg-gradient-to-r from-fire-orange to-fire-red animate-pulse"
                      style={{ width: `${provider.stats.successRate}%` }}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contest Footer */}
        <div className="text-center space-y-4 py-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-fire-orange to-fire-red bg-clip-text text-transparent">
            17 AI Champions Enter... Only ONE Can Rule! 🔥
          </h3>
          <p className="text-muted-foreground">
            From Suno's creative genius to Val Town's coding mastery, from
            Groq's lightning speed to Claude's reasoning depth - the ultimate AI
            battle royale is HERE! Configure your champions and watch the epic
            contest unfold! 👑⚡
          </p>
        </div>
      </div>
    </div>
  );
}

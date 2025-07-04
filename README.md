# Musarty - The Ultimate AI Creation Hub 🔥🎵🎨

**Music • Art • AI Creation**

A production-ready, futuristic AI-powered platform that unifies 24+ AI models into one seamless creation hub. Generate text, images, videos, music, and code using the world's most powerful AI models with intelligent routing, usage metering, and secure key management.

![Musarty](https://img.shields.io/badge/24+%20AI%20Models-Unified%20Hub-orange)
![Production Ready](https://img.shields.io/badge/Production-Ready-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Full%20Stack-orange)
![Secure](https://img.shields.io/badge/Security-AES%20256%20Vault-red)

## ✨ What Musarty Is

**The Universal AI Creation Platform** - One interface, unlimited possibilities:

- **🎵 Music Generation**: Suno AI, Stability AI
- **🎨 Image Creation**: DALL-E 3, Midjourney, Stability SDXL
- **🎥 Video Production**: Runway Gen3, AI video tools
- **📝 Text & Code**: GPT-4o, Claude, Llama, DeepSeek, 20+ models
- **🔧 Smart Routing**: Shot Caller system intelligently routes to best AI
- **🔐 Secure Vault**: Military-grade API key encryption & rotation
- **💰 Flexible Billing**: BYOK unlimited or pay-as-you-go blocks

## 🎯 The AI Arsenal (24 Models)

### ⚡ Group 1: Fast Text & Daily Hustle (10 Models)

_Lightning speed, low cost, unlimited BYOK_

| Model                 | Provider | Speed  | Cost    | Best For           |
| --------------------- | -------- | ------ | ------- | ------------------ |
| **Llama 4 Scout**     | Groq     | ⚡⚡⚡ | $0.30/M | Daily text, coding |
| **Llama 3.3 70B**     | Groq     | ⚡⚡⚡ | $0.30/M | Versatile tasks    |
| **GPT-4o Mini**       | OpenAI   | ⚡⚡   | $5.00/M | Reliable baseline  |
| **Gemini 2.0 Flash**  | Google   | ⚡⚡⚡ | $0.10/M | Cheapest option    |
| **DeepSeek V3**       | DeepSeek | ⚡⚡   | $0.14/M | Reasoning tasks    |
| **Mistral Codestral** | Mistral  | ⚡⚡⚡ | $0.30/M | 80+ languages      |
| **Nova Lite**         | Amazon   | ⚡⚡⚡ | $0.06/M | Ultra budget       |
| **Morph V2**          | Morph    | ⚡⚡⚡ | $0.90/M | 1600 tok/sec       |
| **Grok 3 Mini**       | xAI      | ⚡⚡   | $0.30/M | Thinking machine   |
| **Together Llama**    | Together | ⚡⚡⚡ | $0.20/M | Open source        |

### 💪 Group 2: Heavy Compute & Complex Reasoning (9 Models)

_Premium quality, always metered_

| Model                    | Provider   | Quality | Cost    | Best For           |
| ------------------------ | ---------- | ------- | ------- | ------------------ |
| **Claude 3.5 Sonnet**    | Anthropic  | 🏆🏆🏆  | $3.00/M | Deep reasoning     |
| **Claude 3.5 Haiku**     | Anthropic  | 🏆🏆🏆  | $3.00/M | Fast reasoning     |
| **GPT-4o**               | OpenAI     | 🏆🏆🏆  | $5.00/M | Industry standard  |
| **GPT-4 Turbo**          | OpenAI     | 🏆🏆🏆  | $5.00/M | Long context       |
| **Gemini 1.5 Pro**       | Google     | 🏆🏆    | $0.10/M | 1M context         |
| **Mistral Magistral**    | Mistral    | 🏆🏆🏆  | $2.00/M | Complex thinking   |
| **Mistral Pixtral**      | Mistral    | 🏆🏆🏆  | $2.00/M | Vision master      |
| **Perplexity Sonar Pro** | Perplexity | 🏆🏆    | $3.00/M | Search + reasoning |
| **v0 1.5 Large**         | Vercel     | 🏆🏆🏆  | $2.00/M | UI specialist      |

### 🎨 Specialty: Creative & Visual (5 Models)

_Always metered, premium creative_

| Model              | Provider   | Type  | Cost    | Best For        |
| ------------------ | ---------- | ----- | ------- | --------------- |
| **DALL-E 3**       | OpenAI     | Image | $3.00/M | Precision art   |
| **Midjourney v6**  | Midjourney | Image | $4.00/M | Artistic genius |
| **Stability SDXL** | Stability  | Image | $1.50/M | Open source     |
| **Runway Gen3**    | Runway     | Video | $5.00/M | Video wizard    |
| **Suno v3**        | Suno       | Music | $3.00/M | Music master    |

## 🏗️ Architecture

### 🎯 Shot Caller System

The intelligent request orchestrator that:

- **Routes requests** to optimal AI models
- **Manages billing** (BYOK vs blocks)
- **Handles authentication** and rate limiting
- **Tracks usage** and analytics
- **Encrypts API keys** with AES-256

### 🔐 Musarty Vault

Military-grade API key management:

- **AES-256 encryption** for all stored keys
- **Automatic rotation** every 1000 characters
- **Zero logging** of raw keys
- **Smart key selection** based on usage
- **Cooling periods** to prevent overuse

### 📊 Block System

- **Group 1 + BYOK**: Unlimited text generation
- **Group 1 + Vault**: 1 block per 1000 characters
- **Group 2**: 2 blocks per request
- **Specialty**: 1 block per generation

## 🛠️ Tech Stack

### Frontend

- **React 18** + TypeScript + Vite
- **TailwindCSS** with futuristic fire theme
- **Radix UI** components + Lucide icons
- **React Router 6** (SPA mode)
- **React Query** for state management

### Backend

- **Express.js** + TypeScript
- **Zod** validation + **Multer** uploads
- **24+ AI Provider SDKs**
- **Custom encryption** + **Usage tracking**

### Security

- **AES-256** key encryption
- **JWT** authentication (coming)
- **Rate limiting** + **CORS**
- **Environment** variable protection

## 🚀 Quick Start

### 1. Installation

```bash
git clone <repo-url>
cd musarty
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Master encryption key
MASTER_ENCRYPTION_KEY=your-super-secure-key

# Musarty's Vault Keys (5+ recommended per provider)
OPENAI_KEY_1=sk-your-openai-key-1
OPENAI_KEY_2=sk-your-openai-key-2
GROQ_KEY_1=gsk-your-groq-key-1
ANTHROPIC_KEY_1=sk-ant-your-anthropic-key
GEMINI_KEY_1=AIza-your-gemini-key

# Optional: User fallback
GROQ_API_KEY=gsk-fallback-key
```

### 3. Launch

```bash
npm run dev
```

Open `http://localhost:8080` and start creating!

## 🎮 Usage

### For Users

1. **Sign up** → Get 3 free generations
2. **Choose tool**: Text, Image, Video, Music
3. **Pick model** or let Musarty choose optimal
4. **Generate** with BYOK unlimited or pay blocks

### For Developers

```typescript
// Shot Caller API
POST /api/shot-caller/generate
{
  "user_id": "user123",
  "model_id": "gpt-4o",
  "input": "Generate a React component",
  "byok": true,
  "user_api_key": "sk-user-key..."
}
```

## 🔑 API Reference

### Core Endpoints

- `POST /api/shot-caller/generate` - Main AI generation
- `GET /api/models` - List all 24 models
- `GET /api/users/:id/usage` - Usage statistics
- `POST /api/users/initialize` - New user setup
- `GET /api/vault/stats` - Vault monitoring

### Authentication (Coming Soon)

- **Clerk** integration for user auth
- **JWT** tokens for API access
- **Role-based** permissions

## 💰 Pricing

### Free Tier

- **3 free generations** of anything
- No credit card required
- Access to all tools

### Pro Unlimited ($4.99)

- **Unlimited text** with your API keys
- **Access to all 29 models**
- **Pay-as-you-go** for images/video/music
- **BYOK support** for cost control

### Block Pricing

- **1000 text chars** = 1 block
- **4 images** = 1 block
- **1 video** = 1 block
- **1 music track** = 1 block

## 🛣️ Roadmap

### Phase 1: Foundation ✅

- [x] 24 AI models integrated
- [x] Shot Caller system
- [x] Vault security system
- [x] Pricing & billing
- [x] Basic UI/UX

### Phase 2: User Experience 🚧

- [ ] **Clerk authentication**
- [ ] User dashboards & analytics
- [ ] Advanced model selection
- [ ] File management system
- [ ] Mobile app (React Native)

### Phase 3: Enterprise 🔮

- [ ] Team collaboration
- [ ] Custom model training
- [ ] White-label solutions
- [ ] Advanced analytics
- [ ] Enterprise SSO

### Phase 4: Ecosystem 🌟

- [ ] Plugin marketplace
- [ ] Third-party integrations
- [ ] API marketplace
- [ ] Developer tools
- [ ] Community features

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Documentation**: Coming soon
- **Discord**: [Join our community](https://discord.gg/musarty)
- **Email**: support@musarty.com
- **GitHub Issues**: For bugs and feature requests

---

**Built with 🔥 by the Musarty team**

_The future of AI creation is here. Welcome to Musarty._

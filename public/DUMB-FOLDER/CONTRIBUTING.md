# Contributing to Musarty

We welcome contributions to Musarty! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- TypeScript knowledge
- React and Express.js experience
- Understanding of AI APIs (OpenAI, Anthropic, etc.)

### Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/musarty.git
cd musarty
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Add your API keys for testing
```

3. **Start development server**

```bash
npm run dev
```

## 🏗️ Architecture Overview

### Core Systems

- **Shot Caller**: Main orchestration system (`server/services/shot-caller.ts`)
- **Vault System**: Secure API key management (`server/services/vault_musarty.ts`)
- **Model Groups**: AI model categorization (`server/config/model-groups.ts`)
- **Frontend**: React SPA with TailwindCSS fire theme

### Key Principles

1. **Security First**: All API keys encrypted, zero logging
2. **Type Safety**: Full TypeScript coverage
3. **Scalability**: Designed for 100+ AI models
4. **User Experience**: Intelligent routing, clear error messages
5. **Performance**: Optimized for speed and reliability

## 📝 Contribution Types

### 🤖 Adding New AI Models

**Process:**

1. Add model definition to `server/config/model-groups.ts`
2. Create provider service if needed
3. Update Shot Caller routing
4. Add frontend UI (optional)
5. Update documentation

**Example:**

```typescript
// In model-groups.ts
{
  id: "new-ai-model-v1",
  name: "New AI Model",
  provider: "provider-name",
  pricing: "$1.00/M tokens",
  speed: "Fast",
  quality: "Excellent",
  category: "Text Generator",
}
```

### 🎨 UI/UX Improvements

**Guidelines:**

- Follow the fire orange theme (`--fire-orange: 25 100% 60%`)
- Use existing Radix UI components
- Maintain glassmorphism aesthetics
- Ensure mobile responsiveness
- Include accessibility features

### 🔧 Backend Features

**Areas for contribution:**

- New API endpoints
- Enhanced security features
- Performance optimizations
- Database integrations
- Monitoring and analytics

### 📱 Frontend Features

**Areas for contribution:**

- New generation interfaces
- User dashboard improvements
- Mobile app development
- Advanced settings
- Real-time features

## 🎯 Coding Standards

### TypeScript

```typescript
// Use strict typing
interface GenerationRequest {
  user_id: string;
  model_id: string;
  input: string;
  byok: boolean;
}

// Prefer explicit return types
export async function processRequest(
  request: GenerationRequest,
): Promise<GenerationResponse> {
  // Implementation
}
```

### React Components

```typescript
// Use functional components with TypeScript
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export function MyComponent({ title, onSubmit }: ComponentProps) {
  // Implementation
}
```

### Styling

```typescript
// Use cn() utility for conditional classes
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className // Allow overrides
)}
```

### API Routes

```typescript
// Use proper error handling
export const handleApiRoute: RequestHandler = async (req, res) => {
  try {
    // Validate input
    const data = RequestSchema.parse(req.body);

    // Process request
    const result = await processData(data);

    // Return response
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Manual Testing

1. Test all AI models work correctly
2. Verify billing logic is accurate
3. Check error handling and edge cases
4. Ensure security measures are effective

### Test Coverage Areas

- **Shot Caller**: Request routing and billing
- **Vault System**: Key encryption and rotation
- **API Endpoints**: All routes and error cases
- **Frontend Components**: User interactions
- **Security**: API key handling and encryption

## 📋 Pull Request Process

### Before Submitting

1. **Test thoroughly** - All features work as expected
2. **Update documentation** - README, code comments
3. **Follow code style** - TypeScript, formatting
4. **Add tests** - For new features
5. **Security review** - No exposed secrets

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Security review done

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🐛 Bug Reports

### Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**

1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**

- OS: [e.g. macOS]
- Browser: [e.g. Chrome]
- Version: [e.g. 1.0.0]

**Additional Context**
Screenshots, logs, etc.
```

## 💡 Feature Requests

### Template

```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What problem does this solve?

**Proposed Solution**
How would you implement this?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Mockups, examples, etc.
```

## 🎨 Design Guidelines

### Color Palette

```css
/* Primary fire theme */
--fire-orange: 25 100% 60%;
--fire-red: 15 100% 50%;
--fire-yellow: 35 100% 55%;

/* Supporting colors */
--background: 0 0% 0%;
--foreground: 0 0% 98%;
--glass-bg: 240 10% 3.9%;
```

### Component Patterns

```typescript
// Glass effect cards
<Card className="glass-strong neon-border">
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// Fire gradient buttons
<Button className="bg-gradient-to-r from-fire-orange to-fire-red">
  Action Button
</Button>

// Neon glow effects
<div className="neon-glow pulse-glow">
  {/* Glowing element */}
</div>
```

## 🔐 Security Guidelines

### API Key Handling

- **Never log raw API keys**
- **Always encrypt before storage**
- **Use environment variables for secrets**
- **Validate all inputs**
- **Sanitize outputs**

### Code Review Checklist

- [ ] No hardcoded secrets
- [ ] Proper input validation
- [ ] Error handling doesn't expose internals
- [ ] Authentication/authorization checks
- [ ] SQL injection protection (if applicable)

## 📚 Resources

### Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/)

### AI Provider APIs

- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic API](https://docs.anthropic.com/)
- [Groq API](https://console.groq.com/docs)
- [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🤝 Community

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time chat and support
- **Email**: security@musarty.com for security issues

### Recognition

Contributors will be:

- Listed in README.md
- Credited in release notes
- Invited to Discord contributor channel
- Eligible for early access features

## 📄 License

By contributing to Musarty, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Musarty! 🔥**

Together we're building the future of AI creation.

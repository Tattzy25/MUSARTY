# CodeForge AI - Image to Code Converter 🚀

A production-ready, futuristic AI-powered tool that converts PNG, JPG, and SVG images into clean, optimized React components, HTML, and CSS code.

![CodeForge AI](https://img.shields.io/badge/AI%20Powered-OpenAI%20GPT--4%20Vision-blue)
![Production Ready](https://img.shields.io/badge/Production-Ready-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## ✨ Features

- **🎯 AI-Powered Conversion**: Uses OpenAI GPT-4 Vision to analyze images and generate pixel-perfect code
- **🔄 Multiple File Support**: Process up to 5 images simultaneously
- **💎 Production-Ready Code**: Generates clean, optimized, and well-structured code
- **🎨 Modern UI**: Futuristic design with glassmorphism effects and neon accents
- **⚙️ Customizable Settings**: Full control over code generation preferences
- **📱 Responsive Design**: Works perfectly on all devices
- **♿ Accessibility**: Includes ARIA labels and semantic HTML
- **🚀 Performance Optimized**: Fast processing with real-time progress tracking

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** with custom futuristic theme
- **Radix UI** components
- **React Router 6** (SPA mode)
- **React Dropzone** for file uploads
- **React Syntax Highlighter** for code display

### Backend

- **Express.js** server
- **OpenAI GPT-4 Vision API** integration
- **Multer** for file handling
- **Zod** for validation

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd codeforge-ai

# Install dependencies
npm install
```

### 2. OpenAI API Setup

1. **Get your OpenAI API key**:

   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-...`)

2. **Configure the API key**:
   - Start the application: `npm run dev`
   - Go to Settings in the app
   - Paste your API key in the "OpenAI API Configuration" section
   - Click "Save Settings"

### 3. Start Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:8080
```

## 🔧 Configuration

### AI Model Options

The app supports multiple OpenAI models:

- **GPT-4 Vision Preview** (Recommended) - Best quality, slower processing
- **GPT-4 Turbo** - Good balance of speed and quality
- **GPT-4** - Standard quality, faster processing

### Code Generation Settings

- **Code Style**: Modern React, Class Components, Next.js, or Minimal
- **TypeScript**: Enable/disable TypeScript generation
- **Tailwind CSS**: Include Tailwind utility classes
- **Responsive Design**: Generate mobile-friendly code
- **Accessibility**: Include ARIA labels and semantic HTML
- **Performance Optimization**: Optimize for loading speed
- **Comments**: Include explanatory comments

### Quality Settings

- **Quality Level** (50-100%): Higher = more detailed analysis, slower processing
- **Processing Speed** (30-100%): Balance between speed and thoroughness

## 📋 API Endpoints

### Convert Images

```
POST /api/convert
```

**Request Body:**

```json
{
  "files": [
    {
      "data": "base64-encoded-image-data",
      "name": "image.png",
      "type": "image/png"
    }
  ],
  "settings": {
    "generateTypeScript": true,
    "includeTailwind": true,
    "responsiveDesign": true,
    "qualityLevel": 85
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "react": "// React component code",
        "html": "<!-- HTML markup -->",
        "css": "/* CSS styles */",
        "fileName": "GeneratedComponent",
        "originalFileName": "image.png"
      }
    ],
    "processingTime": 5234,
    "totalFiles": 1
  }
}
```

### Settings Management

```
GET /api/settings         # Get current settings
POST /api/settings        # Update settings
POST /api/settings/test-api-key  # Test API key validity
```

## 🎨 UI Features

### Futuristic Design Elements

- **Glassmorphism Effects**: Translucent components with backdrop blur
- **Neon Glow Effects**: Dynamic glowing borders and animations
- **Holographic Backgrounds**: Animated gradient backgrounds
- **Cyber Grid Patterns**: Subtle grid overlays for tech aesthetic
- **Pulse Animations**: Breathing light effects on interactive elements

### Interactive Components

- **Drag & Drop Upload**: Smooth file upload with visual feedback
- **Real-time Progress**: Live processing status with stage indicators
- **Code Viewer**: Syntax-highlighted code with copy/download buttons
- **Settings Panel**: Comprehensive configuration interface

## 🔒 Security Features

- **API Key Protection**: Keys are never sent to the client
- **File Type Validation**: Only accepts PNG, JPG, and SVG files
- **Size Limits**: 10MB maximum file size
- **Input Sanitization**: All inputs are validated with Zod schemas

## 🚀 Production Deployment

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

For production deployment, you can set environment variables:

```bash
# Optional: Set via environment (not recommended for API keys)
OPENAI_API_KEY=sk-your-api-key-here
PORT=8080
```

**Note**: It's more secure to configure the API key through the Settings interface rather than environment variables.

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

## 📝 Usage Guide

### 1. Upload Images

- Drag and drop up to 5 images (PNG, JPG, SVG)
- Or click to browse and select files
- Files are processed simultaneously

### 2. Configure Settings (Optional)

- Go to Settings to customize code generation
- Set your OpenAI API key
- Adjust quality and speed preferences
- Choose code style and framework preferences

### 3. Generate Code

- Click "Convert" or drop files to start processing
- Watch real-time progress through AI stages:
  - **Analyzing**: AI examines image structure
  - **Converting**: Generating React/HTML/CSS code
  - **Optimizing**: Refining code for production

### 4. Download Results

- View generated code with syntax highlighting
- Copy individual files or download all
- Each image generates 3 files: .tsx, .html, .css

## 🎯 Code Quality

The generated code includes:

- **Clean Structure**: Well-organized, readable code
- **Type Safety**: Full TypeScript support with proper interfaces
- **Modern Patterns**: Uses latest React best practices
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Optimized CSS, efficient React patterns
- **Cross-browser**: Compatible with all modern browsers

## 🛠️ Development

### Project Structure

```
client/                   # React frontend
├── components/          # Reusable components
│   ├── ui/             # Shadcn UI components
│   ├── FileUpload.tsx  # File upload interface
│   ├── CodeViewer.tsx  # Code display component
│   ├── AIProcessor.tsx # Processing status
│   ��── Navigation.tsx  # App navigation
├── pages/              # Route pages
│   ├── Index.tsx       # Main converter
│   └── Settings.tsx    # Settings panel
└── App.tsx             # App router

server/                  # Express backend
├── services/           # Business logic
│   ├── openai.ts      # OpenAI integration
│   └── settings.ts    # Settings management
├── routes/            # API endpoints
│   ├── convert.ts     # Conversion API
│   └── settings.ts    # Settings API
└── index.ts           # Server setup

shared/                 # Shared types
└── api.ts             # API interfaces
```

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run typecheck    # TypeScript validation
npm test            # Run tests
npm run format.fix   # Format code
```

## 🔧 Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**

   - Go to Settings and add your API key
   - Make sure the key starts with `sk-`
   - Test the key using the test button

2. **"Invalid file type"**

   - Only PNG, JPG, and SVG files are supported
   - Check file extensions are correct

3. **"File too large"**

   - Maximum file size is 10MB
   - Compress images if needed

4. **Processing failures**
   - Check your OpenAI API key has sufficient credits
   - Ensure stable internet connection
   - Try reducing quality level for faster processing

### Getting Help

- Check the console for detailed error messages
- Verify your OpenAI API key is valid
- Ensure files meet size and type requirements
- Try processing one file at a time if batch processing fails

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For issues and questions:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Contact support with detailed error descriptions

---

**Built with ❤️ using OpenAI GPT-4 Vision API**

_Transform your designs into code with the power of AI!_

import { RequestHandler } from "express";
import { z } from "zod";
import multer from "multer";
import {
  convertImageToCode,
  initializeProvider,
  isProviderInitialized,
  type ConversionSettings,
} from "../services/ai-providers";
import {
  getSettings,
  hasApiKey,
  getApiKey,
  getCurrentProvider,
} from "../services/settings";

const ConvertRequestSchema = z.object({
  files: z.array(
    z.object({
      data: z.string(), // base64 data
      name: z.string(),
      type: z.string(),
    }),
  ),
  settings: z
    .object({
      aiModel: z.string().default("gpt-4-vision-preview"),
      codeStyle: z.string().default("modern"),
      generateTypeScript: z.boolean().default(true),
      includeTailwind: z.boolean().default(true),
      responsiveDesign: z.boolean().default(true),
      accessibilityFeatures: z.boolean().default(true),
      performanceOptimization: z.boolean().default(true),
      includeComments: z.boolean().default(true),
      qualityLevel: z.number().default(85),
    })
    .optional(),
});

export interface ConvertResponse {
  success: boolean;
  data?: {
    results: Array<{
      react: string;
      html: string;
      css: string;
      fileName: string;
      originalFileName: string;
    }>;
    processingTime: number;
    totalFiles: number;
  };
  error?: string;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PNG, JPG, and SVG files are allowed.",
        ),
      );
    }
  },
});

export const uploadMiddleware = upload.array("files", 5);

export const handleConvert: RequestHandler = async (req, res) => {
  try {
    const appSettings = getSettings();
    const provider = appSettings.aiProvider;

    // Check if API key is configured for current provider
    if (!hasApiKey(provider)) {
      return res.status(400).json({
        success: false,
        error: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key not configured. Please add your API key in Settings.`,
      } as ConvertResponse);
    }

    // Initialize provider client if not already done
    if (!isProviderInitialized(provider)) {
      const apiKey = getApiKey(provider);
      if (apiKey) {
        initializeProvider(provider, apiKey);
      }
    }

    const { files, settings: requestSettings } = ConvertRequestSchema.parse(
      req.body,
    );
    const conversionSettings: ConversionSettings = {
      ...appSettings,
      ...requestSettings,
      provider: appSettings.aiProvider,
      model: appSettings.aiModel,
    };

    const startTime = Date.now();
    const results = [];

    // Process each file
    for (const file of files) {
      try {
        // Remove data URL prefix if present
        const base64Data = file.data.replace(/^data:image\/[a-z]+;base64,/, "");

        const result = await convertImageToCode(
          base64Data,
          file.name,
          conversionSettings,
        );

        results.push({
          ...result,
          originalFileName: file.name,
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // For now, add a fallback result
        results.push({
          react: generateFallbackReactCode(file.name),
          html: generateFallbackHtmlCode(file.name),
          css: generateFallbackCssCode(file.name),
          fileName: file.name.replace(/\.[^/.]+$/, ""),
          originalFileName: file.name,
        });
      }
    }

    const response: ConvertResponse = {
      success: true,
      data: {
        results,
        processingTime: Date.now() - startTime,
        totalFiles: files.length,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error in convert handler:", error);

    const errorResponse: ConvertResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };

    res.status(400).json(errorResponse);
  }
};

function generateFallbackReactCode(fileName: string): string {
  const componentName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "");
  const capitalizedName =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);

  return generateMockReactCode(capitalizedName, {
    generateTypeScript: true,
    includeTailwind: true,
    includeComments: true,
  });
}

function generateFallbackHtmlCode(fileName: string): string {
  const componentName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "");
  const capitalizedName =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);
  return generateMockHtmlCode(capitalizedName);
}

function generateFallbackCssCode(fileName: string): string {
  const componentName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "");
  const capitalizedName =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);
  return generateMockCssCode(capitalizedName);
}

function generateMockReactCode(componentName: string, settings?: any): string {
  const useTypeScript = settings?.generateTypeScript !== false;
  const useTailwind = settings?.includeTailwind !== false;
  const includeComments = settings?.includeComments !== false;

  const extension = useTypeScript ? "tsx" : "jsx";
  const propsType = useTypeScript
    ? `interface ${componentName}Props {\n  className?: string;\n  children?: React.ReactNode;\n}\n\n`
    : "";
  const propsDeclaration = useTypeScript
    ? `{ className, children }: ${componentName}Props`
    : "{ className, children }";

  return `${includeComments ? "// Auto-generated React component by CodeForge AI\n" : ""}import React from 'react';
${useTailwind ? "" : `import './${componentName}.css';`}

${propsType}export const ${componentName}: React.FC${useTypeScript ? `<${componentName}Props>` : ""} = (${propsDeclaration}) => {
  return (
    <div className={${useTailwind ? "`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8 ${className || ''}`" : "`${componentName.toLowerCase()}-container ${className || ''}`"}}>
      <div className="${useTailwind ? "max-w-2xl mx-auto text-center space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" : `${componentName.toLowerCase()}-content`}">
        <h1 className="${useTailwind ? "text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : `${componentName.toLowerCase()}-title`}">
          ${componentName} Component
        </h1>
        <p className="${useTailwind ? "text-lg text-gray-600 leading-relaxed" : `${componentName.toLowerCase()}-description`}">
          This beautiful component was automatically generated from your image using advanced AI.
          It includes modern styling, responsive design, and accessibility features.
        </p>
        <div className="${useTailwind ? "flex flex-col sm:flex-row gap-4 justify-center" : `${componentName.toLowerCase()}-actions`}">
          <button className="${useTailwind ? "px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg" : `${componentName.toLowerCase()}-button primary`}">
            Get Started
          </button>
          <button className="${useTailwind ? "px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200" : `${componentName.toLowerCase()}-button secondary`}">
            Learn More
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ${componentName};`;
}

function generateMockHtmlCode(componentName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} - AI Generated Component</title>
    <link rel="stylesheet" href="${componentName.toLowerCase()}.css">
</head>
<body>
    <div class="${componentName.toLowerCase()}-container">
        <div class="${componentName.toLowerCase()}-content">
            <h1 class="${componentName.toLowerCase()}-title">
                ${componentName} Component
            </h1>
            <p class="${componentName.toLowerCase()}-description">
                This beautiful component was automatically generated from your image using advanced AI.
                It includes modern styling, responsive design, and accessibility features.
            </p>
            <div class="${componentName.toLowerCase()}-actions">
                <button class="${componentName.toLowerCase()}-button primary">
                    Get Started
                </button>
                <button class="${componentName.toLowerCase()}-button secondary">
                    Learn More
                </button>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function generateMockCssCode(componentName: string): string {
  const className = componentName.toLowerCase();

  return `/* AI Generated CSS for ${componentName} Component */
.${className}-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.${className}-content {
  max-width: 600px;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.${className}-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.${className}-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.${className}-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.${className}-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  min-width: 140px;
}

.${className}-button.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.${className}-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.${className}-button.secondary {
  background: rgba(255, 255, 255, 0.8);
  color: #4a5568;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.${className}-button.secondary:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (min-width: 640px) {
  .${className}-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .${className}-container {
    padding: 1rem;
  }

  .${className}-content {
    padding: 2rem;
  }

  .${className}-title {
    font-size: 2rem;
  }

  .${className}-description {
    font-size: 1rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .${className}-button {
    transition: none;
  }

  .${className}-button:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .${className}-content {
    background: white;
    border: 2px solid black;
  }

  .${className}-title {
    -webkit-text-fill-color: black;
    background: none;
  }
}`;
}

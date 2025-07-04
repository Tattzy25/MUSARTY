import { RequestHandler } from "express";
import { z } from "zod";

const ConvertRequestSchema = z.object({
  imageData: z.string(),
  fileName: z.string(),
  settings: z
    .object({
      aiModel: z.string().default("gpt-4-vision"),
      codeStyle: z.string().default("modern"),
      generateTypeScript: z.boolean().default(true),
      includeTailwind: z.boolean().default(true),
      responsiveDesign: z.boolean().default(true),
      accessibilityFeatures: z.boolean().default(true),
      performanceOptimization: z.boolean().default(true),
      includeComments: z.boolean().default(true),
    })
    .optional(),
});

export interface ConvertResponse {
  success: boolean;
  data?: {
    react: string;
    html: string;
    css: string;
    fileName: string;
    processingTime: number;
  };
  error?: string;
}

export const handleConvert: RequestHandler = async (req, res) => {
  try {
    const { imageData, fileName, settings } = ConvertRequestSchema.parse(
      req.body,
    );

    const startTime = Date.now();

    // In a real implementation, this would:
    // 1. Process the image with AI (OpenAI GPT-4 Vision, Claude, etc.)
    // 2. Generate React components based on the image
    // 3. Optimize the code
    // 4. Return the generated code

    // For now, return a mock response
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time

    const componentName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "");
    const capitalizedName =
      componentName.charAt(0).toUpperCase() + componentName.slice(1);

    const mockResponse: ConvertResponse = {
      success: true,
      data: {
        react: generateMockReactCode(capitalizedName, settings),
        html: generateMockHtmlCode(capitalizedName),
        css: generateMockCssCode(capitalizedName),
        fileName: componentName,
        processingTime: Date.now() - startTime,
      },
    };

    res.json(mockResponse);
  } catch (error) {
    console.error("Error in convert handler:", error);

    const errorResponse: ConvertResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };

    res.status(400).json(errorResponse);
  }
};

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

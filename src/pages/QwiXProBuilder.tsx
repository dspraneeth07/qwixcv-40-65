import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { generateQwiXProContent, generateProjectDescription } from '@/utils/qwixProApi';
import {
  Code,
  FileText,
  RefreshCw,
  Download,
  Eye,
  ExternalLink,
  Save,
  Trash,
  Edit,
  Copy,
  Settings,
  Upload,
  Search,
  Plus
} from 'lucide-react';

const ProjectTemplates = [
  {
    id: 'react-tailwind',
    name: 'React + Tailwind CSS',
    description: 'Modern React app with Tailwind CSS styling',
    icon: '⚛️',
    dependencies: ['react', 'react-dom', 'tailwindcss', 'postcss', 'autoprefixer']
  },
  {
    id: 'nextjs-dashboard',
    name: 'Next.js Dashboard',
    description: 'Full-featured admin dashboard with Next.js',
    icon: '📊',
    dependencies: ['next', 'react', 'react-dom', 'chart.js', 'tailwindcss']
  },
  {
    id: 'mern-stack',
    name: 'MERN Stack App',
    description: 'MongoDB, Express, React, and Node.js full-stack app',
    icon: '🔄',
    dependencies: ['react', 'express', 'mongoose', 'axios', 'nodemon']
  },
  {
    id: 'react-typescript',
    name: 'React + TypeScript',
    description: 'Type-safe React application with TypeScript',
    icon: '📝',
    dependencies: ['react', 'typescript', 'react-dom', '@types/react', '@types/react-dom']
  }
];

const QwiXProBuilder: React.FC = () => {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('code');
  const [previewUrl, setPreviewUrl] = useState('');
  const [projectFiles, setProjectFiles] = useState<{path: string, content: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [projectSettings, setProjectSettings] = useState({
    includeTests: true,
    includeDocumentation: true,
    createGitRepo: false,
    deploymentReady: true,
    privatePackages: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate project based on specifications
  const handleGenerateProject = async () => {
    if (!projectName || !selectedTemplate) {
      toast({
        title: "Missing information",
        description: "Please provide a project name and select a template.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get the selected template details
      const template = ProjectTemplates.find(t => t.id === selectedTemplate);
      
      // Generate project description with Gemini API if not provided by user
      let projectDesc = projectDescription;
      if (!projectDesc && template) {
        try {
          projectDesc = await generateProjectDescription(
            projectName, 
            template.dependencies, 
            "Developer"
          );
        } catch (error) {
          console.error("Failed to generate project description:", error);
          // Fall back to default description if API fails
          projectDesc = `A ${template.name} project created with QwiXProBuilder.`;
        }
      }
      
      // Generate files based on template and AI
      const generatedFiles = await generateProjectFiles(selectedTemplate || '', projectName, projectDesc);
      
      const mockProject = {
        name: projectName,
        description: projectDesc,
        template: template?.name || "Custom Project",
        createdAt: new Date().toISOString(),
        dependencies: template?.dependencies || [],
        files: generatedFiles
      };
      
      setGeneratedProject(mockProject);
      setProjectFiles(mockProject.files);
      setSelectedFile(mockProject.files[0].path);
      setFileContent(mockProject.files[0].content);
      
      // Set mock preview URL
      setPreviewUrl(`https://preview.qwixpro.dev/${projectName.toLowerCase().replace(/\s+/g, '-')}`);
      
      toast({
        title: "Project generated successfully",
        description: "Your project has been created and is ready for review.",
      });
      
      // Switch to code tab to show the generated code
      setActiveTab('code');
    } catch (error) {
      console.error("Error generating project:", error);
      toast({
        title: "Generation failed",
        description: "There was a problem generating your project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate project files using Gemini API
  const generateProjectFiles = async (templateId: string, name: string, description: string) => {
    const sanitizedName = name.toLowerCase().replace(/\s+/g, '-');
    
    // Basic files every project will have
    const commonFiles = [
      {
        path: 'README.md',
        content: `# ${name}\n\n${description || 'A project generated with QwiXProBuilder.'}\n\n## Getting Started\n\nInstall dependencies:\n\n\`\`\`\nnpm install\n\`\`\`\n\nStart the development server:\n\n\`\`\`\nnpm run dev\n\`\`\`\n`
      },
      {
        path: 'package.json',
        content: `{\n  "name": "${sanitizedName}",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`
      }
    ];
    
    // Generate template-specific files using AI
    let templateFiles: {path: string, content: string}[] = [];
    
    try {
      switch (templateId) {
        case 'react-tailwind':
          templateFiles = await generateReactTailwindFiles(name, description);
          break;
          
        case 'nextjs-dashboard':
          templateFiles = await generateNextJsDashboardFiles(name, description);
          break;
          
        case 'mern-stack':
          templateFiles = await generateMERNStackFiles(name, description, sanitizedName);
          break;
          
        case 'react-typescript':
          templateFiles = await generateReactTypeScriptFiles(name, description);
          break;
      }
    } catch (error) {
      console.error("Error generating template files:", error);
      // Fall back to hardcoded files if API fails
      templateFiles = generateFallbackTemplateFiles(templateId, name, description, sanitizedName);
    }
    
    return [...commonFiles, ...templateFiles];
  };
  
  // Generate React + Tailwind template files using Gemini API
  const generateReactTailwindFiles = async (name: string, description: string) => {
    try {
      const appJsxPrompt = `
        Generate a React functional component (App.jsx) for a project named "${name}" with this description: "${description}".
        It should use Tailwind CSS classes for styling and have:
        1. A responsive header with navigation
        2. A hero section with a title and description
        3. A features section with 3 feature cards
        4. A responsive footer
        
        Return only the complete React component code, nothing else.
      `;
      
      const appJsxContent = await generateQwiXProContent(appJsxPrompt);
      
      const tailwindConfigPrompt = `
        Generate a complete tailwind.config.js file with customizations for a project named "${name}".
        Include custom colors and font settings that would suit this project.
        
        Return only the configuration file code, nothing else.
      `;
      
      const tailwindConfigContent = await generateQwiXProContent(tailwindConfigPrompt);
      
      return [
        {
          path: 'src/App.jsx',
          content: appJsxContent
        },
        {
          path: 'tailwind.config.js',
          content: tailwindConfigContent
        },
        {
          path: 'src/index.jsx',
          content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`
        }
      ];
    } catch (error) {
      throw new Error(`Failed to generate React Tailwind files: ${error}`);
    }
  };
  
  // Generate Next.js dashboard files using Gemini API
  const generateNextJsDashboardFiles = async (name: string, description: string) => {
    try {
      const indexJsPrompt = `
        Generate a Next.js page component (pages/index.js) for a dashboard project named "${name}" with this description: "${description}".
        The page should import a Dashboard component and include proper Next.js Head component setup.
        
        Return only the complete Next.js page component code, nothing else.
      `;
      
      const indexJsContent = await generateQwiXProContent(indexJsPrompt);
      
      const dashboardComponentPrompt = `
        Generate a React functional component (Dashboard.jsx) for a dashboard project named "${name}".
        It should use Tailwind CSS for styling and include:
        1. A responsive navigation bar
        2. A dashboard header with title and actions
        3. A statistics summary section with 3-4 stat cards
        4. A main content area with a placeholder
        
        Return only the complete React component code, nothing else.
      `;
      
      const dashboardContent = await generateQwiXProContent(dashboardComponentPrompt);
      
      return [
        {
          path: 'pages/index.js',
          content: indexJsContent
        },
        {
          path: 'components/Dashboard.jsx',
          content: dashboardContent
        }
      ];
    } catch (error) {
      throw new Error(`Failed to generate Next.js dashboard files: ${error}`);
    }
  };
  
  // Generate MERN stack files using Gemini API
  const generateMERNStackFiles = async (name: string, description: string, sanitizedName: string) => {
    try {
      const serverJsPrompt = `
        Generate a Node.js Express server file (server.js) for a MERN stack project named "${name}" with this description: "${description}".
        Include:
        1. Express setup with necessary middleware
        2. MongoDB connection using mongoose
        3. Basic API routes structure
        4. Error handling
        5. Server startup code
        
        The MongoDB database name should be "${sanitizedName}".
        Return only the complete server.js code, nothing else.
      `;
      
      const serverJsContent = await generateQwiXProContent(serverJsPrompt);
      
      const clientAppJsPrompt = `
        Generate a React client-side App.js file for a MERN stack project named "${name}" with this description: "${description}".
        Include:
        1. State for storing data from the API
        2. useEffect hook to fetch data from the backend API
        3. Basic UI with React components
        4. Error handling for API requests
        
        Return only the complete React App.js code, nothing else.
      `;
      
      const clientAppJsContent = await generateQwiXProContent(clientAppJsPrompt);
      
      return [
        {
          path: 'server/server.js',
          content: serverJsContent
        },
        {
          path: 'client/src/App.js',
          content: clientAppJsContent
        }
      ];
    } catch (error) {
      throw new Error(`Failed to generate MERN stack files: ${error}`);
    }
  };
  
  // Generate React + TypeScript files using Gemini API
  const generateReactTypeScriptFiles = async (name: string, description: string) => {
    try {
      const appTsxPrompt = `
        Generate a React TypeScript component (App.tsx) for a project named "${name}" with this description: "${description}".
        Include:
        1. Proper TypeScript interfaces/types
        2. State management with useState and proper typing
        3. Event handlers with TypeScript event types
        4. A simple but functional UI
        
        Return only the complete TypeScript React component code, nothing else.
      `;
      
      const appTsxContent = await generateQwiXProContent(appTsxPrompt);
      
      const tsconfigPrompt = `
        Generate a complete tsconfig.json file for a React TypeScript project.
        Include standard settings for a modern React application.
        
        Return only the complete tsconfig.json content, nothing else.
      `;
      
      const tsconfigContent = await generateQwiXProContent(tsconfigPrompt);
      
      return [
        {
          path: 'src/App.tsx',
          content: appTsxContent
        },
        {
          path: 'tsconfig.json',
          content: tsconfigContent
        }
      ];
    } catch (error) {
      throw new Error(`Failed to generate React TypeScript files: ${error}`);
    }
  };
  
  // Fallback file generation if API fails
  const generateFallbackTemplateFiles = (
    templateId: string, 
    name: string, 
    description: string, 
    sanitizedName: string
  ) => {
    switch (templateId) {
      case 'react-tailwind':
        return [
          {
            path: 'src/App.jsx',
            content: `import React from 'react';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gray-100 flex items-center justify-center">\n      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">\n        <h1 className="text-3xl font-bold text-center mb-6">${name}</h1>\n        <p className="text-gray-600 text-center">\n          ${description || 'Edit src/App.jsx and save to reload.'}\n        </p>\n        <div className="mt-8 flex justify-center">\n          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">\n            Get Started\n          </button>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default App;\n`
          },
          {
            path: 'tailwind.config.js',
            content: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [\n    "./src/**/*.{js,jsx,ts,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\n`
          },
          {
            path: 'src/index.jsx',
            content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`
          }
        ];
        
      case 'nextjs-dashboard':
        return [
          {
            path: 'pages/index.js',
            content: `import Head from 'next/head';\nimport Dashboard from '../components/Dashboard';\n\nexport default function Home() {\n  return (\n    <div>\n      <Head>\n        <title>${name} - Dashboard</title>\n        <meta name="description" content="${description || 'Generated by QwiXProBuilder'}" />\n        <link rel="icon" href="/favicon.ico" />\n      </Head>\n\n      <main>\n        <Dashboard />\n      </main>\n    </div>\n  );\n}\n`
          },
          {
            path: 'components/Dashboard.jsx',
            content: `import React from 'react';\n\nexport default function Dashboard() {\n  return (\n    <div className="min-h-screen bg-gray-50">\n      <nav className="bg-white shadow-sm">\n        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n          <div className="flex justify-between h-16">\n            <div className="flex">\n              <div className="flex-shrink-0 flex items-center">\n                <h1 className="text-xl font-bold">${name}</h1>\n              </div>\n            </div>\n          </div>\n        </div>\n      </nav>\n\n      <div className="py-10">\n        <header>\n          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n            <h2 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h2>\n          </div>\n        </header>\n        <main>\n          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">\n            <div className="px-4 py-8 sm:px-0">\n              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">\n                <p className="text-lg text-gray-500">Your dashboard content goes here</p>\n              </div>\n            </div>\n          </div>\n        </main>\n      </div>\n    </div>\n  );\n}\n`
          }
        ];
        
      case 'mern-stack':
        return [
          {
            path: 'server/server.js',
            content: `const express = require('express');\nconst mongoose = require('mongoose');\nconst cors = require('cors');\nrequire('dotenv').config();\n\nconst app = express();\nconst PORT = process.env.PORT || 5000;\n\n// Middleware\napp.use(cors());\napp.use(express.json());\n\n// Connect to MongoDB\nmongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${sanitizedName}', {\n  useNewUrlParser: true,\n  useUnifiedTopology: true\n})\n  .then(() => console.log('Connected to MongoDB'))\n  .catch(err => console.error('Could not connect to MongoDB', err));\n\n// Routes\napp.get('/', (req, res) => {\n  res.send('API is running...');\n});\n\n// Start server\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));\n`
          },
          {
            path: 'client/src/App.js',
            content: `import React, { useState, useEffect } from 'react';\nimport axios from 'axios';\nimport './App.css';\n\nfunction App() {\n  const [message, setMessage] = useState('');\n\n  useEffect(() => {\n    // Fetch data from API\n    axios.get('http://localhost:5000/')\n      .then(res => setMessage(res.data))\n      .catch(err => console.error(err));\n  }, []);\n\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>${name}</h1>\n        <p>${description || 'A MERN stack application'}</p>\n        <div className="message-box">\n          <p>Message from server: {message}</p>\n        </div>\n      </header>\n    </div>\n  );\n}\n\nexport default App;\n`
          }
        ];
        
      case 'react-typescript':
        return [
          {
            path: 'src/App.tsx',
            content: `import React, { useState } from 'react';\nimport './App.css';\n\ninterface Item {\n  id: number;\n  text: string;\n}\n\nfunction App(): JSX.Element {\n  const [items, setItems] = useState<Item[]>([]);\n  const [text, setText] = useState<string>('');\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!text.trim()) return;\n    \n    const newItem: Item = {\n      id: Date.now(),\n      text\n    };\n    \n    setItems([...items, newItem]);\n    setText('');\n  };\n\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>${name}</h1>\n        <p>${description || 'A React TypeScript application'}</p>\n      </header>\n      \n      <main className="App-main">\n        <form onSubmit={handleSubmit} className="item-form">\n          <input \n            type="text" \n            value={text} \n            onChange={(e) => setText(e.target.value)} \n            placeholder="Add an item..." \n          />\n          <button type="submit">Add</button>\n        </form>\n        \n        <ul className="item-list">\n          {items.map((item) => (\n            <li key={item.id}>{item.text}</li>\n          ))}\n        </ul>\n      </main>\n    </div>\n  );\n}\n\nexport default App;\n`
          },
          {
            path: 'tsconfig.json',
            content: `{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": [\n      "dom",\n      "dom.iterable",\n      "esnext"\n    ],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "esModuleInterop": true,\n    "allowSyntheticDefaultImports": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noFallthroughCasesInSwitch": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx"\n  },\n  "include": [\n    "src"\n  ]\n}\n`
          }
        ];
        
      default:
        return [];
    }
  };
  
  // Update the selected file content
  const updateFileContent = () => {
    const updatedFiles = projectFiles.map(file => 
      file.path === selectedFile ? { ...file, content: fileContent } : file
    );
    setProjectFiles(updatedFiles);
    
    toast({
      title: "File updated",
      description: `${selectedFile} has been updated.`
    });
  };
  
  // Handle file selection
  const handleFileSelect = (filePath: string) => {
    if (selectedFile === filePath) return;
    
    // Find the file in projectFiles
    const file = projectFiles.find(f => f.path === filePath);
    if (file) {
      setSelectedFile(filePath);
      setFileContent(file.content);
    }
  };
  
  // Add a new file to the project
  const addNewFile = () => {
    const fileName = prompt("Enter file name (including path):");
    if (!fileName) return;
    
    // Check if file already exists
    if (projectFiles.some(file => file.path === fileName)) {
      toast({
        title: "File exists",
        description: "A file with this name already exists.",
        variant: "destructive"
      });
      return;
    }
    
    const newFile = {
      path: fileName,
      content: `// ${fileName}\n// Created with QwiXProBuilder\n\n`
    };
    
    setProjectFiles([...projectFiles, newFile]);
    setSelectedFile(fileName);
    setFileContent(newFile.content);
    
    toast({
      title: "File created",
      description: `${fileName} has been added to the project.`
    });
  };
  
  // Delete the selected file
  const deleteSelectedFile = () => {
    if (!selectedFile) return;
    
    if (projectFiles.length <= 1) {
      toast({
        title: "Cannot delete file",
        description: "Project must have at least one file.",
        variant: "destructive"
      });
      return;
    }
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedFile}?`);
    if (!confirmed) return;
    
    const filteredFiles = projectFiles.filter(file => file.path !== selectedFile);
    setProjectFiles(filteredFiles);
    setSelectedFile(filteredFiles[0].path);
    setFileContent(filteredFiles[0].content);
    
    toast({
      title: "File deleted",
      description: `${selectedFile} has been deleted.`
    });
  };
  
  // Download project as ZIP
  const downloadProject = () => {
    toast({
      title: "Download started",
      description: `${projectName}.zip is being prepared for download.`
    });
    
    // In a real app, this would create a ZIP file with all project files
    setTimeout(() => {
      // Simulate download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Project ZIP file content'));
      element.setAttribute('download', `${projectName}.zip`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          // Create file path based on uploaded file name
          const filePath = file.name;
          
          // Check if file already exists
          if (projectFiles.some(f => f.path === filePath)) {
            const confirmed = window.confirm(`${filePath} already exists. Do you want to override it?`);
            if (!confirmed) return;
            
            // Update existing file
            const updatedFiles = projectFiles.map(f => 
              f.path === filePath ? { ...f, content: event.target.result as string } : f
            );
            setProjectFiles(updatedFiles);
          } else {
            // Add new file
            const newFile = {
              path: filePath,
              content: event.target.result as string
            };
            setProjectFiles([...projectFiles, newFile]);
          }
          
          setSelectedFile(filePath);
          setFileContent(event.target.result as string);
          
          toast({
            title: "File uploaded",
            description: `${filePath} has been added to the project.`
          });
        }
      };
      
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    // If we change the selected file, update the content
    if (selectedFile) {
      const file = projectFiles.find(f => f.path === selectedFile);
      if (file) {
        setFileContent(file.content);
      }
    }
  }, [selectedFile]);

  return (
    <Layout>
      <div className="container max-w-7xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">QwiX Pro Builder</h1>
            <p className="text-muted-foreground">Generate and customize code projects using AI</p>
          </div>
          {generatedProject && (
            <div className="flex gap-2 self-end md:self-auto">
              <Button variant="outline" onClick={downloadProject}>
                <Download className="mr-2 h-4 w-4" />
                Download Project
              </Button>
              {previewUrl && (
                <Button>
                  <Eye className="mr-2 h-4 w-4" />
                  Live Preview
                </Button>
              )}
            </div>
          )}
        </div>

        {!generatedProject ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Configuration */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Configure your project settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">AI API Key</Label>
                    <Input 
                      id="api-key"
                      type="password" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)} 
                      placeholder="Enter your AI API Key"
                      className="mt-1.5"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        Required for project generation
                      </p>
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-xs"
                        onClick={validateApiKey}
                      >
                        Validate Key
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input 
                      id="project-name"
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                      placeholder="e.g., My Awesome App"
                      className="mt-1.5"
                      disabled={!isApiKeyValid}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="project-description">Description (Optional)</Label>
                    <Textarea 
                      id="project-description"
                      value={projectDescription} 
                      onChange={(e) => setProjectDescription(e.target.value)} 
                      placeholder="Describe your project in a few sentences"
                      rows={3}
                      className="mt-1.5 resize-none"
                      disabled={!isApiKeyValid}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="project-template" className="block mb-1.5">Project Template</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {ProjectTemplates.map(template => (
                        <Card 
                          key={template.id}
                          className={`cursor-pointer transition-all hover:border-primary ${selectedTemplate === template.id ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <CardContent className="p-3">
                            <div className="text-2xl mb-1">{template.icon}</div>
                            <h3 className="font-medium text-sm">{template.name}</h3>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Additional Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-tests" className="cursor-pointer">Include tests</Label>
                        <Switch 
                          id="include-tests" 
                          checked={projectSettings.includeTests}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeTests: checked})}
                          disabled={!isApiKeyValid}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-docs" className="cursor-pointer">Include documentation</Label>
                        <Switch 
                          id="include-docs" 
                          checked={projectSettings.includeDocumentation}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeDocumentation: checked})}
                          disabled={!isApiKeyValid}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="deployment-ready" className="cursor-pointer">Deployment ready</Label>
                        <Switch 
                          id="deployment-ready" 
                          checked={projectSettings.deploymentReady}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, deploymentReady: checked})}

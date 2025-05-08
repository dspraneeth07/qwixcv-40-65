
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
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
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

  // Validate API key format (basic check)
  const validateApiKey = () => {
    // Simple validation - in a real app you would validate with the actual API
    if (apiKey.length > 20) {
      setIsApiKeyValid(true);
      toast({
        title: "API Key validated",
        description: "You can now proceed with project generation.",
      });
    } else {
      setIsApiKeyValid(false);
      toast({
        title: "Invalid API key",
        description: "Please enter a valid API key to continue.",
        variant: "destructive"
      });
    }
  };

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
      // In a production app, we would call an AI API here
      await simulateProjectGeneration();
      
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
  
  // Simulate project generation with a delay
  const simulateProjectGeneration = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Generate mock project data
        const template = ProjectTemplates.find(t => t.id === selectedTemplate);
        
        const mockProject = {
          name: projectName,
          description: projectDescription,
          template: template?.name || "Custom Project",
          createdAt: new Date().toISOString(),
          dependencies: template?.dependencies || [],
          files: generateMockProjectFiles(selectedTemplate || '', projectName)
        };
        
        setGeneratedProject(mockProject);
        setProjectFiles(mockProject.files);
        setSelectedFile(mockProject.files[0].path);
        setFileContent(mockProject.files[0].content);
        
        // Set mock preview URL
        setPreviewUrl(`https://preview.qwixpro.dev/${projectName.toLowerCase().replace(/\s+/g, '-')}`);
        
        resolve();
      }, 2500);
    });
  };
  
  // Generate mock project files based on template
  const generateMockProjectFiles = (templateId: string, name: string) => {
    const sanitizedName = name.toLowerCase().replace(/\s+/g, '-');
    
    // Basic files every project will have
    const commonFiles = [
      {
        path: 'README.md',
        content: `# ${name}\n\n${projectDescription || 'A project generated with QwiXProBuilder.'}\n\n## Getting Started\n\nInstall dependencies:\n\n\`\`\`\nnpm install\n\`\`\`\n\nStart the development server:\n\n\`\`\`\nnpm run dev\n\`\`\`\n`
      },
      {
        path: 'package.json',
        content: `{\n  "name": "${sanitizedName}",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`
      }
    ];
    
    // Template-specific files
    let templateFiles = [] as {path: string, content: string}[];
    
    switch (templateId) {
      case 'react-tailwind':
        templateFiles = [
          {
            path: 'src/App.jsx',
            content: `import React from 'react';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gray-100 flex items-center justify-center">\n      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">\n        <h1 className="text-3xl font-bold text-center mb-6">${name}</h1>\n        <p className="text-gray-600 text-center">\n          ${projectDescription || 'Edit src/App.jsx and save to reload.'}\n        </p>\n        <div className="mt-8 flex justify-center">\n          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">\n            Get Started\n          </button>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default App;\n`
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
        break;
        
      case 'nextjs-dashboard':
        templateFiles = [
          {
            path: 'pages/index.js',
            content: `import Head from 'next/head';\nimport Dashboard from '../components/Dashboard';\n\nexport default function Home() {\n  return (\n    <div>\n      <Head>\n        <title>${name} - Dashboard</title>\n        <meta name="description" content="${projectDescription || 'Generated by QwiXProBuilder'}" />\n        <link rel="icon" href="/favicon.ico" />\n      </Head>\n\n      <main>\n        <Dashboard />\n      </main>\n    </div>\n  );\n}\n`
          },
          {
            path: 'components/Dashboard.jsx',
            content: `import React from 'react';\n\nexport default function Dashboard() {\n  return (\n    <div className="min-h-screen bg-gray-50">\n      <nav className="bg-white shadow-sm">\n        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n          <div className="flex justify-between h-16">\n            <div className="flex">\n              <div className="flex-shrink-0 flex items-center">\n                <h1 className="text-xl font-bold">${name}</h1>\n              </div>\n            </div>\n          </div>\n        </div>\n      </nav>\n\n      <div className="py-10">\n        <header>\n          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n            <h2 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h2>\n          </div>\n        </header>\n        <main>\n          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">\n            <div className="px-4 py-8 sm:px-0">\n              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">\n                <p className="text-lg text-gray-500">Your dashboard content goes here</p>\n              </div>\n            </div>\n          </div>\n        </main>\n      </div>\n    </div>\n  );\n}\n`
          }
        ];
        break;
        
      case 'mern-stack':
        templateFiles = [
          {
            path: 'server/server.js',
            content: `const express = require('express');\nconst mongoose = require('mongoose');\nconst cors = require('cors');\nrequire('dotenv').config();\n\nconst app = express();\nconst PORT = process.env.PORT || 5000;\n\n// Middleware\napp.use(cors());\napp.use(express.json());\n\n// Connect to MongoDB\nmongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${sanitizedName}', {\n  useNewUrlParser: true,\n  useUnifiedTopology: true\n})\n  .then(() => console.log('Connected to MongoDB'))\n  .catch(err => console.error('Could not connect to MongoDB', err));\n\n// Routes\napp.get('/', (req, res) => {\n  res.send('API is running...');\n});\n\n// Start server\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));\n`
          },
          {
            path: 'client/src/App.js',
            content: `import React, { useState, useEffect } from 'react';\nimport axios from 'axios';\nimport './App.css';\n\nfunction App() {\n  const [message, setMessage] = useState('');\n\n  useEffect(() => {\n    // Fetch data from API\n    axios.get('http://localhost:5000/')\n      .then(res => setMessage(res.data))\n      .catch(err => console.error(err));\n  }, []);\n\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>${name}</h1>\n        <p>${projectDescription || 'A MERN stack application'}</p>\n        <div className="message-box">\n          <p>Message from server: {message}</p>\n        </div>\n      </header>\n    </div>\n  );\n}\n\nexport default App;\n`
          }
        ];
        break;
        
      case 'react-typescript':
        templateFiles = [
          {
            path: 'src/App.tsx',
            content: `import React, { useState } from 'react';\nimport './App.css';\n\ninterface Item {\n  id: number;\n  text: string;\n}\n\nfunction App(): JSX.Element {\n  const [items, setItems] = useState<Item[]>([]);\n  const [text, setText] = useState<string>('');\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!text.trim()) return;\n    \n    const newItem: Item = {\n      id: Date.now(),\n      text\n    };\n    \n    setItems([...items, newItem]);\n    setText('');\n  };\n\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>${name}</h1>\n        <p>${projectDescription || 'A React TypeScript application'}</p>\n      </header>\n      \n      <main className="App-main">\n        <form onSubmit={handleSubmit} className="item-form">\n          <input \n            type="text" \n            value={text} \n            onChange={(e) => setText(e.target.value)} \n            placeholder="Add an item..." \n          />\n          <button type="submit">Add</button>\n        </form>\n        \n        <ul className="item-list">\n          {items.map((item) => (\n            <li key={item.id}>{item.text}</li>\n          ))}\n        </ul>\n      </main>\n    </div>\n  );\n}\n\nexport default App;\n`
          },
          {
            path: 'tsconfig.json',
            content: `{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": [\n      "dom",\n      "dom.iterable",\n      "esnext"\n    ],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "esModuleInterop": true,\n    "allowSyntheticDefaultImports": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noFallthroughCasesInSwitch": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx"\n  },\n  "include": [\n    "src"\n  ]\n}\n`
          }
        ];
        break;
    }
    
    return [...commonFiles, ...templateFiles];
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
          setFileContent(event.target.result);
          
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
                          disabled={!isApiKeyValid}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateProject} 
                    disabled={isGenerating || !isApiKeyValid || !projectName || !selectedTemplate}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating Project...
                      </>
                    ) : (
                      <>
                        <Code className="mr-2 h-4 w-4" />
                        Generate Project
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Preview Placeholder */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Project Preview</CardTitle>
                  <CardDescription>
                    Your generated project will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="h-[500px] flex items-center justify-center border border-dashed rounded-md">
                    <div className="text-center max-w-md p-6">
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Code className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No project generated yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Fill in the project details and click "Generate Project" to create your application with AI.
                      </p>
                      
                      <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3 text-left">
                        <div className="font-mono mb-1.5">// QwiXProBuilder features:</div>
                        <div>• Generate complete project codebases with AI</div>
                        <div>• Choose from multiple project templates</div>
                        <div>• Edit and customize your code</div>
                        <div>• Preview your application in real-time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="code" className="flex items-center gap-1.5">
                  <Code className="h-4 w-4" />
                  Code Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1.5">
                  <Settings className="h-4 w-4" />
                  Project Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* File Explorer */}
                  <div className="col-span-1 border rounded-lg overflow-hidden">
                    <div className="p-3 bg-muted flex justify-between items-center">
                      <h3 className="text-sm font-medium">Files</h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addNewFile}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                    <div className="p-2 max-h-[70vh] overflow-y-auto">
                      <Input
                        placeholder="Search files..."
                        className="mb-2"
                        prefix={<Search className="h-4 w-4 ml-2 text-muted-foreground" />}
                      />
                      <div className="space-y-1">
                        {projectFiles.map((file, index) => (
                          <div
                            key={index}
                            className={`flex items-center px-2 py-1.5 rounded text-sm cursor-pointer ${selectedFile === file.path ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                            onClick={() => handleFileSelect(file.path)}
                          >
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{file.path}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Code Editor */}
                  <div className="col-span-1 md:col-span-3 border rounded-lg overflow-hidden">
                    <div className="p-3 bg-muted flex justify-between items-center">
                      <h3 className="text-sm font-medium truncate">
                        {selectedFile || 'No file selected'}
                      </h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={updateFileContent}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(fileContent)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={deleteSelectedFile}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-[70vh] overflow-auto">
                      <Textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="font-mono text-sm min-h-[600px] p-4 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="// Code content will appear here"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Live Preview</span>
                      {previewUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-1.5" />
                            Open in new tab
                          </a>
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>
                      See your project in action
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden h-[600px] bg-white">
                      {previewUrl ? (
                        <div className="h-full flex flex-col">
                          <div className="p-2 bg-gray-100 border-b flex items-center">
                            <div className="flex gap-1.5 mr-4">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1 text-center text-sm text-muted-foreground">{previewUrl}</div>
                            <div className="w-10"></div> {/* Spacer for alignment */}
                          </div>
                          <div className="flex-1 bg-white flex items-center justify-center">
                            <div className="text-center p-8">
                              <h1 className="text-3xl font-bold mb-4">{projectName}</h1>
                              <p className="mb-8">{projectDescription || "A project generated with QwiXProBuilder"}</p>
                              <div className="inline-block border px-6 py-3 rounded-md font-medium">
                                Get Started
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">Preview not available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>
                      Configure project settings and deployment options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-4">Project Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project-name-edit">Project Name</Label>
                          <Input 
                            id="project-name-edit"
                            value={projectName} 
                            onChange={(e) => setProjectName(e.target.value)} 
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="project-template-edit">Template</Label>
                          <Select 
                            value={selectedTemplate || ''} 
                            onValueChange={setSelectedTemplate}
                          >
                            <SelectTrigger id="project-template-edit" className="mt-1.5">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              {ProjectTemplates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="project-description-edit">Description</Label>
                        <Textarea 
                          id="project-description-edit"
                          value={projectDescription} 
                          onChange={(e) => setProjectDescription(e.target.value)} 
                          rows={3}
                          className="mt-1.5 resize-none"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-base font-medium mb-4">Build Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-tests-edit" className="cursor-pointer">Include tests</Label>
                          <Switch 
                            id="include-tests-edit" 
                            checked={projectSettings.includeTests}
                            onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeTests: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-docs-edit" className="cursor-pointer">Generate documentation</Label>
                          <Switch 
                            id="include-docs-edit" 
                            checked={projectSettings.includeDocumentation}
                            onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeDocumentation: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="create-git-repo-edit" className="cursor-pointer">Initialize Git repository</Label>
                            <p className="text-xs text-muted-foreground">Create initial commit and .gitignore file</p>
                          </div>
                          <Switch 
                            id="create-git-repo-edit" 
                            checked={projectSettings.createGitRepo}
                            onCheckedChange={(checked) => setProjectSettings({...projectSettings, createGitRepo: checked})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-base font-medium mb-4">Deployment Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="deployment-ready-edit" className="cursor-pointer">Production-ready build</Label>
                            <p className="text-xs text-muted-foreground">Configure for production deployment</p>
                          </div>
                          <Switch 
                            id="deployment-ready-edit" 
                            checked={projectSettings.deploymentReady}
                            onCheckedChange={(checked) => setProjectSettings({...projectSettings, deploymentReady: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="private-packages-edit" className="cursor-pointer">Use private packages</Label>
                            <p className="text-xs text-muted-foreground">Use private npm registry if available</p>
                          </div>
                          <Switch 
                            id="private-packages-edit" 
                            checked={projectSettings.privatePackages}
                            onCheckedChange={(checked) => setProjectSettings({...projectSettings, privatePackages: checked})}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Restore Defaults</Button>
                    <Button>Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QwiXProBuilder;

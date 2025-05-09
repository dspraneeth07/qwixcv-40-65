
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Plus,
  Rocket,
  ArrowRight
} from 'lucide-react';

// Mock data generator functions
const generateMockFileContent = (fileName: string, projectType: string) => {
  // Generate different file content based on file extension
  const fileExt = fileName.split('.').pop()?.toLowerCase();
  
  switch (fileExt) {
    case 'html':
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div id="app">\n    <h1>Welcome to your generated project!</h1>\n    <p>This is a ${projectType} application scaffold.</p>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>`;
    
    case 'css':
      return `/* Generated styles for ${projectType} project */\n\n:root {\n  --primary: #8B5CF6;\n  --secondary: #EC4899;\n  --background: #ffffff;\n  --text: #1F2937;\n}\n\nbody {\n  font-family: 'Inter', sans-serif;\n  background-color: var(--background);\n  color: var(--text);\n  line-height: 1.6;\n  margin: 0;\n  padding: 0;\n}\n\n#app {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n\nh1 {\n  color: var(--primary);\n  font-size: 2.5rem;\n  margin-bottom: 1rem;\n}\n\n.btn {\n  background-color: var(--primary);\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 0.375rem;\n  cursor: pointer;\n  transition: background-color 0.3s;\n}\n\n.btn:hover {\n  background-color: var(--secondary);\n}`;
    
    case 'js':
      return `// Generated script for ${projectType} project\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  console.log('Application initialized!');\n  \n  // Example functionality\n  const initApp = () => {\n    const appElement = document.getElementById('app');\n    \n    // Create a button element\n    const button = document.createElement('button');\n    button.textContent = 'Click me';\n    button.classList.add('btn');\n    button.addEventListener('click', () => {\n      alert('Button clicked!');\n    });\n    \n    appElement.appendChild(button);\n  };\n  \n  initApp();\n});\n`;
    
    case 'jsx':
    case 'tsx':
      return `import React, { useState } from 'react';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="app">\n      <header className="app-header">\n        <h1>${projectType} Project</h1>\n        <p>Edit this file and save to reload.</p>\n      </header>\n      <main>\n        <div className="counter">\n          <p>Count: {count}</p>\n          <button onClick={() => setCount(count + 1)}>Increment</button>\n        </div>\n      </main>\n    </div>\n  );\n}\n\nexport default App;\n`;
    
    case 'json':
      if (fileName.includes('package')) {
        return `{\n  "name": "generated-project",\n  "version": "0.1.0",\n  "description": "A generated ${projectType} project",\n  "main": "index.js",\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "react-scripts": "5.0.1"\n  }\n}`;
      }
      return `{\n  "name": "generated-config",\n  "version": "1.0.0"\n}`;
    
    case 'md':
      return `# Generated ${projectType} Project\n\n## Overview\nThis project was generated using QwiXProBuilder, an AI-powered project generator.\n\n## Getting Started\n\n### Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n### Usage\n\n\`\`\`bash\nnpm start\n\`\`\`\n\n## Project Structure\n\n- \`src/\`: Source files\n- \`public/\`: Static assets\n- \`build/\`: Compiled files (after building)\n\n## Deployment\n\nYou can deploy this project using services like Vercel, Netlify, or GitHub Pages.\n\n## License\nMIT\n`;
    
    default:
      return `// Generated file: ${fileName}\n// This file is part of the ${projectType} project\n`;
  }
};

// Generate a full project structure based on project type
const generateProjectStructure = (projectType: string, projectName: string) => {
  let files = [];
  
  // Base README file for all projects
  files.push({
    path: 'README.md',
    content: generateMockFileContent('README.md', projectType)
  });
  
  switch (projectType) {
    case 'static':
      files = [
        ...files,
        { path: 'index.html', content: generateMockFileContent('index.html', projectType) },
        { path: 'style.css', content: generateMockFileContent('style.css', projectType) },
        { path: 'script.js', content: generateMockFileContent('script.js', projectType) }
      ];
      break;
      
    case 'react':
      files = [
        ...files,
        { path: 'package.json', content: generateMockFileContent('package.json', 'React') },
        { path: 'public/index.html', content: generateMockFileContent('index.html', 'React') },
        { path: 'src/index.js', content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n` },
        { path: 'src/App.jsx', content: generateMockFileContent('App.jsx', 'React') },
        { path: 'src/index.css', content: generateMockFileContent('index.css', 'React') }
      ];
      break;
      
    case 'react-tailwind':
      files = [
        ...files,
        { path: 'package.json', content: generateMockFileContent('package.json', 'React + Tailwind') },
        { path: 'tailwind.config.js', content: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ['./src/**/*.{js,jsx,ts,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}` },
        { path: 'public/index.html', content: generateMockFileContent('index.html', 'React + Tailwind') },
        { path: 'src/index.js', content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n` },
        { path: 'src/App.jsx', content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gray-100">\n      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">\n        <div className="bg-white shadow-lg rounded-lg p-8">\n          <h1 className="text-3xl font-bold text-gray-900 mb-6">React + Tailwind Project</h1>\n          <p className="text-gray-600 mb-4">This project was generated with QwiXProBuilder</p>\n          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">\n            Click me\n          </button>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default App;` },
        { path: 'src/index.css', content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` }
      ];
      break;
      
    case 'next':
      files = [
        ...files,
        { path: 'package.json', content: `{\n  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start",\n    "lint": "next lint"\n  },\n  "dependencies": {\n    "next": "^13.4.19",\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "@types/node": "^18.15.11",\n    "@types/react": "^18.0.37",\n    "@types/react-dom": "^18.0.11",\n    "typescript": "^5.0.4"\n  }\n}` },
        { path: 'pages/index.tsx', content: `import Head from 'next/head';\n\nexport default function Home() {\n  return (\n    <div className="container">\n      <Head>\n        <title>${projectName}</title>\n        <meta name="description" content="Generated by QwiXProBuilder" />\n        <link rel="icon" href="/favicon.ico" />\n      </Head>\n\n      <main>\n        <h1>Welcome to ${projectName}!</h1>\n        <p>\n          Get started by editing{' '}\n          <code>pages/index.tsx</code>\n        </p>\n      </main>\n\n      <style jsx>{\`\n        .container {\n          min-height: 100vh;\n          padding: 0 0.5rem;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          align-items: center;\n        }\n\n        main {\n          padding: 5rem 0;\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          align-items: center;\n        }\n\n        h1 {\n          margin: 0;\n          line-height: 1.15;\n          font-size: 4rem;\n          text-align: center;\n        }\n\n        p {\n          text-align: center;\n          line-height: 1.5;\n          font-size: 1.5rem;\n        }\n\n        code {\n          background: #fafafa;\n          border-radius: 5px;\n          padding: 0.75rem;\n          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,\n            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;\n        }\n      \`}</style>\n    </div>\n  );\n}\n` },
        { path: 'pages/_app.tsx', content: `import '../styles/globals.css';\nimport type { AppProps } from 'next/app';\n\nexport default function App({ Component, pageProps }: AppProps) {\n  return <Component {...pageProps} />\n}` },
        { path: 'styles/globals.css', content: `html,\nbody {\n  padding: 0;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\n    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;\n}\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n* {\n  box-sizing: border-box;\n}\n` },
        { path: 'tsconfig.json', content: `{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noEmit": true,\n    "esModuleInterop": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "jsx": "preserve",\n    "incremental": true\n  },\n  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],\n  "exclude": ["node_modules"]\n}\n` }
      ];
      break;
      
    case 'mern':
      files = [
        ...files,
        { path: 'package.json', content: `{\n  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",\n  "version": "0.1.0",\n  "description": "MERN stack project",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js",\n    "server": "nodemon server.js",\n    "client": "npm start --prefix client",\n    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",\n    "build": "cd client && npm run build"\n  },\n  "dependencies": {\n    "express": "^4.18.2",\n    "mongoose": "^7.0.3",\n    "cors": "^2.8.5",\n    "dotenv": "^16.0.3"\n  },\n  "devDependencies": {\n    "nodemon": "^2.0.22",\n    "concurrently": "^8.0.1"\n  }\n}` },
        { path: 'server.js', content: `const express = require('express');\nconst cors = require('cors');\nconst path = require('path');\n\n// Initialize express\nconst app = express();\n\n// Middleware\napp.use(cors());\napp.use(express.json());\n\n// API Routes\napp.get('/api', (req, res) => {\n  res.json({ message: 'API is working!' });\n});\n\n// Serve static assets in production\nif (process.env.NODE_ENV === 'production') {\n  app.use(express.static('client/build'));\n  \n  app.get('*', (req, res) => {\n    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));\n  });\n}\n\nconst PORT = process.env.PORT || 5000;\n\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));\n` },
        { path: 'client/package.json', content: `{\n  "name": "client",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-scripts": "5.0.1",\n    "axios": "^1.3.5"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  },\n  "eslintConfig": {\n    "extends": "react-app"\n  },\n  "browserslist": {\n    "production": [\n      ">0.2%",\n      "not dead",\n      "not op_mini all"\n    ],\n    "development": [\n      "last 1 chrome version",\n      "last 1 firefox version",\n      "last 1 safari version"\n    ]\n  },\n  "proxy": "http://localhost:5000"\n}` },
        { path: 'client/public/index.html', content: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <meta name="theme-color" content="#000000" />\n    <meta name="description" content="MERN app created by QwiXProBuilder" />\n    <title>${projectName}</title>\n  </head>\n  <body>\n    <noscript>You need to enable JavaScript to run this app.</noscript>\n    <div id="root"></div>\n  </body>\n</html>` },
        { path: 'client/src/index.js', content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n` },
        { path: 'client/src/App.jsx', content: `import React, { useState, useEffect } from 'react';\nimport './App.css';\n\nfunction App() {\n  const [apiMessage, setApiMessage] = useState('');\n\n  useEffect(() => {\n    // Fetch data from the API\n    fetch('/api')\n      .then(response => response.json())\n      .then(data => setApiMessage(data.message))\n      .catch(err => console.error('Error fetching API:', err));\n  }, []);\n\n  return (\n    <div className="app">\n      <header className="app-header">\n        <h1>${projectName}</h1>\n      </header>\n      <main>\n        <div className="card">\n          <h2>MERN Stack App</h2>\n          <p>API Response: {apiMessage || 'Loading...'}</p>\n        </div>\n      </main>\n    </div>\n  );\n}\n\nexport default App;\n` },
        { path: 'client/src/App.css', content: `.app {\n  text-align: center;\n  font-family: Arial, sans-serif;\n}\n\n.app-header {\n  background-color: #282c34;\n  min-height: 20vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: calc(10px + 2vmin);\n  color: white;\n}\n\nmain {\n  padding: 2rem;\n}\n\n.card {\n  background-color: #f5f5f5;\n  border-radius: 8px;\n  padding: 2rem;\n  max-width: 600px;\n  margin: 2rem auto;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n}\n` },
        { path: 'client/src/index.css', content: `body {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\ncode {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',\n    monospace;\n}\n` }
      ];
      break;
      
    default:
      files = [
        ...files,
        { path: 'index.html', content: generateMockFileContent('index.html', 'Custom') },
        { path: 'style.css', content: generateMockFileContent('style.css', 'Custom') },
        { path: 'script.js', content: generateMockFileContent('script.js', 'Custom') }
      ];
  }
  
  return files;
};

// Framework options
const frameworkOptions = [
  {
    id: 'static',
    name: 'Static HTML/CSS/JS',
    description: 'Simple static website with HTML, CSS, and JavaScript',
    icon: '📄',
    complexity: 'Beginner'
  },
  {
    id: 'react',
    name: 'React',
    description: 'Modern React application',
    icon: '⚛️',
    complexity: 'Intermediate'
  },
  {
    id: 'react-tailwind',
    name: 'React + Tailwind',
    description: 'React with Tailwind CSS for styling',
    icon: '🎨',
    complexity: 'Intermediate'
  },
  {
    id: 'next',
    name: 'Next.js',
    description: 'React framework with SSR and routing',
    icon: '📱',
    complexity: 'Advanced'
  },
  {
    id: 'mern',
    name: 'MERN Stack',
    description: 'MongoDB, Express, React, Node.js full-stack app',
    icon: '🔄',
    complexity: 'Advanced'
  }
];

// Example project prompts for inspiration
const examplePrompts = [
  "Build a weather dashboard with charts and a responsive UI using React",
  "Create a personal portfolio website with HTML, CSS, and JS",
  "Build a blog application with Next.js and Markdown support",
  "Create a recipe app with React and Tailwind CSS",
  "Build a task management app with user authentication",
  "Create an e-commerce product page with shopping cart functionality"
];

const QwiXProBuilder = () => {
  const { toast } = useToast();
  const [projectPrompt, setProjectPrompt] = useState('');
  const [projectName, setProjectName] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('code');
  const [previewUrl, setPreviewUrl] = useState('');
  const [projectFiles, setProjectFiles] = useState<{path: string, content: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [projectSettings, setProjectSettings] = useState({
    includeDocumentation: true,
    includeTests: false,
    optimizeForPerformance: true,
    includeDependencies: true,
    includeDarkMode: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically suggest a project name based on the prompt
  useEffect(() => {
    if (projectPrompt) {
      const words = projectPrompt.split(' ');
      const relevantWords = words.filter(word => 
        word.length > 3 && 
        !['build', 'create', 'with', 'using', 'that', 'has', 'the', 'and', 'for'].includes(word.toLowerCase())
      );
      
      if (relevantWords.length > 0) {
        let suggestedName = '';
        if (relevantWords.length >= 2) {
          suggestedName = `${relevantWords[0]}-${relevantWords[1]}`;
        } else {
          suggestedName = `${relevantWords[0]}-app`;
        }
        
        // Clean and capitalize
        suggestedName = suggestedName.replace(/[^\w\s-]/g, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        setProjectName(suggestedName);
      }
    }
  }, [projectPrompt]);

  // Generate project based on prompt
  const handleGenerateProject = async () => {
    if (!projectPrompt) {
      toast({
        title: "Project prompt required",
        description: "Please provide a description of the project you want to build.",
        variant: "warning"
      });
      return;
    }
    
    if (!projectName) {
      toast({
        title: "Project name required",
        description: "Please provide a name for your project.",
        variant: "warning"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get framework details
      const framework = frameworkOptions.find(f => f.id === selectedFramework);
      
      // Set short timeout to simulate generation process
      setTimeout(() => {
        // Generate files based on framework and project name
        const generatedFiles = generateProjectStructure(selectedFramework, projectName);
        
        const mockProject = {
          name: projectName,
          description: projectPrompt,
          framework: framework?.name || "Custom Project",
          createdAt: new Date().toISOString(),
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
        setIsGenerating(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error generating project:", error);
      toast({
        title: "Generation failed",
        description: "There was a problem generating your project. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
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

  // Fill the prompt with an example
  const fillExamplePrompt = (prompt: string) => {
    setProjectPrompt(prompt);
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
            <h1 className="text-3xl font-bold">AI Project Builder</h1>
            <p className="text-muted-foreground">Generate complete projects from natural language prompts</p>
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
                    Describe what you want to build
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="project-prompt">Project Prompt</Label>
                    <Textarea 
                      id="project-prompt"
                      value={projectPrompt} 
                      onChange={(e) => setProjectPrompt(e.target.value)} 
                      placeholder="E.g., Build a weather dashboard with charts and a responsive UI using React"
                      rows={4}
                      className="mt-1.5 resize-none"
                    />
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Need inspiration? Try one of these:</p>
                      <div className="flex flex-wrap gap-1">
                        {examplePrompts.map((prompt, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => fillExamplePrompt(prompt)}
                          >
                            {prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input 
                      id="project-name"
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                      placeholder="My Awesome Project"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="framework" className="block mb-1.5">Framework/Technology</Label>
                    <Select
                      value={selectedFramework}
                      onValueChange={setSelectedFramework}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworkOptions.map(framework => (
                          <SelectItem key={framework.id} value={framework.id}>
                            <div className="flex items-center">
                              <span className="mr-2">{framework.icon}</span>
                              <span>{framework.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {framework.complexity}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Project Configuration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-docs" className="cursor-pointer">Include documentation</Label>
                        <Switch 
                          id="include-docs" 
                          checked={projectSettings.includeDocumentation}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeDocumentation: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-tests" className="cursor-pointer">Include test files</Label>
                        <Switch 
                          id="include-tests" 
                          checked={projectSettings.includeTests}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeTests: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="optimize-performance" className="cursor-pointer">Optimize for performance</Label>
                        <Switch 
                          id="optimize-performance" 
                          checked={projectSettings.optimizeForPerformance}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, optimizeForPerformance: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-deps" className="cursor-pointer">Include dependencies</Label>
                        <Switch 
                          id="include-deps" 
                          checked={projectSettings.includeDependencies}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeDependencies: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode" className="cursor-pointer">Include dark mode</Label>
                        <Switch 
                          id="dark-mode" 
                          checked={projectSettings.includeDarkMode}
                          onCheckedChange={(checked) => setProjectSettings({...projectSettings, includeDarkMode: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateProject} 
                    disabled={!projectPrompt || !projectName || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Generate Project
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Examples and How it works */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Our AI Project Builder generates complete, ready-to-use projects from your description
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                      <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
                        <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-medium mb-1">1. Describe Your Project</h3>
                      <p className="text-sm text-muted-foreground">Enter a detailed description of what you want to build</p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                      <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
                        <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-medium mb-1">2. Generate Code</h3>
                      <p className="text-sm text-muted-foreground">Our AI builds complete project with all needed files</p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                      <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
                        <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-medium mb-1">3. Download & Use</h3>
                      <p className="text-sm text-muted-foreground">Preview and download your project to use anywhere</p>
                    </div>
                  </div>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <AlertDescription>
                      <span className="font-medium">No API keys required!</span> Our builder generates all code locally without external APIs.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Example Projects</CardTitle>
                  <CardDescription>
                    Check out these sample projects you can create
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" className="w-full h-32 object-cover rounded-t-lg" alt="Project thumbnail" />
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Weather Dashboard</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Interactive weather app with forecasts, charts, and location search
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="outline">React</Badge>
                          <Badge variant="outline">API Integration</Badge>
                          <Badge variant="outline">Charts</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => fillExamplePrompt("Build a weather dashboard with charts and a responsive UI using React")}
                        >
                          Use This Template
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" className="w-full h-32 object-cover rounded-t-lg" alt="Project thumbnail" />
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Personal Portfolio</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Showcase your work with a sleek and responsive portfolio website
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="outline">HTML/CSS</Badge>
                          <Badge variant="outline">Responsive</Badge>
                          <Badge variant="outline">Portfolio</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => fillExamplePrompt("Create a personal portfolio website with HTML, CSS, and JS")}
                        >
                          Use This Template
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div>
            <Tabs 
              defaultValue="code" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="mt-0">
                <div className="grid grid-cols-12 gap-4">
                  {/* File Explorer */}
                  <div className="col-span-12 md:col-span-3">
                    <Card>
                      <CardHeader className="py-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Files</CardTitle>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={addNewFile}>
                              <Plus className="h-4 w-4" />
                              <span className="sr-only">Add file</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => fileInputRef.current?.click()}>
                              <Upload className="h-4 w-4" />
                              <span className="sr-only">Upload file</span>
                            </Button>
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="max-h-[500px] overflow-y-auto">
                          <ul className="divide-y">
                            {projectFiles.map((file, index) => (
                              <li 
                                key={index} 
                                className={`px-4 py-2 cursor-pointer hover:bg-muted text-sm flex items-center justify-between ${selectedFile === file.path ? 'bg-muted' : ''}`}
                                onClick={() => handleFileSelect(file.path)}
                              >
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="truncate max-w-[180px]">{file.path}</span>
                                </div>
                                {selectedFile === file.path && (
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={deleteSelectedFile}>
                                    <Trash className="h-3 w-3" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Code Editor */}
                  <div className="col-span-12 md:col-span-9">
                    <Card>
                      <CardHeader className="py-4 border-b">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg truncate">
                            {selectedFile || "No file selected"}
                          </CardTitle>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={updateFileContent}>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="min-h-[500px] relative">
                          <Textarea 
                            value={fileContent}
                            onChange={(e) => setFileContent(e.target.value)}
                            className="min-h-[500px] font-mono text-sm p-4 resize-none rounded-none border-0 focus-visible:ring-0"
                            placeholder="// Select or create a file to begin coding"
                            disabled={!selectedFile}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Project Preview</CardTitle>
                      {previewUrl && (
                        <Button variant="outline" className="text-xs" asChild>
                          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open in new window
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t h-[600px] w-full">
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-2">Live preview will appear here after build</p>
                          <Button variant="outline">Refresh Preview</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>
                      Configure build and deployment options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">General</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="project-name-settings">Project Name</Label>
                            <Input 
                              id="project-name-settings"
                              value={projectName} 
                              onChange={(e) => setProjectName(e.target.value)}
                              className="mt-1" 
                            />
                          </div>
                          <div>
                            <Label htmlFor="project-version">Version</Label>
                            <Input 
                              id="project-version"
                              defaultValue="0.1.0"
                              className="mt-1" 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="project-description-settings">Description</Label>
                          <Textarea 
                            id="project-description-settings"
                            value={projectPrompt} 
                            onChange={(e) => setProjectPrompt(e.target.value)}
                            className="mt-1" 
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Build Configuration</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="build-command">Build Command</Label>
                          <Input 
                            id="build-command"
                            defaultValue="npm run build" 
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="output-directory">Output Directory</Label>
                          <Input 
                            id="output-directory"
                            defaultValue="dist" 
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="minify" className="cursor-pointer">Minify output</Label>
                          <Switch id="minify" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="KEY" />
                          <Input placeholder="Value" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="KEY" />
                          <Input placeholder="Value" />
                        </div>
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Environment Variable
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Hosting Options</h3>
                      <div className="space-y-4 mt-4">
                        <Card className="border-dashed">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600">
                                  <path d="M4 20L20 20C20.5523 20 21 19.5523 21 19L21 5C21 4.44772 20.5523 4 20 4L4 4C3.44772 4 3 4.44772 3 5L3 19C3 19.5523 3.44772 20 4 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M7 8.5L7 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M10.5 11L10.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M14 5.5L14 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M17.5 8.5L17.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium">Vercel</h4>
                                <p className="text-sm text-muted-foreground">Deploy with zero configuration</p>
                              </div>
                              <Button size="sm" className="ml-auto">Deploy</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-dashed">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                                  <path d="M20.9576 7.3068L12 11.1568L3.04241 7.3068C3.20962 6.9958 3.46107 6.7356 3.7701 6.5564C4.07913 6.3772 4.43519 6.2865 4.79784 6.2946H19.2022C19.5648 6.2865 19.9209 6.3772 20.2299 6.5564C20.5389 6.7356 20.7904 6.9958 20.9576 7.3068Z" fill="currentColor"/>
                                  <path d="M3 8.6001V16.7662C3.00007 17.1958 3.14761 17.612 3.41562 17.9431C3.68364 18.2742 4.05442 18.5019 4.47642 18.5867C4.7013 18.6339 4.93166 18.6471 5.16128 18.6256C5.40114 18.6428 5.64134 18.618 5.87098 18.5516C6.10062 18.4853 6.31584 18.3782 6.50702 18.2352C6.6982 18.0922 6.86237 17.9156 6.99216 17.7135C7.12195 17.5113 7.2152 17.2867 7.26697 17.051C7.31875 16.8154 7.32815 16.5723 7.29474 16.3331C7.26133 16.0938 7.18562 15.8626 7.07134 15.6505L3 8.6001Z" fill="currentColor"/>
                                  <path d="M20.9727 16.7661V8.6001L16.9014 15.6504C16.7871 15.8625 16.7114 16.0937 16.678 16.333C16.6446 16.5722 16.654 16.8152 16.7058 17.0509C16.7575 17.2866 16.8508 17.5112 16.9806 17.7134C17.1104 17.9156 17.2745 18.0922 17.4657 18.2352C17.6569 18.3781 17.8721 18.4853 18.1018 18.5516C18.3314 18.618 18.5716 18.6428 18.8114 18.6256C19.041 18.6471 19.2714 18.6339 19.4963 18.5867C19.9183 18.5019 20.2891 18.2742 20.5571 17.9431C20.8251 17.612 20.9727 17.1958 20.9727 16.7661Z" fill="currentColor"/>
                                  <path d="M14.7577 15.9443C14.5811 16.2601 14.4678 16.6076 14.4228 16.9675C14.3778 17.3275 14.4021 17.6929 14.4942 18.0427C14.5828 18.3825 14.735 18.702 14.9423 18.9834C15.1496 19.2648 15.4079 19.5023 15.7021 19.6818C15.9964 19.8613 16.3209 19.9789 16.6584 20.0271C16.996 20.0753 17.3392 20.053 17.6675 19.9615C17.9957 19.8701 18.3021 19.7115 18.5696 19.4948C18.8371 19.2782 19.0597 19.0079 19.2248 18.6984L21.4334 14.6568C21.5514 14.4363 21.7368 14.2627 21.96 14.1658C22.1831 14.0688 22.4318 14.0539 22.6641 14.1231C22.8965 14.1924 23.1022 14.3425 23.2485 14.5483C23.3948 14.7541 23.4736 15.0034 23.4726 15.2599C23.4734 15.3908 23.4515 15.5206 23.4079 15.644H23.4231L12.6784 22.4679C12.4934 22.5841 12.283 22.6452 12.0672 22.6452C11.8513 22.6452 11.6409 22.5841 11.4559 22.4679L0.711259 15.7424H0.726473C0.68341 15.6178 0.661456 15.4869 0.661259 15.3549C0.661363 15.1002 0.739089 14.8524 0.883743 14.6472C1.02839 14.442 1.23237 14.2915 1.46326 14.2207C1.69414 14.1499 1.94196 14.1626 2.16533 14.2571C2.38869 14.3516 2.57566 14.5228 2.69626 14.7417L4.8352 18.6993C4.99854 19.0087 5.22054 19.2783 5.48798 19.4934C5.75543 19.7085 6.06234 19.8645 6.3909 19.9525C6.71946 20.0404 7.06254 20.0581 7.39875 20.0045C7.73496 19.9509 8.05697 19.8267 8.34755 19.642C8.6291 19.4584 8.86823 19.2181 9.05736 18.9348C9.24649 18.6514 9.3809 18.3308 9.45523 17.9907C9.52956 17.6507 9.54207 17.2975 9.49197 16.951C9.44186 16.6045 9.33035 16.272 9.16493 15.9726L5.03493 8.76506C4.79695 8.34006 4.69541 7.85102 4.74676 7.36595C4.79811 6.88087 5.0002 6.42515 5.32752 6.06752C5.65485 5.7099 6.09049 5.46896 6.56913 5.38071C7.04778 5.29246 7.54009 5.36155 7.97523 5.57857L12 7.53125L16.0248 5.57857C16.4599 5.36155 16.9522 5.29246 17.4309 5.38071C17.9095 5.46896 18.3452 5.7099 18.6725 6.06752C18.9998 6.42515 19.2019 6.88087 19.2532 7.36595C19.3046 7.85102 19.203 8.34006 18.9651 8.76506L14.7577 15.9443Z" fill="currentColor"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium">Netlify</h4>
                                <p className="text-sm text-muted-foreground">CI/CD with Git integration</p>
                              </div>
                              <Button size="sm" className="ml-auto">Deploy</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-dashed">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600">
                                  <path d="M18 10.5V6.5C18 5.39543 17.1046 4.5 16 4.5H5C3.89543 4.5 3 5.39543 3 6.5V15.5C3 16.6046 3.89543 17.5 5 17.5H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M18 10.5H15C13.8954 10.5 13 11.3954 13 12.5V17.5C13 18.6046 13.8954 19.5 15 19.5H19C20.1046 19.5 21 18.6046 21 17.5V12.5C21 11.3954 20.1046 10.5 19 10.5H18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M17 14.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M7 9.5H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium">GitHub Pages</h4>
                                <p className="text-sm text-muted-foreground">Simple static site hosting</p>
                              </div>
                              <Button size="sm" className="ml-auto">Deploy</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset Changes</Button>
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

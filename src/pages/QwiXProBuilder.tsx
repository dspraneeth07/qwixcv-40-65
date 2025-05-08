
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import {
  Code,
  Download,
  FileCode,
  Layers,
  Loader2,
  Paintbrush,
  Play,
  Rocket,
  Server,
  Sparkles,
  Terminal,
  Check,
  ArrowRight,
  Cpu
} from "lucide-react";

const QwiXProBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("frontend");
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [viewedFile, setViewedFile] = useState<string | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Set the viewed file when results are generated
  useEffect(() => {
    if (generatedResult) {
      if (activeTab === "frontend" && generatedResult.frontendCode) {
        setViewedFile(Object.keys(generatedResult.frontendCode)[0]);
      } else if (activeTab === "backend" && generatedResult.backendCode) {
        setViewedFile(Object.keys(generatedResult.backendCode)[0]);
      }
    }
  }, [generatedResult, activeTab]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please provide a description of what you want to build.",
        variant: "destructive",
      });
      return;
    }

    if (!projectName.trim()) {
      setProjectName(prompt.split(" ").slice(0, 3).join("-").toLowerCase());
    }

    setIsGenerating(true);

    // Simulate project generation
    setTimeout(() => {
      const mockResult = {
        name: projectName || "my-project",
        description: prompt,
        frontendCode: {
          "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName || "My Project"}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="./App.jsx"></script>
</body>
</html>`,
          "App.jsx": `function App() {
  const [count, setCount] = React.useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">React Counter App</h1>
        
        <div className="flex items-center justify-center mb-6">
          <div className="text-5xl font-bold">{count}</div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Decrement
          </button>
          <button
            onClick={increment}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
          "styles.css": `/* Additional styles can be added here */
.custom-button {
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: scale(1.05);
}`,
        },
        backendCode: {
          "server.js": `const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample API endpoint
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from the backend!',
    timestamp: new Date()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
          "package.json": `{
  "name": "${projectName || "my-project"}-backend",
  "version": "1.0.0",
  "description": "Backend for ${prompt}",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
}`
        },
      };

      setGeneratedResult(mockResult);
      setIsGenerating(false);

      toast({
        title: "Project generated!",
        description: "Your project is ready to preview and download.",
      });
    }, 3000);
  };

  const generatePreviewHTML = () => {
    if (!generatedResult) return "";

    const { frontendCode } = generatedResult;
    
    // Extract necessary files
    const indexHTML = frontendCode["index.html"] || "";
    const appJSX = frontendCode["App.jsx"] || "";
    const styles = frontendCode["styles.css"] || "";
    
    // Combine into a single HTML document for the iframe
    const combinedHTML = indexHTML.replace(
      '<script type="text/babel" src="./App.jsx"></script>',
      `<style>${styles}</style>
      <script type="text/babel">
        ${appJSX}
      </script>`
    );
    
    return combinedHTML;
  };

  const refreshPreview = () => {
    if (previewIframeRef.current && previewIframeRef.current.contentWindow) {
      try {
        const previewDoc = previewIframeRef.current.contentWindow.document;
        previewDoc.open();
        previewDoc.write(generatePreviewHTML());
        previewDoc.close();
      } catch (error) {
        console.error("Error updating preview:", error);
      }
    }
  };

  // Update preview when tab changes to preview
  useEffect(() => {
    if (activeTab === "preview" && generatedResult) {
      refreshPreview();
    }
  }, [activeTab, generatedResult]);

  const handleDownload = () => {
    // In a real implementation, this would create a ZIP file with all the generated files
    toast({
      title: "Download started",
      description: "Your project files are being prepared for download.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete!",
        description: "Project files downloaded successfully.",
      });
    }, 1500);
  };

  const getCurrentFileContent = () => {
    if (!generatedResult || !viewedFile) return "";
    
    if (activeTab === "frontend" && generatedResult.frontendCode && generatedResult.frontendCode[viewedFile]) {
      return generatedResult.frontendCode[viewedFile];
    } else if (activeTab === "backend" && generatedResult.backendCode && generatedResult.backendCode[viewedFile]) {
      return generatedResult.backendCode[viewedFile];
    }
    
    return "";
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">QwiXPro Builder</h1>
            <p className="text-muted-foreground">
              Generate complete web applications from a simple prompt
            </p>
          </div>
          <Badge variant="outline" className="bg-modern-blue-500/10 text-modern-blue-500 border-modern-blue-500/30 px-3 py-1">
            <Sparkles className="mr-2 h-4 w-4" /> AI Powered
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Describe what you want to build and we'll generate it for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Project Name (Optional)</label>
                  <Input
                    placeholder="my-awesome-app"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Project Description</label>
                  <Textarea
                    placeholder="Build me a calculator app with a modern design and basic arithmetic operations"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-32"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Be specific about the features, design style, and technologies if you have preferences
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Example prompts:</p>
                  <div className="space-y-1">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2 px-3" 
                      onClick={() => setPrompt("Build a to-do list app with the ability to add, delete and mark tasks as completed")}
                    >
                      <span className="truncate">Build a to-do list app with CRUD operations</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2 px-3" 
                      onClick={() => setPrompt("Create a weather dashboard that shows the current weather and 5-day forecast")}
                    >
                      <span className="truncate">Create a weather dashboard app</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2 px-3" 
                      onClick={() => setPrompt("Build a responsive portfolio website with about, projects and contact sections")}
                    >
                      <span className="truncate">Build a portfolio website</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()} 
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Project...
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

            {generatedResult && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Project Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download as ZIP
                  </Button>
                  
                  {activeTab !== "preview" && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setActiveTab("preview")}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Open Live Preview
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            {isGenerating ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="space-y-4 text-center">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      </div>
                      <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center animate-pulse">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Generating Your Project</h3>
                      <p className="text-muted-foreground mt-1">
                        Our AI is creating your application based on your description...
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        <Paintbrush className="h-3 w-3 mr-1" /> UI Design
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        <Code className="h-3 w-3 mr-1" /> Frontend Code
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                        <Server className="h-3 w-3 mr-1" /> Backend Code
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : generatedResult ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>{generatedResult.name}</CardTitle>
                    <Badge className="capitalize">{activeTab}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="border-b px-4">
                      <TabsList className="mt-0">
                        <TabsTrigger value="frontend" className="flex items-center gap-1">
                          <Layers className="h-4 w-4" />
                          Frontend
                        </TabsTrigger>
                        <TabsTrigger value="backend" className="flex items-center gap-1">
                          <Server className="h-4 w-4" />
                          Backend
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          Preview
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="frontend" className="p-0 m-0">
                      <div className="p-4">
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Frontend Files</h3>
                          <div className="flex gap-2 flex-wrap">
                            {generatedResult.frontendCode && Object.keys(generatedResult.frontendCode).map((filename) => (
                              <Badge 
                                key={filename} 
                                variant={viewedFile === filename ? "default" : "outline"} 
                                className={`cursor-pointer ${viewedFile === filename ? "" : "bg-slate-100"}`}
                                onClick={() => setViewedFile(filename)}
                              >
                                <FileCode className="h-3.5 w-3.5 mr-1" /> {filename}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {viewedFile && (
                          <div className="border rounded-lg">
                            <div className="p-2 border-b bg-slate-50 flex items-center">
                              <FileCode className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">{viewedFile}</span>
                            </div>
                            <pre className="p-4 overflow-auto text-sm font-mono bg-slate-50 rounded-b-lg max-h-[500px]">
                              {getCurrentFileContent()}
                            </pre>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="backend" className="p-0 m-0">
                      <div className="p-4">
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Backend Files</h3>
                          <div className="flex gap-2 flex-wrap">
                            {generatedResult.backendCode && Object.keys(generatedResult.backendCode).map((filename) => (
                              <Badge 
                                key={filename} 
                                variant={viewedFile === filename ? "default" : "outline"} 
                                className={`cursor-pointer ${viewedFile === filename ? "" : "bg-slate-100"}`}
                                onClick={() => setViewedFile(filename)}
                              >
                                <Terminal className="h-3.5 w-3.5 mr-1" /> {filename}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {viewedFile && (
                          <div className="border rounded-lg">
                            <div className="p-2 border-b bg-slate-50 flex items-center">
                              <Terminal className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">{viewedFile}</span>
                            </div>
                            <pre className="p-4 overflow-auto text-sm font-mono bg-slate-50 rounded-b-lg max-h-[500px]">
                              {getCurrentFileContent()}
                            </pre>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="preview" className="p-0 m-0">
                      <div className="p-4">
                        <div className="border rounded-lg bg-slate-50 p-4">
                          <h3 className="text-lg font-medium mb-2 text-center">Live Preview</h3>
                          <div className="bg-white p-2 border rounded-lg mb-4 min-h-[500px]">
                            <iframe 
                              ref={previewIframeRef} 
                              title="Project Preview"
                              className="w-full h-[500px] border-0"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          </div>
                          <div className="flex justify-center">
                            <Button 
                              onClick={refreshPreview}
                              size="sm"
                              variant="outline"
                            >
                              <Cpu className="mr-2 h-4 w-4" />
                              Refresh Preview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-1">Create Your Application</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Describe what you want to build and our AI will generate a complete project for you
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">Express.js</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">Python Flask</Badge>
                    <Badge variant="outline">Modern UI</Badge>
                    <Badge variant="outline">Responsive Design</Badge>
                    <Badge variant="outline">...and more!</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default QwiXProBuilder;

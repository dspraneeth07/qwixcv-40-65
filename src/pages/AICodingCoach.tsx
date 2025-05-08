
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Code,
  Play,
  Loader2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Clock,
  List,
  Sparkles,
  FileCode,
  MessageSquare,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize,
  Minimize,
  Download,
  Upload
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

// Mock function to analyze code
const analyzeCode = async (code: string, language: string, analysisType: string) => {
  try {
    console.log(`Analyzing ${language} code for ${analysisType}`);
    
    const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc"; // This is a placeholder
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    let prompt = "";
    switch(analysisType) {
      case "quality":
        prompt = `You are a senior code reviewer. Analyze this ${language} code for quality issues:
        
        ${code}
        
        Provide feedback in JSON format:
        {
          "overallQuality": 85, // score from 0-100
          "strengths": ["Strength 1", "Strength 2"],
          "weaknesses": ["Weakness 1", "Weakness 2"],
          "suggestions": ["Suggestion 1", "Suggestion 2"],
          "recommendations": [
            { "line": 5, "message": "Consider using const instead of let", "severity": "minor" }
          ]
        }`;
        break;
        
      case "complexity":
        prompt = `You are an algorithm expert. Analyze this ${language} code for time and space complexity:
        
        ${code}
        
        Provide analysis in JSON format:
        {
          "timeComplexity": {
            "notation": "O(n log n)",
            "explanation": "The sort operation takes n log n time"
          },
          "spaceComplexity": {
            "notation": "O(n)",
            "explanation": "We're creating a new array of size n"
          },
          "criticalSections": [
            { "line": 7, "complexity": "O(n^2)", "suggestion": "Consider using a more efficient algorithm" }
          ],
          "optimizationTips": ["Tip 1", "Tip 2"]
        }`;
        break;
        
      case "bestPractices":
        prompt = `You are a ${language} expert. Analyze this code for adherence to best practices:
        
        ${code}
        
        Provide analysis in JSON format:
        {
          "score": 75,
          "languageSpecificIssues": ["Issue 1", "Issue 2"],
          "securityConcerns": ["Security issue 1"],
          "readabilityIssues": ["Readability issue 1"],
          "suggestions": [
            { "line": 12, "message": "Add proper error handling", "severity": "critical" }
          ],
          "positiveAspects": ["Good aspect 1"]
        }`;
        break;
        
      default:
        prompt = `Analyze this ${language} code and provide general feedback:
        
        ${code}`;
    }
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    // Extract the JSON portion from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse analysis results");
    
    try {
      // Parse the JSON result
      const analysisResults = JSON.parse(jsonMatch[0]);
      return analysisResults;
    } catch (error) {
      // If JSON parsing fails, return the raw text
      return { 
        rawAnalysis: aiResponse,
        error: "Failed to parse structured response"
      };
    }
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};

const AICodingCoach = () => {
  const [code, setCode] = useState(
`// Example: Sorting an array in JavaScript
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`
  );
  const [language, setLanguage] = useState("javascript");
  const [analysisType, setAnalysisType] = useState("quality");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const { toast } = useToast();
  
  const { 
    data: analysisResults, 
    isLoading: isAnalyzing, 
    isError,
    error,
    refetch,
    isSuccess: analysisComplete
  } = useQuery({
    queryKey: ['codeAnalysis', code, language, analysisType],
    queryFn: () => analyzeCode(code, language, analysisType),
    enabled: false, // Don't run automatically
    retry: 1,
  });
  
  const handleAnalyze = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter code to analyze",
        variant: "destructive"
      });
      return;
    }
    refetch();
  };
  
  const renderQualityAnalysis = () => {
    if (!analysisResults) return null;
    
    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Overall Quality Score</h3>
            <Badge variant={
              analysisResults.overallQuality >= 80 ? "success" :
              analysisResults.overallQuality >= 60 ? "warning" : "destructive"
            }>
              {analysisResults.overallQuality}/100
            </Badge>
          </div>
          <Progress value={analysisResults.overallQuality} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {analysisResults.strengths?.map((strength: string, idx: number) => (
                  <li key={idx} className="text-sm">{strength}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {analysisResults.weaknesses?.map((weakness: string, idx: number) => (
                  <li key={idx} className="text-sm">{weakness}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Specific Recommendations</h3>
          <div className="space-y-3">
            {analysisResults.recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="bg-muted p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <Badge variant={
                    rec.severity === 'critical' ? "destructive" :
                    rec.severity === 'major' ? "warning" : "outline"
                  } className="mt-0.5">
                    Line {rec.line}
                  </Badge>
                  <p className="text-sm flex-1">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Suggestions for Improvement</h3>
          <ul className="space-y-2 pl-5 list-disc">
            {analysisResults.suggestions?.map((suggestion: string, idx: number) => (
              <li key={idx} className="text-sm">{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  const renderComplexityAnalysis = () => {
    if (!analysisResults) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                Time Complexity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {analysisResults.timeComplexity?.notation}
                </Badge>
              </div>
              <p className="text-sm">{analysisResults.timeComplexity?.explanation}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart3 className="mr-2 h-4 w-4 text-purple-500" />
                Space Complexity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  {analysisResults.spaceComplexity?.notation}
                </Badge>
              </div>
              <p className="text-sm">{analysisResults.spaceComplexity?.explanation}</p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Critical Sections</h3>
          <div className="space-y-3">
            {analysisResults.criticalSections?.map((section: any, idx: number) => (
              <div key={idx} className="bg-muted p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mt-0.5">
                    Line {section.line}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{section.complexity}</p>
                    <p className="text-sm text-muted-foreground">{section.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Optimization Tips</h3>
          <ul className="space-y-2 pl-5 list-disc">
            {analysisResults.optimizationTips?.map((tip: string, idx: number) => (
              <li key={idx} className="text-sm">{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  const renderBestPracticesAnalysis = () => {
    if (!analysisResults) return null;
    
    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Best Practices Score</h3>
            <Badge variant={
              analysisResults.score >= 80 ? "success" :
              analysisResults.score >= 60 ? "warning" : "destructive"
            }>
              {analysisResults.score}/100
            </Badge>
          </div>
          <Progress value={analysisResults.score} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Positive Aspects
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {analysisResults.positiveAspects?.map((aspect: string, idx: number) => (
                  <li key={idx} className="text-sm">{aspect}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center text-amber-600">
                <List className="mr-2 h-4 w-4" />
                Language-Specific Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {analysisResults.languageSpecificIssues?.map((issue: string, idx: number) => (
                  <li key={idx} className="text-sm">{issue}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-red-100">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center text-red-600">
                <AlertCircle className="mr-2 h-4 w-4" />
                Security Concerns
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {analysisResults.securityConcerns?.length > 0 ? 
                  analysisResults.securityConcerns?.map((concern: string, idx: number) => (
                    <li key={idx} className="text-sm">{concern}</li>
                  )) : 
                  <li className="text-sm text-green-600">No security issues detected</li>
                }
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileCode className="mr-2 h-4 w-4" />
                Readability Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {analysisResults.readabilityIssues?.map((issue: string, idx: number) => (
                  <li key={idx} className="text-sm">{issue}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Specific Suggestions</h3>
          <div className="space-y-3">
            {analysisResults.suggestions?.map((suggestion: any, idx: number) => (
              <div key={idx} className="bg-muted p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <Badge variant={
                    suggestion.severity === 'critical' ? "destructive" :
                    suggestion.severity === 'major' ? "warning" : "outline"
                  } className="mt-0.5">
                    Line {suggestion.line}
                  </Badge>
                  <p className="text-sm flex-1">{suggestion.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderAnalysisResults = () => {
    if (!analysisComplete || !analysisResults) return null;
    
    // If we have raw analysis (failed to parse JSON)
    if (analysisResults.rawAnalysis) {
      return (
        <div className="p-4 bg-muted rounded-lg">
          <p className="whitespace-pre-wrap font-mono text-sm">{analysisResults.rawAnalysis}</p>
        </div>
      );
    }
    
    switch(analysisType) {
      case 'quality':
        return renderQualityAnalysis();
      case 'complexity':
        return renderComplexityAnalysis();
      case 'bestPractices':
        return renderBestPracticesAnalysis();
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className={`container py-6 ${fullScreen ? 'max-w-none px-2' : ''}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Coding Coach</h1>
          <p className="text-muted-foreground">
            Get instant feedback, complexity analysis, and best practices for your code
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`${sidebarOpen ? 'lg:w-1/3' : 'lg:w-16'} ${fullScreen ? 'hidden' : ''}`}>
            <div className={`border rounded-lg p-4 ${sidebarOpen ? '' : 'hidden lg:block'}`}>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Code Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select what type of feedback you want for your code
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Programming Language</label>
                    <select
                      className="w-full border rounded-md p-2 bg-background"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="csharp">C#</option>
                      <option value="cpp">C++</option>
                      <option value="go">Go</option>
                      <option value="ruby">Ruby</option>
                      <option value="php">PHP</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Analysis Type</label>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant={analysisType === "quality" ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setAnalysisType("quality")}
                      >
                        <FileCode className="mr-2 h-4 w-4" />
                        Code Quality
                      </Button>
                      <Button
                        variant={analysisType === "complexity" ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setAnalysisType("complexity")}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Time & Space Complexity
                      </Button>
                      <Button
                        variant={analysisType === "bestPractices" ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setAnalysisType("bestPractices")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Best Practices
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${sidebarOpen ? 'lg:w-2/3' : 'lg:flex-1'} ${fullScreen ? 'w-full' : ''}`}>
            <div className="flex flex-col h-full">
              <div className="border rounded-lg mb-4">
                <div className="flex items-center justify-between border-b p-2 bg-muted/50">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Code Editor</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-7 w-7 hidden lg:flex">
                      {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setFullScreen(!fullScreen)} className="h-7 w-7">
                      {fullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" title="Download Code" className="h-7 w-7">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Upload Code" className="h-7 w-7">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Run Code" className="h-7 w-7">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-sm min-h-[400px] border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Enter your code here..."
                  spellCheck={false}
                />
              </div>
              
              {isAnalyzing && (
                <div className="p-6 border rounded-lg mb-4 flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analyzing Your Code</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Our AI is evaluating your code for {analysisType === 'quality' ? 'quality issues' : 
                      analysisType === 'complexity' ? 'time and space complexity' : 'best practices'}
                  </p>
                </div>
              )}
              
              {isError && (
                <div className="p-4 border border-red-300 bg-red-50 rounded-lg mb-4">
                  <h3 className="font-medium text-red-800 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Error analyzing code
                  </h3>
                  <p className="text-red-600">{(error as Error).message || "Please check your code and try again."}</p>
                </div>
              )}
              
              {analysisResults && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {analysisType === 'quality' ? (
                        <FileCode className="mr-2 h-5 w-5" />
                      ) : analysisType === 'complexity' ? (
                        <BarChart3 className="mr-2 h-5 w-5" />
                      ) : (
                        <CheckCircle className="mr-2 h-5 w-5" />
                      )}
                      {analysisType === 'quality' ? 'Code Quality Analysis' : 
                        analysisType === 'complexity' ? 'Complexity Analysis' : 'Best Practices Analysis'}
                    </CardTitle>
                    <CardDescription>
                      {analysisType === 'quality' ? 'Feedback on code quality, strengths and areas for improvement' :
                        analysisType === 'complexity' ? 'Assessment of algorithmic time and space complexity' :
                        'Evaluation of coding standards and best practices'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderAnalysisResults()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AICodingCoach;

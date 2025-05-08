
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Linkedin, 
  Search, 
  Loader2, 
  ArrowUp, 
  TagIcon, 
  BarChart3, 
  BookText, 
  FileText, 
  CheckCircle2
} from "lucide-react";

const LinkedInOptimizer = () => {
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  // Simulated analysis results (in a real app, this would come from an API)
  const [analysisResults, setAnalysisResults] = useState({
    headline: {
      current: "",
      suggested: "",
      score: 0
    },
    summary: {
      current: "",
      suggested: "",
      score: 0
    },
    keywords: {
      missing: [] as string[],
      recommended: [] as string[]
    },
    experience: {
      suggestions: [] as string[]
    }
  });

  const handleAnalyze = async () => {
    // Validate input
    if (!linkedInUrl.trim() || !linkedInUrl.includes("linkedin.com")) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock analysis results
      setAnalysisResults({
        headline: {
          current: "Software Developer at XYZ Company",
          suggested: "Full Stack Developer | React & Node.js Expert | Cloud Solutions Architect",
          score: 65
        },
        summary: {
          current: "I am a software developer with 5 years of experience.",
          suggested: "Results-driven Full Stack Developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and AWS cloud architecture. Passionate about creating efficient, user-focused solutions that drive business growth. Reduced load times by 40% and increased user engagement by 25% at XYZ Company through frontend optimization.",
          score: 45
        },
        keywords: {
          missing: ["React Native", "TypeScript", "CI/CD", "Agile", "Team Leadership"],
          recommended: ["Full Stack Development", "React.js", "Node.js", "AWS", "Performance Optimization"]
        },
        experience: {
          suggestions: [
            "Add quantifiable achievements to your XYZ Company role (e.g., 'Increased site performance by 40%')",
            "Use more action verbs in your ABC Corp experience",
            "Highlight team leadership and collaboration across your roles",
            "Incorporate more industry-specific keywords in your job descriptions"
          ]
        }
      });
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: "LinkedIn Profile Analysis Complete",
        description: "We've analyzed your profile and have recommendations for optimization"
      });
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-500";
    if (score < 75) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">LinkedIn Profile Optimizer</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhance your LinkedIn profile's visibility and effectiveness with AI-powered optimization recommendations
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn Profile Analysis
              </CardTitle>
              <CardDescription>
                Enter your LinkedIn profile URL to receive personalized optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://www.linkedin.com/in/your-profile"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze Profile
                    </>
                  )}
                </Button>
              </div>
              
              {isAnalyzing && (
                <div className="mt-6 p-6 border rounded-lg flex flex-col items-center">
                  <div className="mb-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Analyzing Your LinkedIn Profile</h3>
                  <p className="text-center text-muted-foreground max-w-md mb-4">
                    Our AI is analyzing your profile, comparing it to industry standards, and generating personalized recommendations
                  </p>
                  <div className="w-full max-w-md space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Analyzing headline...</span>
                        <span>Complete</span>
                      </div>
                      <div className="bg-primary/10 rounded-full h-2 w-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Analyzing summary...</span>
                        <span>Complete</span>
                      </div>
                      <div className="bg-primary/10 rounded-full h-2 w-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Analyzing experience...</span>
                        <span>Complete</span>
                      </div>
                      <div className="bg-primary/10 rounded-full h-2 w-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Generating recommendations...</span>
                        <span>In progress</span>
                      </div>
                      <div className="bg-primary/10 rounded-full h-2 w-full overflow-hidden">
                        <div className="bg-primary h-2 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {analysisComplete && (
            <Tabs defaultValue="headline" className="mt-8">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="headline">Headline</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>
              
              <TabsContent value="headline">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <ArrowUp className="mr-2 h-5 w-5" />
                          Headline Optimization
                        </CardTitle>
                        <CardDescription>
                          Your headline is one of the most important elements of your LinkedIn profile
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Score:</span>
                        <span className={`text-lg font-bold ${getScoreColor(analysisResults.headline.score)}`}>
                          {analysisResults.headline.score}/100
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Current Headline</h4>
                      <div className="p-4 bg-muted rounded-lg">
                        <p>{analysisResults.headline.current}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Suggested Headline</h4>
                      <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-green-800">{analysisResults.headline.suggested}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        This optimized headline includes key skills and positions to improve searchability
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Headline Tips</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Include your current position and key specializations</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Use industry-specific keywords that recruiters search for</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Keep it under 220 characters for full visibility on mobile</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Use vertical bars (|) to separate sections cleanly</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <BookText className="mr-2 h-5 w-5" />
                          Summary Optimization
                        </CardTitle>
                        <CardDescription>
                          Your summary should tell your professional story and highlight key achievements
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Score:</span>
                        <span className={`text-lg font-bold ${getScoreColor(analysisResults.summary.score)}`}>
                          {analysisResults.summary.score}/100
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Current Summary</h4>
                      <div className="p-4 bg-muted rounded-lg">
                        <p>{analysisResults.summary.current}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Suggested Summary</h4>
                      <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-green-800">{analysisResults.summary.suggested}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Summary Tips</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Start with a strong opening statement about your professional identity</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Include quantifiable achievements and results</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Incorporate relevant industry keywords naturally</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">End with a call to action or statement about what you're seeking</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Customizable Suggestion</h4>
                      <Textarea 
                        className="min-h-[200px]" 
                        defaultValue={analysisResults.summary.suggested} 
                      />
                      <div className="flex justify-end mt-2">
                        <Button variant="outline" size="sm">Copy to Clipboard</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="keywords">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TagIcon className="mr-2 h-5 w-5" />
                      Keyword Analysis
                    </CardTitle>
                    <CardDescription>
                      Keywords help recruiters find your profile in LinkedIn searches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Recommended Keywords</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {analysisResults.keywords.recommended.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-green-50 text-green-800 hover:bg-green-100">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        These keywords are already present in your profile and align with industry standards
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {analysisResults.keywords.missing.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="border-amber-300 text-amber-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Consider adding these keywords to your profile if they're relevant to your experience and goals
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Keyword Placement Tips</h4>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Include important keywords in your headline, summary, and job titles</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Use variations of key terms (e.g., "UI/UX Design" and "User Interface Design")</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Add relevant skills to the Skills section and get endorsements for them</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experience">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Experience Optimization
                    </CardTitle>
                    <CardDescription>
                      Strengthen your work experience descriptions with these tailored suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Experience Improvement Suggestions</h4>
                      <div className="space-y-3">
                        {analysisResults.experience.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="bg-amber-50 border border-amber-100 p-3 rounded-md">
                            <p className="text-amber-800">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Experience Writing Tips</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Use the STAR method: Situation, Task, Action, Result</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Begin descriptions with powerful action verbs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Include metrics and quantifiable achievements wherever possible</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">Focus on contributions and results rather than job duties</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Power Verbs for Experience Descriptions</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Achieved", "Implemented", "Developed", "Led", "Managed", 
                          "Increased", "Decreased", "Improved", "Created", "Launched",
                          "Redesigned", "Streamlined", "Secured", "Negotiated", "Mentored"
                        ].map((verb, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {verb}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LinkedInOptimizer;

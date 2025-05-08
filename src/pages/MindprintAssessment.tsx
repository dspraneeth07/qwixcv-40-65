
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  ProgressCircle, 
  Progress 
} from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  LightbulbIcon, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  ThumbsUp, 
  Calculator, 
  LineChart,
  ListChecks,
  UserCircle,
  Loader2
} from "lucide-react";

// Types for our assessment
interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Career {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  traits: {
    trait: string;
    score: number;
  }[];
  keyStrengths: string[];
}

// Mock questions for the assessment
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "When facing a complex problem, I prefer to:",
    options: [
      "Break it down into logical steps and analyze each part",
      "Visualize potential solutions and look for patterns",
      "Discuss it with others to hear different perspectives",
      "Jump in and test different approaches through trial and error"
    ]
  },
  {
    id: 2,
    text: "When learning something new, I find it easiest to:",
    options: [
      "Read about it in detail first before trying",
      "Watch someone else demonstrate it",
      "Have someone explain it to me verbally",
      "Try it hands-on immediately"
    ]
  },
  {
    id: 3,
    text: "In a group project, I typically take on the role of:",
    options: [
      "The organizer who creates plans and schedules",
      "The creative who generates new ideas",
      "The mediator who ensures everyone works well together",
      "The implementer who gets things done"
    ]
  },
  {
    id: 4,
    text: "When making important decisions, I tend to:",
    options: [
      "Gather all possible information and weigh pros and cons",
      "Consider what feels right based on my intuition",
      "Think about how it affects the people involved",
      "Focus on practical outcomes and results"
    ]
  },
  {
    id: 5,
    text: "I feel most energized when:",
    options: [
      "I'm solving complex problems or puzzles",
      "I'm creating something new or innovative",
      "I'm having meaningful conversations with others",
      "I'm accomplishing tangible goals"
    ]
  },
  {
    id: 6,
    text: "Under pressure, I am most likely to:",
    options: [
      "Create a systematic approach to handle the situation",
      "Step back to see the big picture before proceeding",
      "Connect with others for support and ideas",
      "Take immediate action to resolve the issue"
    ]
  },
  {
    id: 7,
    text: "I value workplaces that offer:",
    options: [
      "Intellectual challenge and opportunities to develop expertise",
      "Creative freedom and appreciation for innovation",
      "Collaborative culture and meaningful purpose",
      "Clear goals and recognition for achievement"
    ]
  },
  {
    id: 8,
    text: "I'm most motivated when my work:",
    options: [
      "Requires deep analysis and systematic thinking",
      "Allows me to explore new possibilities and ideas",
      "Makes a positive difference in people's lives",
      "Produces tangible results I can be proud of"
    ]
  }
];

// Mock career recommendations
const mockCareers: Career[] = [
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Your analytical mindset and systematic approach make you well-suited for data science roles where you can leverage data to solve complex problems and develop insights that drive business decisions.",
    matchScore: 92,
    traits: [
      { trait: "Analytical Thinking", score: 95 },
      { trait: "Problem Solving", score: 90 },
      { trait: "Logical Reasoning", score: 88 },
      { trait: "Attention to Detail", score: 85 }
    ],
    keyStrengths: [
      "Systematic approach to complex problems",
      "Comfort with quantitative analysis",
      "Pattern recognition capabilities",
      "Methodical learning style"
    ]
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    description: "Your visual thinking style and empathetic approach make you naturally suited for user experience design, where you can create intuitive interfaces and solve problems in creative, user-centered ways.",
    matchScore: 85,
    traits: [
      { trait: "Visual Thinking", score: 90 },
      { trait: "Empathy", score: 88 },
      { trait: "Creativity", score: 85 },
      { trait: "Pattern Recognition", score: 82 }
    ],
    keyStrengths: [
      "Visual-spatial thinking",
      "Intuitive understanding of user needs",
      "Creative approach to problem-solving",
      "Holistic perspective"
    ]
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Your balanced approach combining analytical thinking with strong interpersonal skills makes you well-suited for product management, where you can bridge technical and business perspectives.",
    matchScore: 78,
    traits: [
      { trait: "Strategic Thinking", score: 82 },
      { trait: "Communication", score: 80 },
      { trait: "Decision Making", score: 75 },
      { trait: "Adaptability", score: 74 }
    ],
    keyStrengths: [
      "Balanced analytical and creative thinking",
      "Strategic decision-making abilities",
      "Comfort working with diverse teams",
      "Future-oriented perspective"
    ]
  }
];

const MindprintAssessment = () => {
  const [currentStep, setCurrentStep] = useState<"intro" | "assessment" | "processing" | "results">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(mockQuestions.length).fill(-1));
  const [processingProgress, setProcessingProgress] = useState(0);
  const [careerResults, setCareerResults] = useState<Career[]>([]);
  const { toast } = useToast();

  // Start the assessment
  const startAssessment = () => {
    setCurrentStep("assessment");
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  // Move to next question or complete assessment
  const handleNext = () => {
    if (answers[currentQuestionIndex] === -1) {
      toast({
        title: "Please select an answer",
        description: "Select one of the options before proceeding",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Start processing results
      setCurrentStep("processing");
      simulateProcessing();
    }
  };

  // Go back to previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Simulate AI processing of results
  const simulateProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Generate "results" based on answers
        setCareerResults(mockCareers);
        setCurrentStep("results");
      }
    }, 200);
  };

  const renderIntro = () => (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
          <Brain className="h-8 w-8 text-blue-700" />
        </div>
        <CardTitle className="text-2xl text-center">Mindprint Assessment & AI Career Fit</CardTitle>
        <CardDescription className="text-center max-w-lg mx-auto">
          Discover career paths that match not just your skills, but your natural thinking style, 
          personality traits, and decision-making preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-center text-blue-800 font-medium italic mb-1">
            "Find not just the job you can do, but the one you were built for."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="mx-auto mb-2 bg-slate-200 p-2 rounded-full w-12 h-12 flex items-center justify-center">
              <Brain className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="font-medium mb-1">Thinking Style</h3>
            <p className="text-sm text-slate-600">
              Analyzes how you process information and solve problems
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="mx-auto mb-2 bg-slate-200 p-2 rounded-full w-12 h-12 flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="font-medium mb-1">Personality Traits</h3>
            <p className="text-sm text-slate-600">
              Identifies your natural tendencies and preferences
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="mx-auto mb-2 bg-slate-200 p-2 rounded-full w-12 h-12 flex items-center justify-center">
              <LightbulbIcon className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="font-medium mb-1">Decision Making</h3>
            <p className="text-sm text-slate-600">
              Examines how you approach choices and evaluate options
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">About This Assessment:</h3>
          <ul className="space-y-1">
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">Short 8-question psychometric assessment</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">Takes approximately 5 minutes to complete</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">AI analyzes patterns in your responses</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">Matched against thousands of career paths to find your ideal fit</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={startAssessment}>
          Start Assessment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderAssessment = () => (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="px-3 py-1">
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {Math.round(((currentQuestionIndex + 1) / mockQuestions.length) * 100)}% Complete
          </div>
        </div>
        <Progress value={((currentQuestionIndex + 1) / mockQuestions.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{mockQuestions[currentQuestionIndex].text}</h2>
          <RadioGroup
            value={answers[currentQuestionIndex].toString()}
            onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, parseInt(value))}
            className="space-y-3"
          >
            {mockQuestions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-0.5" />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentQuestionIndex < mockQuestions.length - 1 ? "Next" : "Complete Assessment"}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderProcessing = () => (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Processing Your Results</CardTitle>
        <CardDescription className="text-center">
          Our AI is analyzing your responses to identify your unique cognitive profile
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-8">
        <div className="relative h-40 w-40 mb-8">
          <ProgressCircle value={processingProgress} size="lg" className="text-primary">
            <Brain className="h-10 w-10 text-primary" />
          </ProgressCircle>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Analyzing thinking patterns...</span>
              <span>{processingProgress > 30 ? "Complete" : "Processing"}</span>
            </div>
            <Progress value={processingProgress > 30 ? 100 : (processingProgress / 30) * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Identifying personality traits...</span>
              <span>{processingProgress > 60 ? "Complete" : processingProgress > 30 ? "Processing" : "Waiting"}</span>
            </div>
            <Progress value={processingProgress > 60 ? 100 : processingProgress > 30 ? ((processingProgress - 30) / 30) * 100 : 0} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Matching with optimal career paths...</span>
              <span>{processingProgress > 90 ? "Complete" : processingProgress > 60 ? "Processing" : "Waiting"}</span>
            </div>
            <Progress value={processingProgress > 90 ? 100 : processingProgress > 60 ? ((processingProgress - 60) / 30) * 100 : 0} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your Mindprint Assessment Results</CardTitle>
          <CardDescription className="text-center">
            Based on your responses, we've identified career paths that align with your natural thinking style and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="mx-auto mb-2 bg-blue-100 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-medium">Analytical Thinker</h3>
                <p className="text-sm text-muted-foreground">
                  You approach problems methodically and enjoy working with complex information
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="mx-auto mb-2 bg-purple-100 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="font-medium">Independent Contributor</h3>
                <p className="text-sm text-muted-foreground">
                  You thrive on autonomy while still valuing collaboration on important projects
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="mx-auto mb-2 bg-green-100 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                  <LightbulbIcon className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="font-medium">Logical Decision-Maker</h3>
                <p className="text-sm text-muted-foreground">
                  You prioritize facts and data when making important decisions
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Career Match Recommendations</h3>
              
              <div className="space-y-4">
                {careerResults.map((career) => (
                  <Card key={career.id} className={`border-l-4 ${
                    career.matchScore > 90 ? 'border-l-green-500' : 
                    career.matchScore > 80 ? 'border-l-blue-500' : 'border-l-purple-500'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            career.matchScore > 90 ? 'bg-green-100' : 
                            career.matchScore > 80 ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            <Briefcase className={`h-5 w-5 ${
                              career.matchScore > 90 ? 'text-green-700' : 
                              career.matchScore > 80 ? 'text-blue-700' : 'text-purple-700'
                            }`} />
                          </div>
                          <div>
                            <CardTitle>{career.title}</CardTitle>
                            <CardDescription>Career Match</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{career.matchScore}%</div>
                          <div className="text-xs text-muted-foreground">Compatibility</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{career.description}</p>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Trait Alignment</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {career.traits.map((trait, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{trait.trait}</span>
                                <span className="text-sm font-medium">{trait.score}%</span>
                              </div>
                              <Progress value={trait.score} className="h-1.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Strengths</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.keyStrengths.map((strength, idx) => (
                            <Badge key={idx} variant="secondary">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Explore This Career Path
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button onClick={() => setCurrentStep("intro")}>
          Retake Assessment
        </Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container py-10">
        {currentStep === "intro" && renderIntro()}
        {currentStep === "assessment" && renderAssessment()}
        {currentStep === "processing" && renderProcessing()}
        {currentStep === "results" && renderResults()}
      </div>
    </Layout>
  );
};

export default MindprintAssessment;

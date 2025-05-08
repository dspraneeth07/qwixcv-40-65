
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Video, Mic, FileText, Download, MessageCircle, User, Clock, ArrowRight } from 'lucide-react';

const InterviewCoach: React.FC = () => {
  const { toast } = useToast();
  const [stage, setStage] = useState<'setup' | 'preparation' | 'interview' | 'feedback'>('setup');
  const [jobRole, setJobRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'moderate' | 'hard'>('moderate');
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  // Sample questions by difficulty
  const questionsByDifficulty = {
    easy: [
      "Tell me about yourself.",
      "What are your strengths?",
      "Why do you want to work here?",
      "What are your career goals?",
      "Describe a challenge you've faced and how you overcame it."
    ],
    moderate: [
      "Tell me about a time you had to work under pressure to meet a deadline.",
      "How do you prioritize tasks when you have multiple deadlines?",
      "Tell me about a time when you had to adapt to a significant change at work.",
      "Describe a situation where you had to resolve a conflict with a colleague.",
      "How do you stay updated with the latest trends in your field?"
    ],
    hard: [
      "Describe a project that failed. What did you learn and how would you approach it differently now?",
      "Tell me about a time when you had to make an unpopular decision.",
      "How have you handled situations where stakeholders had competing priorities?",
      "Describe how you've influenced decision-making without having direct authority.",
      "How do you measure the success of your work, beyond the obvious metrics?"
    ]
  };

  // Generate interview questions based on inputs
  const generateInterviewQuestions = () => {
    if (!jobRole || !companyName) {
      toast({
        title: "Missing information",
        description: "Please provide both job role and company name.",
        variant: "destructive"
      });
      return;
    }
    
    // In a production app, we would call an AI API here
    // For now, we'll use predefined questions based on difficulty
    
    const baseQuestions = [...questionsByDifficulty[difficultyLevel]];
    
    // Add job-specific and company-specific questions
    const jobSpecificQuestions = [
      `What specific skills do you have that make you a good fit for the ${jobRole} position?`,
      `How would you handle a typical challenge faced by someone in the ${jobRole} role?`,
      `What interests you most about being a ${jobRole}?`
    ];
    
    const companySpecificQuestions = [
      `Why do you want to work at ${companyName}?`,
      `What do you know about ${companyName}'s products/services?`,
      `How do you think you can contribute to ${companyName}'s mission?`
    ];
    
    const allQuestions = [...baseQuestions, ...jobSpecificQuestions, ...companySpecificQuestions];
    
    // Select a subset of questions
    const selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 8);
    setInterviewQuestions(selectedQuestions);
    
    // Initialize answers array with empty strings
    setAnswers(Array(selectedQuestions.length).fill(''));
    
    setStage('preparation');
  };
  
  // Start the interview session
  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setStage('interview');
    } catch (err) {
      console.error("Error accessing media devices:", err);
      toast({
        title: "Camera access denied",
        description: "Please allow access to your camera and microphone to continue the interview.",
        variant: "destructive"
      });
    }
  };
  
  // Handle recording for current question
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
    } else {
      // Start recording
      if (videoStream) {
        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(videoStream);
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          
          // In a production app, we would send this blob to an AI API for analysis
          // For now, we'll simulate feedback
          
          // Simulate analyzing the response
          simulateRealtimeFeedback();
          
          // Save answer
          const url = URL.createObjectURL(blob);
          const updatedAnswers = [...answers];
          updatedAnswers[currentQuestionIndex] = url;
          setAnswers(updatedAnswers);
        };
        
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorderRef.current.start();
        
        // Start timer
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        
        setIsRecording(true);
      }
    }
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Interview completed
      cleanupMedia();
      generateFeedbackReport();
      setStage('feedback');
    }
  };
  
  // Simulate real-time feedback during interview
  const simulateRealtimeFeedback = () => {
    const feedbackTypes = [
      { type: 'confidence', message: 'Try maintaining a more confident posture', positive: false },
      { type: 'eye-contact', message: 'Good eye contact maintained', positive: true },
      { type: 'voice', message: 'Speak a bit louder and clearer', positive: false },
      { type: 'filler-words', message: 'Watch filler words like "um" and "uh"', positive: false },
      { type: 'articulation', message: 'Well articulated response', positive: true }
    ];
    
    // Randomly select one type of feedback
    const feedback = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
    
    toast({
      title: feedback.positive ? "Good job!" : "Quick tip",
      description: feedback.message,
      variant: feedback.positive ? "default" : "destructive"
    });
  };
  
  // Generate comprehensive feedback report
  const generateFeedbackReport = () => {
    // In a production app, this would be based on actual AI analysis
    const report = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      metrics: {
        confidence: Math.floor(Math.random() * 40) + 60,
        eyeContact: Math.floor(Math.random() * 30) + 70,
        voiceClarity: Math.floor(Math.random() * 40) + 60,
        articulation: Math.floor(Math.random() * 30) + 70,
        content: Math.floor(Math.random() * 20) + 80
      },
      improvement: [
        "Try to maintain more consistent eye contact with the interviewer",
        "Work on reducing filler words like 'um' and 'uh'",
        "Practice speaking more confidently about your achievements",
        "Prepare more concise answers to common questions",
        "Consider using the STAR method more consistently for behavioral questions"
      ],
      strengths: [
        "Good articulation of technical concepts",
        "Strong examples of past experiences",
        "Clear communication style",
        "Well-structured answers"
      ]
    };
    
    setFeedbackData(report);
  };
  
  // Clean up media resources
  const cleanupMedia = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Generate PDF report
  const downloadReport = () => {
    toast({
      title: "Report downloading",
      description: "Your interview feedback report is being generated and downloaded.",
    });
    
    // In a production app, we would generate a real PDF here
    setTimeout(() => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Interview Feedback Report'));
      element.setAttribute('download', `Interview_Feedback_${jobRole}_${new Date().toISOString().split('T')[0]}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanupMedia();
    };
  }, []);

  // Validate API key format (basic check)
  const validateApiKey = () => {
    // Simple validation - in a real app you would validate with the actual API
    if (apiKey.length > 20) {
      setIsApiKeyValid(true);
      toast({
        title: "API Key validated",
        description: "You can now proceed with the interview setup.",
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

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-2">AI Interview Coach</h1>
        <p className="text-muted-foreground mb-8">Practice interviews with AI-powered feedback and analysis</p>
        
        {stage === 'setup' && (
          <Card>
            <CardHeader>
              <CardTitle>Interview Setup</CardTitle>
              <CardDescription>
                Configure your mock interview session and provide your API key for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="api-key">AI API Key</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input 
                    id="api-key"
                    type="password" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                    placeholder="Enter your API key for AI analysis"
                    className="flex-1"
                  />
                  <Button onClick={validateApiKey}>Verify</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Required for AI-powered analysis and feedback on your interview performance
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="job-role">Job Role</Label>
                  <Input 
                    id="job-role"
                    value={jobRole} 
                    onChange={(e) => setJobRole(e.target.value)} 
                    placeholder="e.g., Full Stack Developer"
                    className="mt-1.5"
                    disabled={!isApiKeyValid}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company"
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    placeholder="e.g., Google"
                    className="mt-1.5"
                    disabled={!isApiKeyValid}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <RadioGroup 
                  id="difficulty"
                  value={difficultyLevel} 
                  onValueChange={(value: 'easy' | 'moderate' | 'hard') => setDifficultyLevel(value)}
                  className="flex space-x-4 mt-1.5"
                  disabled={!isApiKeyValid}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateInterviewQuestions} 
                disabled={!isApiKeyValid || !jobRole || !companyName}
              >
                Generate Interview Questions
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {stage === 'preparation' && (
          <Card>
            <CardHeader>
              <CardTitle>Interview Preparation</CardTitle>
              <CardDescription>
                Review these {interviewQuestions.length} questions before starting your mock interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {interviewQuestions.map((question, index) => (
                  <li key={index} className="py-2 px-4 bg-primary-foreground rounded-md">
                    <span className="font-semibold text-primary mr-2">{index + 1}.</span> {question}
                  </li>
                ))}
              </ul>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold mb-2 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" /> Tips for Success
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Ensure you're in a well-lit, quiet environment</li>
                  <li>• Position your camera at eye level</li>
                  <li>• Dress professionally as you would for a real interview</li>
                  <li>• Have a glass of water nearby</li>
                  <li>• Take time to think before answering each question</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startInterview}>
                <Camera className="mr-2 h-4 w-4" />
                Start Interview Session
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {stage === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Question {currentQuestionIndex + 1}/{interviewQuestions.length}</CardTitle>
                    <Badge variant={isRecording ? "destructive" : "outline"}>
                      {isRecording ? "Recording" : "Ready"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg mb-4">{interviewQuestions[currentQuestionIndex]}</h3>
                  <div className="relative aspect-video mb-4 bg-muted rounded-md overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {isRecording && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded flex items-center text-sm">
                        <span className="h-2 w-2 bg-white rounded-full mr-2 animate-pulse"></span>
                        {formatTime(recordingTime)}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "default"}
                      className="flex-1"
                    >
                      {isRecording ? (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleNextQuestion} 
                      disabled={isRecording || !answers[currentQuestionIndex]}
                      className="flex-1"
                    >
                      {currentQuestionIndex < interviewQuestions.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Complete Interview
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Interview Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={(currentQuestionIndex / interviewQuestions.length) * 100} />
                  <p className="text-sm text-muted-foreground">
                    {currentQuestionIndex} of {interviewQuestions.length} questions completed
                  </p>
                  
                  <div className="space-y-2 mt-4">
                    {interviewQuestions.map((question, index) => (
                      <div 
                        key={index} 
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded text-sm
                          ${currentQuestionIndex === index ? 'bg-primary text-primary-foreground' : 
                            answers[index] ? 'bg-muted line-through opacity-70' : 'bg-background'}
                        `}
                      >
                        <span className="font-medium">Q{index + 1}</span>
                        <span className="truncate">{question.substring(0, 20)}...</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {stage === 'feedback' && feedbackData && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Interview Performance Report</span>
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardTitle>
                <CardDescription>
                  AI analysis of your {interviewQuestions.length}-question interview for {jobRole} at {companyName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-8 border rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-modern-blue-500 to-soft-purple bg-clip-text text-transparent">
                      {feedbackData.overallScore}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">Overall Score</div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
                    {Object.entries(feedbackData.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="mb-1">
                          <Progress value={value as number} className="h-1" />
                        </div>
                        <div className="text-lg font-semibold">{value}%</div>
                        <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
                  <Tabs defaultValue="improvement">
                    <TabsList className="mb-4">
                      <TabsTrigger value="improvement">Areas for Improvement</TabsTrigger>
                      <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="improvement" className="space-y-4">
                      {feedbackData.improvement.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                            <span className="text-xs font-bold">{i+1}</span>
                          </div>
                          <p>{item}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="strengths" className="space-y-4">
                      {feedbackData.strengths.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <span className="text-xs font-bold">✓</span>
                          </div>
                          <p>{item}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recorded Responses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interviewQuestions.map((question, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Question {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm">{question}</p>
                          {answers[index] && (
                            <video 
                              src={answers[index]} 
                              controls 
                              className="w-full h-32 object-cover rounded"
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button onClick={() => setStage('setup')} variant="outline">Start New Interview</Button>
              <Button onClick={downloadReport}>
                <FileText className="mr-2 h-4 w-4" />
                Download Full Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InterviewCoach;


import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Pause, Play, Camera, CameraOff, Volume2, VolumeX, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { useAITransformer } from '@/utils/aiTransformer';
import InterviewAvatar from './InterviewAvatar';

interface InterviewSimulationProps {
  interviewData: any;
  onComplete: (results: any) => void;
}

const InterviewSimulation: React.FC<InterviewSimulationProps> = ({ interviewData, onComplete }) => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState<{role: "interviewer" | "user", text: string}[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(75);
  const [postureFeedback, setPostureFeedback] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { generateText } = useAITransformer('DEMO_KEY');
  
  // Sample interview questions based on job category
  const interviewQuestions = {
    "software-development": [
      "Tell me about yourself and your background in software development.",
      "What programming languages are you most comfortable with, and why?",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "How do you stay updated with the latest technologies in software development?",
      "Describe your approach to debugging a complex issue.",
    ],
    "data-science": [
      "Can you explain your experience with data analysis and modeling?",
      "What statistical methods do you commonly use in your work?",
      "Tell me about a data science project you're particularly proud of.",
      "How do you validate the accuracy of your models?",
      "What tools and libraries do you typically use for data visualization?",
    ],
    "default": [
      "Tell me about yourself and your professional background.",
      "What are your greatest strengths and weaknesses?",
      "Why are you interested in this position?",
      "Where do you see yourself in five years?",
      "Describe a situation where you faced a challenge at work and how you handled it.",
    ]
  };
  
  // Initialize camera
  useEffect(() => {
    if (isInterviewActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing webcam:", err);
          toast({
            title: "Camera Error",
            description: "Unable to access your camera. Please check your permissions.",
            variant: "destructive",
          });
          setIsCameraOn(false);
        });
    }
  }, [isInterviewActive, toast]);
  
  // Start the interview
  const startInterview = () => {
    setIsInterviewActive(true);
    
    // Set first question
    const category = interviewData?.jobCategory || "default";
    const questions = (interviewQuestions as any)[category] || interviewQuestions.default;
    setCurrentQuestion(questions[0]);
    
    setTranscript([{
      role: "interviewer",
      text: "Welcome to your interview. Let's get started with the first question."
    }, {
      role: "interviewer",
      text: questions[0]
    }]);
    
    // Simulate the AI greeting
    const greeting = `Hello! I'm your AI interviewer for today. I'll be asking you some questions about your experience in ${interviewData?.jobTitle || "this field"}. Please make sure your microphone and camera are on so I can provide comprehensive feedback.`;
    
    // Use speech synthesis to speak the greeting
    const utterance = new SpeechSynthesisUtterance(greeting);
    window.speechSynthesis.speak(utterance);
  };
  
  // Handle user's response submission
  const submitResponse = async () => {
    setIsLoading(true);
    
    try {
      // Simulate processing user's response
      const category = interviewData?.jobCategory || "default";
      const questions = (interviewQuestions as any)[category] || interviewQuestions.default;
      
      // Generate AI feedback on the response (simulated)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add user's "response" to transcript (in a real implementation, this would be from speech-to-text)
      const simulatedUserResponse = "I have over 5 years of experience in this field and have worked on various projects that align with your company's mission...";
      
      setTranscript(prev => [
        ...prev,
        { role: "user", text: simulatedUserResponse }
      ]);
      
      // Move to the next question
      const nextIndex = questionIndex + 1;
      
      if (nextIndex < questions.length) {
        // Add interviewer's next question to transcript
        setTranscript(prev => [
          ...prev,
          { role: "interviewer", text: questions[nextIndex] }
        ]);
        
        setCurrentQuestion(questions[nextIndex]);
        setQuestionIndex(nextIndex);
        
        // Randomly update confidence score and posture feedback
        setConfidenceScore(prevScore => Math.min(100, Math.max(30, prevScore + Math.floor(Math.random() * 20) - 10)));
        
        const postureFeedbacks = [
          "Great eye contact, keep it up!",
          "Try to sit up straighter",
          "Remember to smile occasionally",
          "Avoid touching your face",
          null
        ];
        setPostureFeedback(postureFeedbacks[Math.floor(Math.random() * postureFeedbacks.length)]);
      } else {
        // Interview is complete
        setTranscript(prev => [
          ...prev,
          { role: "interviewer", text: "Thank you for your time. That concludes our interview." }
        ]);
        
        setInterviewComplete(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Complete the interview
  const completeInterview = () => {
    // Generate mock results
    const results = {
      technicalScore: Math.floor(Math.random() * 40) + 60,
      behavioralScore: Math.floor(Math.random() * 30) + 70,
      confidenceScore: confidenceScore,
      bodyLanguageScore: Math.floor(Math.random() * 25) + 70,
      overallScore: Math.floor(Math.random() * 20) + 75,
      transcript: transcript,
      interviewData: interviewData,
      feedback: [
        "Strong communication skills demonstrated throughout the interview",
        "Could improve on providing more specific examples",
        "Technical knowledge is solid but could be more detailed",
        "Great enthusiasm and cultural fit potential",
        "Good body language with room for improvement in maintaining eye contact"
      ]
    };
    
    // Stop the webcam
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    onComplete(results);
  };
  
  return (
    <div className="h-full flex flex-col">
      {!isInterviewActive ? (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div className="max-w-md space-y-6">
            <h2 className="text-2xl font-bold">Ready to Begin Your Interview?</h2>
            <p className="text-muted-foreground">
              You'll be entering a virtual interview room with our AI interviewer. Make sure your camera and microphone are ready.
            </p>
            <div className="flex justify-center">
              <Button onClick={startInterview} size="lg" className="mt-4">
                <Play className="mr-2 h-5 w-5" />
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-7 h-full min-h-[600px]">
          {/* Main Interview View (3D Room + Avatar) */}
          <div className="col-span-1 lg:col-span-4 bg-gray-900 relative h-[400px] lg:h-auto">
            {/* 3D Interview Environment */}
            <InterviewAvatar isActive={isInterviewActive} />
            
            {/* User video feed */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-black rounded-md overflow-hidden border-2 border-gray-800">
              {isCameraOn ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <CameraOff className="text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Interview controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => setIsMicMuted(!isMicMuted)}
              >
                {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => setIsCameraOn(!isCameraOn)}
              >
                {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
              >
                {isAudioMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Current question display */}
            <div className="absolute top-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-md p-4">
              <h3 className="text-white text-sm font-medium mb-1">Current Question:</h3>
              <p className="text-white/90">{currentQuestion}</p>
            </div>
          </div>
          
          {/* Feedback and Controls Panel */}
          <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-950 p-4 overflow-y-auto flex flex-col">
            {/* Mock speaking in progress UI */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Response Analysis</h3>
                <div className="text-sm text-muted-foreground">
                  Question {questionIndex + 1}/{
                    ((interviewQuestions as any)[interviewData?.jobCategory || "default"] || interviewQuestions.default).length
                  }
                </div>
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence Score</span>
                  <span className={`font-medium ${
                    confidenceScore > 80 ? "text-green-600" : 
                    confidenceScore > 60 ? "text-amber-600" : "text-red-600"
                  }`}>{confidenceScore}%</span>
                </div>
                <Progress value={confidenceScore} className="h-2" />
              </div>
              
              {postureFeedback && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-medium">Posture Feedback:</span> {postureFeedback}
                  </p>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Transcript */}
            <div className="flex-1 overflow-y-auto mb-4">
              <h3 className="font-medium mb-2">Transcript</h3>
              <div className="space-y-4">
                {transcript.map((item, i) => (
                  <div key={i} className={`flex ${item.role === "interviewer" ? "" : "justify-end"}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      item.role === "interviewer" 
                        ? "bg-gray-100 dark:bg-gray-800 text-left" 
                        : "bg-modern-blue-100 dark:bg-modern-blue-900 text-left"
                    }`}>
                      <div className="text-xs text-muted-foreground mb-1">
                        {item.role === "interviewer" ? "Interviewer" : "You"}
                      </div>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800">
                      <div className="text-xs text-muted-foreground mb-1">Interviewer</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Controls */}
            <div className="mt-auto">
              {interviewComplete ? (
                <Button 
                  onClick={completeInterview}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Complete & View Results
                </Button>
              ) : (
                <Button 
                  onClick={submitResponse}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Response"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSimulation;

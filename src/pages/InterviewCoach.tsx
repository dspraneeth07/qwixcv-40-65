
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, Bot, AlertCircle, User, Check, ArrowLeft, Clock, 
  ClipboardList, Lightbulb, Camera, BarChart, Mic, Video, MessageSquare
} from "lucide-react";

import EnhancedInterviewSetup from '@/components/interview/EnhancedInterviewSetup';
import AdvancedInterviewSimulation from '@/components/interview/AdvancedInterviewSimulation';
import InterviewReport from '@/components/interview/InterviewReport';
import { InterviewSettings, InterviewReport as IInterviewReport } from '@/types/interview';
import { stopSpeaking } from '@/utils/speechUtils';

const InterviewCoach: React.FC = () => {
  // Application state
  const [step, setStep] = useState<'setup' | 'interview' | 'report'>('setup');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<InterviewSettings | null>(null);
  const [report, setReport] = useState<IInterviewReport | null>(null);
  
  const { toast } = useToast();
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);
  
  // Start interview with selected settings
  const startInterview = (interviewSettings: InterviewSettings) => {
    setIsProcessing(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      setSettings(interviewSettings);
      setStep('interview');
      setIsProcessing(false);
      
      toast({
        title: "Interview Ready",
        description: "Your AI interview session is starting. Good luck!"
      });
    }, 800);
  };
  
  // Handle interview completion
  const handleInterviewComplete = (interviewReport: IInterviewReport) => {
    setReport(interviewReport);
    setStep('report');
    
    toast({
      title: "Interview Completed",
      description: "Your interview performance report is ready to review."
    });
  };
  
  // Reset the interview process
  const resetInterview = () => {
    setSettings(null);
    setReport(null);
    setStep('setup');
  };
  
  // Handle download report
  const handleDownloadReport = () => {
    toast({
      title: "Report Download",
      description: "Your interview report PDF is being prepared..."
    });
    
    // Simulate PDF generation and download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your interview report has been downloaded"
      });
    }, 1500);
  };
  
  // Cancel interview in progress
  const cancelInterview = () => {
    toast({
      title: "Interview Cancelled",
      description: "You have ended the interview early."
    });
    resetInterview();
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        {/* Header with navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {step !== 'setup' && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={resetInterview} 
                className="mr-3"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold">QwiXed360 AI Interview Coach</h1>
              <p className="text-muted-foreground">
                {step === 'setup' && 'Set up your personalized interview simulation'}
                {step === 'interview' && 'Answer interview questions naturally using your voice'}
                {step === 'report' && 'Review your interview performance report'}
              </p>
            </div>
          </div>
          
          {settings && step !== 'setup' && (
            <div className="flex gap-2">
              {settings.difficulty && (
                <Badge variant="outline" className="flex items-center">
                  <BarChart className="h-3.5 w-3.5 mr-1.5" />
                  {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)} Difficulty
                </Badge>
              )}
              
              {settings.useCamera && (
                <Badge variant="outline" className="flex items-center">
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Video Analysis
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 gap-6">
          {step === 'setup' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2 space-y-6">
                <EnhancedInterviewSetup 
                  onSubmit={startInterview} 
                  isLoading={isProcessing} 
                />
              </div>
              
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                      How QwiXed360 AI Coach Works
                    </CardTitle>
                    <CardDescription>
                      Experience a hyper-realistic interview simulation powered by AI
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Card className="bg-blue-50/50 border border-blue-100">
                        <CardContent className="p-4 space-y-4">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-lg">Resume-Specific Questions</h3>
                          <p className="text-sm text-muted-foreground">
                            Our AI analyzes your resume and generates tailored questions relevant to your skills and the job role you're applying for.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50/50 border border-purple-100">
                        <CardContent className="p-4 space-y-4">
                          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Mic className="h-5 w-5 text-purple-600" />
                          </div>
                          <h3 className="font-medium text-lg">Voice Interaction</h3>
                          <p className="text-sm text-muted-foreground">
                            Speak your answers naturally as you would in a real interview. Our AI listens and analyzes your responses in real-time.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-50/50 border border-green-100">
                        <CardContent className="p-4 space-y-4">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Video className="h-5 w-5 text-green-600" />
                          </div>
                          <h3 className="font-medium text-lg">Optional Video Analysis</h3>
                          <p className="text-sm text-muted-foreground">
                            Enable camera access for comprehensive feedback on your posture, expressions, and overall presentation during the interview.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50/50 border border-amber-100">
                        <CardContent className="p-4 space-y-4">
                          <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <BarChart className="h-5 w-5 text-amber-600" />
                          </div>
                          <h3 className="font-medium text-lg">Detailed Performance Report</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive a comprehensive report with performance metrics, transcript analysis, and personalized improvement suggestions.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <AlertTitle className="text-blue-700">Tips for Best Results</AlertTitle>
                      <AlertDescription className="text-blue-600">
                        Use a quiet environment, speak clearly into your microphone, and treat the simulation like a real interview for the most accurate feedback.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {step === 'interview' && settings && (
            <Card className="h-[calc(100vh-200px)] overflow-hidden">
              <AdvancedInterviewSimulation
                settings={settings}
                onComplete={handleInterviewComplete}
                onCancel={cancelInterview}
              />
            </Card>
          )}
          
          {step === 'report' && report && (
            <InterviewReport
              report={report}
              onDownload={handleDownloadReport}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default InterviewCoach;

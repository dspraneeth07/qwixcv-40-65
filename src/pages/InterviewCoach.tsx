
import React, { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  MicOff, 
  Timer, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Pause,
  FileUp, 
  Download,
  FileText,
  MessageSquare
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { InterviewFeedbackCard } from "@/components/interview/InterviewFeedbackCard";
import { InterviewResultsModal } from "@/components/interview/InterviewResultsModal";
import { useInterviewSimulator } from "@/hooks/useInterviewSimulator";
import { InterviewUpload } from "@/components/interview/InterviewUpload";
import { InterviewSettings } from "@/components/interview/InterviewSettings";
import { JobRoleSelector } from "@/components/interview/JobRoleSelector";
import { VideoSimulationGuide } from "@/components/interview/VideoSimulationGuide";

const InterviewCoach = () => {
  const { toast } = useToast();
  const {
    jobRole,
    setJobRole,
    questions,
    currentQuestionIndex,
    interviewStarted,
    interviewCompleted,
    answers,
    feedback,
    isListening,
    isLoading,
    progress,
    timeRemaining,
    setTimePerQuestion,
    timePerQuestion,
    resumeText,
    setResumeText,
    
    startInterview,
    endInterview,
    nextQuestion,
    previousQuestion,
    toggleListening,
    handleAnswerChange,
    submitAnswer,
    generateReport
  } = useInterviewSimulator();

  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null;

  return (
    <Layout>
      <div className="container max-w-5xl py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Interview Coach</h1>
            <p className="text-muted-foreground">Practice your interview skills with AI-powered feedback</p>
          </div>
          <Badge 
            variant="outline" 
            className="bg-modern-blue-500/10 text-modern-blue-500 border-modern-blue-500/30 px-3 py-1"
          >
            <Timer className="w-4 h-4 mr-1" /> Real-time Simulation
          </Badge>
        </div>
        
        {!interviewStarted && !interviewCompleted && (
          <>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Set Up Your Interview</CardTitle>
                <CardDescription>
                  Customize your interview settings and upload your resume to get tailored questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <JobRoleSelector 
                  selectedRole={jobRole} 
                  onRoleSelect={setJobRole} 
                />
                
                <InterviewSettings 
                  timePerQuestion={timePerQuestion}
                  onTimeChange={setTimePerQuestion}
                />
                
                <InterviewUpload 
                  resumeText={resumeText}
                  onResumeTextChange={setResumeText}
                />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={startInterview}
                  disabled={!jobRole || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Preparing Questions...</span>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Interview
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <VideoSimulationGuide />
          </>
        )}
        
        {interviewStarted && !interviewCompleted && currentQuestion && (
          <div className="space-y-4">
            {/* Progress and Timer */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
                <Progress value={progress} className="w-40 h-2" />
              </div>
              
              <div className="flex items-center space-x-1 bg-secondary/40 px-3 py-1 rounded-full">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className={`text-sm font-medium ${timeRemaining < 30 ? "text-red-500" : "text-muted-foreground"}`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-indigo-950/30">
                <Badge className="w-fit mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                  {currentQuestion.type}
                </Badge>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Type your answer here or use the microphone for voice input..."
                  className="min-h-32 resize-none"
                  value={answers[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value, currentQuestionIndex)}
                />
                
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleListening}
                    className={isListening ? "bg-red-100 text-red-700 border-red-200" : ""}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button onClick={() => submitAnswer(answers[currentQuestionIndex] || '')}>
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                      ) : (
                        'Finish Interview'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Feedback Card */}
            {feedback[currentQuestionIndex] && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <InterviewFeedbackCard feedback={feedback[currentQuestionIndex]} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
        
        {/* Interview Results */}
        {interviewCompleted && (
          <InterviewResultsModal
            jobRole={jobRole}
            questions={questions}
            answers={answers}
            feedback={feedback}
            onClose={() => endInterview()}
            onDownloadReport={() => generateReport()}
          />
        )}
      </div>
    </Layout>
  );
};

export default InterviewCoach;

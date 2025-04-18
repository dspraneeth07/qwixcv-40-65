
import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Bot, AlertCircle, User, Check, ArrowLeft, Clock, ClipboardList, Lightbulb, Camera, BarChart } from "lucide-react";
import InterviewSetup, { InterviewSettings } from '@/components/interview/InterviewSetup';
import SpeechController from '@/components/interview/SpeechController';
import PostureAnalyzer from '@/components/interview/PostureAnalyzer';
import VoiceAnalysisDisplay from '@/components/interview/VoiceAnalysisDisplay';
import { InterviewMessage, InterviewState, VoiceAnalysis, PostureAnalysis, InterviewFeedback } from '@/types/interview';
import { 
  speakText, stopSpeaking, initSpeechRecognition, initSpeechSynthesis, getBestInterviewVoice, analyzeSpeech
} from '@/utils/speechUtils';
import { 
  analyzeResumeAndGenerateQuestions, evaluateAnswer, generateInterviewSummary 
} from '@/utils/interviewAI';

// TODO: In a production app, this would be stored securely in environment variables
// For this demo, we'll hardcode it (assuming it was provided in the past)
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; 

const InterviewCoach: React.FC = () => {
  // State for interview setup and processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [settings, setSettings] = useState<InterviewSettings | null>(null);
  
  // State for interview progress
  const [interviewState, setInterviewState] = useState<InterviewState>({
    questions: [],
    currentQuestionIndex: 0,
    messages: [],
    isLoading: false,
    isFinished: false,
    summary: null
  });
  
  // State for speech and recognition
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // State for video and posture analysis
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [postureAnalysis, setPostureAnalysis] = useState<PostureAnalysis | null>(null);
  const [voiceAnalysis, setVoiceAnalysis] = useState<VoiceAnalysis | null>(null);
  
  // References
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bestVoice = useRef<SpeechSynthesisVoice | null>(null);
  
  const { toast } = useToast();
  
  // Initialize speech synthesis and recognition
  useEffect(() => {
    // Initialize speech synthesis
    initSpeechSynthesis();
    
    // Get the best voice (may be async in some browsers)
    const voices = window.speechSynthesis.getVoices();
    bestVoice.current = getBestInterviewVoice();
    
    // If voices aren't loaded yet, set up an event listener
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        bestVoice.current = getBestInterviewVoice();
      };
    }
    
    // Initialize speech recognition
    speechRecognition.current = initSpeechRecognition();
    
    if (speechRecognition.current) {
      speechRecognition.current.onstart = () => {
        setIsListening(true);
      };
      
      speechRecognition.current.onend = () => {
        setIsListening(false);
      };
      
      speechRecognition.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      speechRecognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Microphone Error",
          description: `Error with speech recognition: ${event.error}`,
          variant: "destructive"
        });
      };
    }
    
    // Cleanup
    return () => {
      if (speechRecognition.current) {
        speechRecognition.current.onend = null;
        speechRecognition.current.onresult = null;
        speechRecognition.current.onerror = null;
        
        if (isListening) {
          speechRecognition.current.stop();
        }
      }
      
      stopSpeaking();
    };
  }, []);
  
  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    scrollToBottom();
  }, [interviewState.messages]);
  
  // Submit the transcript when the user stops speaking
  useEffect(() => {
    if (!isListening && transcript && isInterviewStarted && !interviewState.isLoading) {
      const timeoutId = setTimeout(() => {
        if (transcript) {
          handleUserResponse(transcript);
          setTranscript('');
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isListening, transcript, isInterviewStarted]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const startInterview = async (interviewSettings: InterviewSettings) => {
    setIsProcessing(true);
    setSettings(interviewSettings);
    
    // Initialize camera if enabled
    if (interviewSettings.useCamera) {
      setIsCameraEnabled(true);
    }
    
    try {
      // Generate questions based on resume
      const questions = await analyzeResumeAndGenerateQuestions(
        interviewSettings,
        GEMINI_API_KEY
      );
      
      // Initialize interview state
      setInterviewState({
        questions,
        currentQuestionIndex: 0,
        messages: [],
        isLoading: false,
        isFinished: false,
        summary: null
      });
      
      // Start interview
      setIsInterviewStarted(true);
      
      // Add intro message based on difficulty
      setTimeout(() => {
        let introMessage = `Hello! I'm your interview coach for the ${interviewSettings.jobTitle} position. I'll ask you some questions based on your resume, and provide feedback on your answers. Let's get started with the first question.`;
        
        // Adjust intro based on difficulty
        if (interviewSettings.difficulty === 'hard') {
          introMessage = `Welcome to your interview for the ${interviewSettings.jobTitle} position. Today's session will be challenging but constructive. I expect concise, well-structured responses that demonstrate your expertise. Let's begin.`;
        } else if (interviewSettings.difficulty === 'easy') {
          introMessage = `Hi there! Thanks for joining this practice interview for the ${interviewSettings.jobTitle} role. This will be a friendly conversation to help you prepare. Feel free to take your time with answers, and I'll provide helpful feedback throughout. Let's start with an easy question.`;
        }
        
        const message: InterviewMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: introMessage,
          timestamp: new Date()
        };
        
        addMessage(message);
        
        // Ask first question after a short delay
        setTimeout(() => {
          askQuestion(0);
        }, 1000);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Interview Setup Failed",
        description: "There was an error setting up your interview. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  
  const askQuestion = (index: number) => {
    if (index >= interviewState.questions.length) {
      finishInterview();
      return;
    }
    
    const question = interviewState.questions[index];
    
    const message: InterviewMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: question,
      timestamp: new Date()
    };
    
    addMessage(message);
    
    // Speak the question if speech is enabled
    if (isSpeechEnabled) {
      speakText(
        question,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        bestVoice.current
      );
    }
    
    // Automatically start listening after asking the question
    setTimeout(() => {
      startListening();
    }, 1000);
  };
  
  const handleUserResponse = async (response: string) => {
    if (interviewState.isLoading || interviewState.isFinished) return;
    
    // Add user message
    const userMessage: InterviewMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: response,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setInterviewState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Show thinking indicator
      const thinkingMessage: InterviewMessage = {
        id: `thinking-${Date.now()}`,
        role: 'assistant',
        content: 'Analyzing your response...',
        timestamp: new Date(),
        isThinking: true
      };
      
      addMessage(thinkingMessage);
      
      // Analyze the speech for tone, pace, and filler words
      const speechAnalysis = analyzeSpeech(response);
      setVoiceAnalysis(speechAnalysis);
      
      // Get the current question
      const currentQuestion = interviewState.questions[interviewState.currentQuestionIndex];
      
      // Additional difficulty parameters for the evaluation
      const difficultyParams = settings?.difficulty 
        ? `Be ${settings.difficulty === 'hard' ? 'strict and critical' : 
             settings.difficulty === 'easy' ? 'supportive and encouraging' : 
             'balanced'} in your feedback.` 
        : '';
      
      // Additional type parameters for the evaluation
      const typeParams = settings?.interviewType
        ? `Focus on ${settings.interviewType === 'technical' ? 'technical accuracy and depth' :
             settings.interviewType === 'behavioral' ? 'communication skills and experience' :
             'both technical knowledge and communication skills'}.`
        : '';
      
      // Evaluate the answer
      const feedback = await evaluateAnswer(
        currentQuestion,
        response,
        settings?.jobTitle || '',
        settings?.jobLevel || '',
        GEMINI_API_KEY
      );
      
      // Remove thinking message
      removeMessage(thinkingMessage.id);
      
      // Enhance feedback with voice analysis insights
      let enhancedFeedback = feedback;
      
      if (speechAnalysis.suggestions.length > 0) {
        enhancedFeedback += `\n\n**Communication Note:** ${speechAnalysis.suggestions[0]}`;
      }
      
      if (postureAnalysis?.suggestions.length) {
        enhancedFeedback += `\n\n**Presentation Note:** ${postureAnalysis.suggestions[0]}`;
      }
      
      // Add feedback message
      const feedbackMessage: InterviewMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: enhancedFeedback,
        timestamp: new Date()
      };
      
      addMessage(feedbackMessage);
      
      // Speak the feedback if speech is enabled
      if (isSpeechEnabled) {
        speakText(
          enhancedFeedback.replace(/\*\*/g, ''), // Remove markdown formatting
          () => setIsSpeaking(true),
          () => {
            setIsSpeaking(false);
            // Move to next question after a short delay
            setTimeout(() => {
              moveToNextQuestion();
            }, 2000);
          },
          bestVoice.current
        );
      } else {
        // Move to next question after a short delay
        setTimeout(() => {
          moveToNextQuestion();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error processing response:', error);
      toast({
        title: "Processing Error",
        description: "There was an error analyzing your response. Let's continue to the next question.",
        variant: "destructive"
      });
      
      // Remove thinking message
      removeMessage(`thinking-${Date.now()}`);
      moveToNextQuestion();
    } finally {
      setInterviewState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const moveToNextQuestion = () => {
    const nextIndex = interviewState.currentQuestionIndex + 1;
    
    setInterviewState(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex
    }));
    
    // Check if we've reached the end of the questions
    if (nextIndex >= interviewState.questions.length) {
      finishInterview();
    } else {
      // Ask the next question
      askQuestion(nextIndex);
    }
  };
  
  const finishInterview = async () => {
    setInterviewState(prev => ({
      ...prev,
      isLoading: true,
      isFinished: true
    }));
    
    // Add finishing message
    const finishingMessage: InterviewMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "That concludes our interview. I'll now prepare a comprehensive summary of your performance.",
      timestamp: new Date()
    };
    
    addMessage(finishingMessage);
    
    // Speak the finishing message if speech is enabled
    if (isSpeechEnabled) {
      speakText(
        finishingMessage.content,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        bestVoice.current
      );
    }
    
    try {
      // Generate interview summary with additional parameters
      const difficultyParams = settings?.difficulty 
        ? `This was a ${settings.difficulty} level interview.` 
        : '';
      
      const typeParams = settings?.interviewType
        ? `This was a ${settings.interviewType} interview.`
        : '';
      
      const voiceParams = voiceAnalysis 
        ? `Voice analysis: Pace score: ${voiceAnalysis.paceScore}%, Tone score: ${voiceAnalysis.toneScore}%, Filler words: ${voiceAnalysis.fillerWordCount}.` 
        : '';
      
      const postureParams = postureAnalysis
        ? `Posture analysis: Posture: ${postureAnalysis.posture}, Eye contact: ${postureAnalysis.eyeContact}, Gestures: ${postureAnalysis.gestures}, Dress code: ${postureAnalysis.dressCode}.`
        : '';
      
      // Generate summary with enhanced parameters
      const summary = await generateInterviewSummary(
        interviewState.messages,
        settings?.jobTitle || '',
        settings?.jobLevel || '',
        GEMINI_API_KEY
      );
      
      // Update state with summary
      setInterviewState(prev => ({
        ...prev,
        isLoading: false,
        summary
      }));
      
      // Add summary message
      const summaryMessage: InterviewMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: summary,
        timestamp: new Date()
      };
      
      addMessage(summaryMessage);
      
      // Speak the summary if speech is enabled
      if (isSpeechEnabled) {
        speakText(
          "Here's a summary of your interview performance. " + summary.replace(/#|##/g, ''),
          () => setIsSpeaking(true),
          () => setIsSpeaking(false),
          bestVoice.current
        );
      }
      
    } catch (error) {
      console.error('Error generating summary:', error);
      setInterviewState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Summary Generation Error",
        description: "There was an error generating your interview summary.",
        variant: "destructive"
      });
    }
  };
  
  const addMessage = (message: InterviewMessage) => {
    setInterviewState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };
  
  const removeMessage = (messageId: string) => {
    setInterviewState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId)
    }));
  };
  
  const resetInterview = () => {
    // Stop any active speech or recognition
    stopSpeaking();
    
    if (speechRecognition.current && isListening) {
      speechRecognition.current.stop();
    }
    
    // Reset state
    setIsInterviewStarted(false);
    setIsProcessing(false);
    setSettings(null);
    setInterviewState({
      questions: [],
      currentQuestionIndex: 0,
      messages: [],
      isLoading: false,
      isFinished: false,
      summary: null
    });
    setTranscript('');
    setVoiceAnalysis(null);
    setPostureAnalysis(null);
    setIsCameraEnabled(false);
  };
  
  const startListening = () => {
    if (!speechRecognition.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use a different browser.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      speechRecognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Microphone Error",
        description: "There was an error accessing your microphone. Please make sure it's connected and you've granted permission.",
        variant: "destructive"
      });
    }
  };
  
  const stopListening = () => {
    if (speechRecognition.current && isListening) {
      speechRecognition.current.stop();
    }
  };
  
  const toggleSpeech = () => {
    setIsSpeechEnabled(prev => !prev);
    
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  };
  
  const toggleCamera = () => {
    setIsCameraEnabled(prev => !prev);
  };
  
  const handlePostureUpdate = (analysis: PostureAnalysis) => {
    setPostureAnalysis(analysis);
  };
  
  // Render message bubble
  const renderMessage = (message: InterviewMessage) => {
    const isAssistant = message.role === 'assistant';
    
    // Render thinking indicator
    if (message.isThinking) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm italic mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{message.content}</span>
        </div>
      );
    }
    
    return (
      <div 
        className={`flex gap-3 mb-4 ${isAssistant ? '' : 'flex-row-reverse'}`}
        key={message.id}
      >
        <Avatar className={isAssistant ? 'bg-blue-100' : 'bg-green-100'}>
          {isAssistant ? (
            <Bot className="h-5 w-5 text-blue-700" />
          ) : (
            <User className="h-5 w-5 text-green-700" />
          )}
          <AvatarFallback>{isAssistant ? 'AI' : 'You'}</AvatarFallback>
        </Avatar>
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div 
            className={`px-4 py-3 rounded-lg ${
              isAssistant 
                ? 'bg-blue-50 text-gray-800 border border-blue-100' 
                : 'bg-green-50 text-gray-800 border border-green-100'
            } max-w-[85%]`}
          >
            <div className="prose prose-sm whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center">
          {isInterviewStarted && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={resetInterview} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">AI Interview Coach</h1>
          
          {isInterviewStarted && (
            <div className="ml-auto flex items-center">
              <Badge variant="outline" className="ml-2">
                <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
                {interviewState.currentQuestionIndex + 1} of {interviewState.questions.length} Questions
              </Badge>
              
              {settings && (
                <Badge variant="outline" className="ml-2">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {settings.duration} min Interview
                </Badge>
              )}
              
              {settings?.useCamera && (
                <Badge variant="outline" className="ml-2">
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Camera Analysis
                </Badge>
              )}
              
              {settings?.interviewType && (
                <Badge variant="outline" className="ml-2">
                  <BarChart className="h-3.5 w-3.5 mr-1.5" />
                  {settings.interviewType.charAt(0).toUpperCase() + settings.interviewType.slice(1)}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {!isInterviewStarted ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <InterviewSetup 
                onStartInterview={startInterview} 
                isProcessing={isProcessing} 
              />
            </div>
            
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                    How It Works
                  </CardTitle>
                  <CardDescription>
                    Our AI interview coach will simulate a real job interview based on your resume
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium">Upload Your Resume</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload your resume and specify the job you're applying for
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium">Answer Questions</h3>
                        <p className="text-sm text-muted-foreground">
                          The AI will ask you interview questions tailored to your resume and the job position
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium">Get Comprehensive Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive personalized feedback on your answers, voice, posture, and appearance
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium">Review Your Performance</h3>
                        <p className="text-sm text-muted-foreground">
                          At the end, get a comprehensive assessment of your interview performance
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Advanced Analysis</AlertTitle>
                    <AlertDescription>
                      Enable camera access for posture and appearance analysis. Your voice will be analyzed 
                      for tone, confidence, and filler words to help you improve your presentation.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              {/* Real-time feedback will be integrated directly in components */}
              <Card className="h-[calc(100vh-200px)] flex flex-col">
                <CardHeader className="border-b p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {settings?.jobTitle} Interview
                      </CardTitle>
                      <CardDescription>
                        {settings?.jobLevel} level position • Resume: {settings?.resumeFileName}
                      </CardDescription>
                    </div>
                    
                    {interviewState.isFinished && (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Interview Complete
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <div className="flex-1 overflow-hidden relative">
                  <ScrollArea className="absolute inset-0 p-4">
                    {interviewState.messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
                          <p className="text-muted-foreground">Preparing your interview...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {interviewState.messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                        
                        {/* Transcript display while listening */}
                        {isListening && transcript && (
                          <div className="flex justify-end items-center mt-2">
                            <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm italic max-w-[85%]">
                              {transcript}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                <Separator />
                
                <SpeechController
                  isInterviewStarted={isInterviewStarted}
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  onStartListening={startListening}
                  onStopListening={stopListening}
                  onToggleSpeech={toggleSpeech}
                  isSpeechEnabled={isSpeechEnabled}
                  isCameraEnabled={isCameraEnabled}
                  onToggleCamera={settings?.useCamera ? toggleCamera : undefined}
                  interviewType={settings?.interviewType}
                  difficulty={settings?.difficulty}
                />
              </Card>
            </div>
            
            <div className="md:block">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-lg">Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-4 pb-4 space-y-4">
                    {/* Voice Analysis */}
                    <VoiceAnalysisDisplay analysis={voiceAnalysis} />
                    
                    {/* Posture Analysis */}
                    {settings?.useCamera && (
                      <PostureAnalyzer 
                        enabled={isCameraEnabled} 
                        onAnalysisUpdate={handlePostureUpdate} 
                      />
                    )}
                    
                    {/* Interview Tips */}
                    <Card className="mt-3">
                      <CardContent className="p-3">
                        <h3 className="text-sm font-medium mb-2">Interview Tips</h3>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-start">
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" />
                            Use the STAR method (Situation, Task, Action, Result) for behavioral questions
                          </li>
                          <li className="flex items-start">
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" />
                            Be concise and specific in your answers
                          </li>
                          <li className="flex items-start">
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" />
                            Maintain good posture and eye contact with the interviewer
                          </li>
                          <li className="flex items-start">
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" />
                            Avoid filler words like "um," "uh," and "like"
                          </li>
                          <li className="flex items-start">
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" />
                            Dress professionally for the interview
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default InterviewCoach;

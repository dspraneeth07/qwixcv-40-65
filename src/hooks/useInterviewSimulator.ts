
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { InterviewQuestion, InterviewFeedback } from "@/types/interview";
import { generateInterviewQuestions, generateFeedback, generatePDF } from "@/utils/interviewAPI";

export const useInterviewSimulator = () => {
  const { toast } = useToast();
  
  // State
  const [jobRole, setJobRole] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<(InterviewFeedback | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState(120); // 2 minutes default
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Calculate progress
  const progress = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;
  
  // Start interview
  const startInterview = async () => {
    if (!jobRole) {
      toast({
        title: "Job Role Required",
        description: "Please select a job role for your interview.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const generatedQuestions = await generateInterviewQuestions(jobRole, resumeText);
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("Failed to generate interview questions");
      }
      
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(""));
      setFeedback(new Array(generatedQuestions.length).fill(null));
      setCurrentQuestionIndex(0);
      setInterviewStarted(true);
      setTimeRemaining(timePerQuestion);
      
      // Start timer
      startTimer();
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        title: "Error",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // End interview
  const endInterview = () => {
    stopTimer();
    stopListening();
    setInterviewStarted(false);
    setInterviewCompleted(false);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setAnswers([]);
    setFeedback([]);
    setJobRole("");
    setResumeText("");
  };
  
  // Timer functions
  const startTimer = () => {
    stopTimer();
    
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(time => {
        if (time <= 1) {
          // Time's up, auto-submit
          submitAnswer(answers[currentQuestionIndex] || "");
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const resetTimer = () => {
    setTimeRemaining(timePerQuestion);
    startTimer();
  };
  
  // Navigation
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetTimer();
    } else {
      // Complete the interview
      setInterviewCompleted(true);
      setInterviewStarted(false);
      stopTimer();
    }
  };
  
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetTimer();
    }
  };
  
  // Answer handling
  const handleAnswerChange = (value: string, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  
  // Submit and get feedback
  const submitAnswer = async (answer: string) => {
    // Stop timer
    stopTimer();
    
    // Stop speech recognition if active
    if (isListening) {
      stopListening();
    }
    
    if (!answer.trim()) {
      toast({
        title: "Empty answer",
        description: "Please provide an answer before proceeding.",
        variant: "destructive"
      });
      startTimer(); // Restart the timer
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store the answer
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
      
      // Get AI feedback
      const currentQuestion = questions[currentQuestionIndex];
      const newFeedback = await generateFeedback(
        jobRole,
        currentQuestion,
        answer
      );
      
      // Store feedback
      const newFeedbackArray = [...feedback];
      newFeedbackArray[currentQuestionIndex] = newFeedback;
      setFeedback(newFeedbackArray);
      
      // Allow time to see feedback before moving to the next question
      setTimeout(() => {
        setIsLoading(false);
        
        if (currentQuestionIndex < questions.length - 1) {
          nextQuestion();
        } else {
          // Complete the interview
          setInterviewCompleted(true);
          setInterviewStarted(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive"
      });
      startTimer(); // Restart the timer
    }
  };
  
  // Voice recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    // Check if Speech Recognition API is supported
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      // Get transcript
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      
      // Update answer
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = transcript;
      setAnswers(newAnswers);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      stopListening();
      toast({
        title: "Voice recognition error",
        description: event.error,
        variant: "destructive"
      });
    };
    
    // Start listening
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };
  
  // Generate PDF report
  const generateReport = async () => {
    try {
      await generatePDF(jobRole, questions, answers, feedback);
      
      toast({
        title: "Report generated",
        description: "Your interview report has been downloaded."
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopListening();
    };
  }, []);
  
  return {
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
    timePerQuestion,
    setTimePerQuestion,
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
  };
};

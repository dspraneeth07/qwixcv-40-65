
// Types for the Interview Coach feature

export type InterviewRole = 'assistant' | 'user';

export interface InterviewMessage {
  id: string;
  role: InterviewRole;
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  feedback?: string;
}

export interface InterviewState {
  questions: string[];
  currentQuestionIndex: number;
  messages: InterviewMessage[];
  isLoading: boolean;
  isFinished: boolean;
  summary: string | null;
}

export interface VoiceAnalysis {
  paceScore: number;
  toneScore: number;
  fillerWordCount: number;
  fillerWords: string[];
  suggestions: string[];
}

export interface PostureAnalysis {
  posture: 'good' | 'poor' | 'neutral';
  eyeContact: 'good' | 'poor' | 'neutral';
  gestures: 'appropriate' | 'excessive' | 'limited';
  dressCode: 'formal' | 'business-casual' | 'casual' | 'inappropriate';
  suggestions: string[];
}

export interface InterviewFeedback {
  technical: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  communication: {
    score: number;
    voice: VoiceAnalysis;
    clarity: number;
    structure: number;
    suggestions: string[];
  };
  presentation: {
    score: number;
    posture?: PostureAnalysis;
    confidence: number;
    professionalism: number;
    suggestions: string[];
  };
  overall: {
    score: number;
    strengths: string[];
    improvementAreas: string[];
    nextSteps: string[];
  };
}

export interface InterviewSettings {
  jobTitle: string;
  jobLevel: string;
  resumeText: string;
  resumeFileName: string;
  duration: number;
  useCamera?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  interviewType?: 'technical' | 'behavioral' | 'mixed';
}


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
  targetCompany?: string;
  useCamera?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  interviewType?: 'technical' | 'behavioral' | 'mixed';
  preferredLanguage?: string;
  enableRealTimeFeedback?: boolean;
  yearsOfExperience?: '0-1' | '1-3' | '3-5' | '5+';
}

// For the Resume Parser API response
export interface ResumeParserResponse {
  skills: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
    date: string;
  }[];
  workExperience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  certifications: string[];
  name: string;
  email: string;
  phone?: string;
}

export interface InterviewReport {
  id: string;
  date: Date;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  targetCompany: string;
  yearsOfExperience: string;
  overallScore: number;
  questions: {
    question: string;
    answer: string;
    feedback: string;
    confidenceScore: number;
    contentScore: number;
    keyPointsCovered: string[];
  }[];
  skillsAnalysis: {
    matched: string[];
    missing: string[];
  };
  performanceMetrics: {
    communication: number;
    technicalKnowledge: number;
    problemSolving: number;
    cultureFit: number;
    confidence: number;
  };
  suggestedImprovements: string[];
  interviewTranscript: string;
}


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

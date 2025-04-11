
// Types for the certification module

export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface TestInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimit: number;
  questionCount: number;
  passingScore: number;
  topics: string[];
}

export interface Certificate {
  id: string;
  testId: string;
  title: string;
  recipientName: string;
  recipientId: string;
  score: number;
  issuedDate: string;
  txHash: string; // Blockchain transaction hash
  certHash: string; // Certificate hash for verification
  isPublic: boolean;
}

export interface SkillGap {
  skill: string;
  suggestion: string;
  resourceUrl?: string;
}

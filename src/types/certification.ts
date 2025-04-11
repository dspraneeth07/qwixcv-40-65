
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
  recipientEmail: string; // Added email field
  recipientId: string;
  score: number;
  issuedDate: string;
  txHash: string; // Blockchain transaction hash
  certHash: string; // Certificate hash for verification
  isPublic: boolean;
  issuer: string; // Added issuer field
  uniqueId: string; // Added unique ID field
  validUntil?: string; // Optional expiration date
  blockchainNetwork: string; // Added blockchain network field
}

export interface SkillGap {
  skill: string;
  suggestion: string;
  resourceUrl?: string;
}

// New blockchain transaction type
export interface BlockchainTransaction {
  hash: string;
  timestamp: number;
  blockNumber: number;
  confirmations: number;
  network: string;
  status: 'confirmed' | 'pending';
}

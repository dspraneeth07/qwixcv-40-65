
export type VerificationMethod = 'certHash' | 'txHash' | 'blockId' | 'uniqueId' | 'file';

export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface TestInfo {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questionCount: number;
  topics: string[];
  passingScore: number;
}

export interface Certificate {
  id: string;
  uniqueId: string;
  certHash: string;
  title: string;
  score: number;
  recipientName: string;
  recipientEmail: string;
  issuedDate: string;
  validUntil?: string;
  issuer: string;
  txHash: string;
  blockId: string;
  blockchainNetwork: string;
  isPublic: boolean;
  contractAddress?: string;
  smartContractStandard?: string;
}

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  confirmations: number;
  timestamp: number;
  from: string;
  to: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface SkillGap {
  skill: string;
  suggestion: string;
  resourceUrl?: string;
}

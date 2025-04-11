
export interface Certificate {
  id: string;
  testId: string;
  title: string;
  score: number;
  recipientName: string;
  recipientEmail: string;
  issuer: string;
  issuedDate: string;
  validUntil?: string;
  txHash: string;
  blockId: number;
  certHash: string;
  uniqueId: string;
  contractAddress?: string;
  blockchainNetwork: string;
  smartContractStandard?: string;
  isPublic: boolean;
}

export interface BlockchainTransaction {
  hash: string;
  blockId: number;
  timestamp: number;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface TestInfo {
  id: string;
  title: string;
  description: string;
  topics: string[];
  timeLimit: number;
  questionCount: number;
  passingScore: number;
  category?: string; // Adding the category property as optional
}

export type VerificationMethod = 'certHash' | 'txHash' | 'blockId' | 'uniqueId' | 'file';

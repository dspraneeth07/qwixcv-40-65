
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
  recipientEmail: string;
  recipientId: string;
  score: number;
  issuedDate: string;
  txHash: string; // Blockchain transaction hash
  certHash: string; // Certificate hash for verification
  isPublic: boolean;
  issuer: string;
  uniqueId: string;
  validUntil?: string; // Optional expiration date
  blockchainNetwork: string;
  blockId?: string; // Block ID where certificate was stored
  contractAddress?: string; // Smart contract address
  smartContractStandard?: string; // ERC-721 or other standard
  metadataUri?: string; // IPFS or metadata URI
}

export interface SkillGap {
  skill: string;
  suggestion: string;
  resourceUrl?: string;
}

// Blockchain transaction type
export interface BlockchainTransaction {
  hash: string;
  timestamp: number;
  blockNumber: number;
  confirmations: number;
  network: string;
  status: 'confirmed' | 'pending';
  blockId?: string; // Block identifier
  gasUsed?: number; // Gas used for transaction
  gasPrice?: string; // Gas price in Gwei
  from?: string; // Sender address
  to?: string; // Receiver address (contract)
  contractCallMethod?: string; // Method called on contract
}

// New type for certificate verification methods
export type VerificationMethod = 'certHash' | 'txHash' | 'blockId' | 'uniqueId' | 'qrCode' | 'file';


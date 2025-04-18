
export interface BlockchainDocument {
  id: string;
  fileName: string;
  description?: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
  blockchainHash: string;
  blockId: number;
  blockchainStatus: 'pending' | 'verified' | 'revoked';
  ownerAddress: string;
  ipfsUri?: string; // IPFS URI for metadata
  ipfsContentUri?: string; // IPFS URI for actual content
  tokenId?: number; // NFT token ID if minted
  txHash?: string; // Transaction hash if minted
}

export interface DocumentTransactionInfo {
  hash: string;
  blockId: number;
  timestamp: number;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface VerificationResult {
  isValid: boolean;
  document?: BlockchainDocument;
  transaction?: DocumentTransactionInfo;
  error?: string;
}

// Add interface for document upload parameters
export interface DocumentUploadParams {
  file: File;
  fileName: string;
  description?: string;
  ownerAddress: string;
}

// Update Certificate interface to include IPFS-related fields
export interface Certificate {
  id: string;
  testId: string;
  title: string;
  score: number;
  recipientName: string;
  recipientEmail: string;
  issuer: string;
  issuedDate: string;
  txHash: string;
  blockId: number;
  certHash: string;
  uniqueId: string;
  contractAddress: string;
  blockchainNetwork: string;
  smartContractStandard: string;
  isPublic: boolean;
  ipfsUri?: string;
  ipfsCid?: string;
}

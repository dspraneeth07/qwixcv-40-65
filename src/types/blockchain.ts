
export interface BlockchainDocument {
  uniqueId: string;
  fileName: string;
  description: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
  ownerAddress: string;
  blockchainHash: string;
  ipfsUri: string;
  tokenId?: number;
  verificationUrl?: string;
}

export interface DocumentUploadParams {
  file: File;
  fileName: string;
  description: string;
  ownerAddress: string;
}

export interface DocumentVerification {
  isValid: boolean;
  document?: BlockchainDocument;
  error?: string;
}

export interface QwixVaultUser {
  email: string;
  walletAddress: string;
  vaultId: string;
  createdAt: string;
  documents: BlockchainDocument[];
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  testId: string;
  title: string;
  score: number;
  issuedDate: string;
  isPublic: boolean;
  certHash: string;
  txHash: string;
  blockId: number;
  issuerName: string;
  holderName: string;
  holderEmail: string;
  vaultId: string;
}

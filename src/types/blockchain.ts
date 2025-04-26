
export interface BlockchainDocument {
  uniqueId: string;
  fileName: string;
  description?: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
  blockchainHash: string;
  ownerAddress: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  ipfsUri?: string;
  tokenId?: number;
  verificationUrl?: string;
}

export interface DocumentVerification {
  isValid: boolean;
  document: BlockchainDocument | null;
  error?: string;
}

export interface DocumentUploadParams {
  file: File;
  fileName: string;
  description: string;
  ownerAddress: string;
}

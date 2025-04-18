
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

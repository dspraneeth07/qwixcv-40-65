
export interface BlockchainDocument {
  uniqueId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description: string;
  ipfsUri: string;
  blockchainHash: string;
  ownerAddress: string;
  timestamp: string;
  verificationUrl: string;
  isVerified: boolean;
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
  recipientName: string;
  recipientEmail: string;
  uniqueId: string;
  blockchainNetwork: string;
  issuer: string;
  contractAddress: string;
  smartContractStandard: string;
}

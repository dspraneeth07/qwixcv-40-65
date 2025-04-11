
import { Certificate, BlockchainTransaction } from '@/types/certification';
import { v4 as uuidv4 } from 'uuid';

// Mock blockchain networks
export const BLOCKCHAIN_NETWORKS = {
  ETHEREUM: 'Ethereum Mainnet',
  POLYGON: 'Polygon PoS Chain',
  ARBITRUM: 'Arbitrum One',
  OPTIMISM: 'Optimism',
  BSC: 'Binance Smart Chain'
};

/**
 * Generate a unique blockchain-style hash
 */
const generateHash = (length = 64) => {
  return `0x${Array(length).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

/**
 * Generate a unique certificate ID with a specific format
 */
const generateCertificateId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `QWIXCERT-${timestamp}-${random}`;
};

/**
 * Mock function to generate blockchain certificates
 * In a real implementation, this would interact with a blockchain smart contract
 */
export const generateCertificate = async (
  testId: string, 
  testTitle: string, 
  score: number,
  recipientName: string,
  recipientEmail: string
): Promise<Certificate> => {
  // Simulate blockchain interaction
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock blockchain transaction hash
  const txHash = generateHash();
  
  // Generate certificate hash for verification
  const certHash = `cert_${generateHash(32)}`;
  
  // Create certificate object
  const certificate: Certificate = {
    id: uuidv4(),
    testId,
    title: testTitle,
    recipientName: recipientName || "John Doe",
    recipientEmail: recipientEmail || "john.doe@example.com",
    recipientId: "user_" + Math.floor(Math.random() * 10000),
    score,
    issuedDate: new Date().toISOString(),
    txHash,
    certHash,
    isPublic: true,
    issuer: "QwikZen Certification Authority",
    uniqueId: generateCertificateId(),
    blockchainNetwork: BLOCKCHAIN_NETWORKS.POLYGON
  };
  
  // In a real app, you would store this in your database
  const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  certificates.push(certificate);
  localStorage.setItem('certificates', JSON.stringify(certificates));
  
  // Store transaction details
  const transaction: BlockchainTransaction = {
    hash: txHash,
    timestamp: Date.now(),
    blockNumber: Math.floor(Math.random() * 10000000) + 15000000,
    confirmations: Math.floor(Math.random() * 50) + 1,
    network: BLOCKCHAIN_NETWORKS.POLYGON,
    status: 'confirmed'
  };
  
  // Store transaction
  const transactions = JSON.parse(localStorage.getItem('blockchain_transactions') || '[]');
  transactions.push(transaction);
  localStorage.setItem('blockchain_transactions', JSON.stringify(transactions));
  
  return certificate;
};

/**
 * Mock function to verify a certificate
 * In a real implementation, this would query a blockchain smart contract
 */
export const verifyCertificate = async (
  certHash: string
): Promise<{
  isValid: boolean;
  certificate?: Certificate;
  transaction?: BlockchainTransaction;
  error?: string;
}> => {
  // Simulate blockchain interaction
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // In a real app, this would query the blockchain
    const certificates: Certificate[] = JSON.parse(localStorage.getItem('certificates') || '[]');
    const certificate = certificates.find(cert => cert.certHash === certHash);
    
    if (!certificate) {
      return {
        isValid: false,
        error: "Certificate not found"
      };
    }
    
    // Get transaction details
    const transactions: BlockchainTransaction[] = JSON.parse(localStorage.getItem('blockchain_transactions') || '[]');
    const transaction = transactions.find(tx => tx.hash === certificate.txHash);
    
    return {
      isValid: true,
      certificate,
      transaction
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Failed to verify certificate"
    };
  }
};

/**
 * Mock function to get user certificates
 * In a real implementation, this would query your database or blockchain
 */
export const getUserCertificates = (): Certificate[] => {
  return JSON.parse(localStorage.getItem('certificates') || '[]');
};

/**
 * Mock function to update certificate visibility
 */
export const updateCertificateVisibility = (certificateId: string, isPublic: boolean): void => {
  const certificates: Certificate[] = JSON.parse(localStorage.getItem('certificates') || '[]');
  const updatedCertificates = certificates.map(cert => 
    cert.id === certificateId ? { ...cert, isPublic } : cert
  );
  
  localStorage.setItem('certificates', JSON.stringify(updatedCertificates));
};

/**
 * Mock function to get detailed blockchain transaction info
 */
export const getTransactionDetails = (txHash: string): BlockchainTransaction | null => {
  const transactions: BlockchainTransaction[] = JSON.parse(localStorage.getItem('blockchain_transactions') || '[]');
  return transactions.find(tx => tx.hash === txHash) || null;
};

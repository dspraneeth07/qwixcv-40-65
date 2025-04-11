
import { Certificate } from '@/types/certification';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock function to generate blockchain certificates
 * In a real implementation, this would interact with a blockchain smart contract
 */
export const generateCertificate = async (
  testId: string, 
  testTitle: string, 
  score: number
): Promise<Certificate> => {
  // Simulate blockchain interaction
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock blockchain transaction hash
  const txHash = `0x${Array(64).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  // Generate certificate hash for verification
  const certHash = `cert_${Array(32).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  // Create certificate object
  const certificate: Certificate = {
    id: uuidv4(),
    testId,
    title: testTitle,
    recipientName: "John Doe", // In a real app, this would be the user's name
    recipientId: "user_123", // In a real app, this would be the user's ID
    score,
    issuedDate: new Date().toISOString(),
    txHash,
    certHash,
    isPublic: true
  };
  
  // In a real app, you would store this in your database
  const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  certificates.push(certificate);
  localStorage.setItem('certificates', JSON.stringify(certificates));
  
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
    
    return {
      isValid: true,
      certificate
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

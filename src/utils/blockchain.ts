
import html2pdf from 'html2pdf.js';
import { Certificate, BlockchainTransaction, VerificationMethod } from "@/types/certification";
import { ethers } from 'ethers';

// Mock certificates storage - this would be replaced with actual blockchain calls
const CERTIFICATES_STORAGE_KEY = 'qwik_cv_certificates';

// Get Ethereum provider
export const getProvider = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return { provider, signer: await provider.getSigner() };
  }
  
  // Fallback to a public provider if MetaMask is not available
  return { 
    provider: new ethers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
    signer: null
  };
};

// Generate a unique certificate hash
export const generateCertificateHash = (): string => {
  return `cert_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
};

// Get user certificates from localStorage
export const getUserCertificates = (): Certificate[] => {
  const storedCerts = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
  return storedCerts ? JSON.parse(storedCerts) : [];
};

// Save certificates to localStorage
const saveCertificates = (certificates: Certificate[]): void => {
  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(certificates));
};

// Generate a certificate
export const generateCertificate = async (
  testId: string, 
  testTitle: string, 
  score: number, 
  recipientName: string,
  recipientEmail: string
): Promise<Certificate> => {
  const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const blockId = Math.floor(Math.random() * 10000000);
  const certHash = generateCertificateHash();
  const uniqueId = `QX-${Date.now().toString().substring(4)}-${Math.floor(Math.random() * 1000)}`;
  
  const certificate: Certificate = {
    id: `${testId}-${Date.now()}`,
    testId,
    title: testTitle,
    score,
    recipientName,
    recipientEmail,
    issuer: "QwiXCertChain by QwikZen Group",
    issuedDate: new Date().toISOString(),
    txHash,
    blockId,
    certHash,
    uniqueId,
    contractAddress: "0x8a3B4Dd2386323952E393FdE0Bae2F797Eb8d17c",
    blockchainNetwork: "Polygon Mumbai",
    smartContractStandard: "ERC-721",
    isPublic: true
  };
  
  // Save to localStorage
  const certificates = getUserCertificates();
  certificates.push(certificate);
  saveCertificates(certificates);
  
  // Simulate blockchain delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return certificate;
};

// Update certificate visibility
export const updateCertificateVisibility = (certificateId: string, isPublic: boolean): boolean => {
  const certificates = getUserCertificates();
  const index = certificates.findIndex(cert => cert.id === certificateId);
  
  if (index === -1) return false;
  
  certificates[index].isPublic = isPublic;
  saveCertificates(certificates);
  
  return true;
};

// Find a certificate by various identifiers
export const findCertificate = (identifier: string, method: VerificationMethod = 'certHash'): Certificate | null => {
  const certificates = getUserCertificates();
  
  switch (method) {
    case 'certHash':
      return certificates.find(cert => cert.certHash === identifier) || null;
    case 'txHash':
      return certificates.find(cert => cert.txHash === identifier) || null;
    case 'uniqueId':
      return certificates.find(cert => cert.uniqueId === identifier) || null;
    case 'blockId':
      return certificates.find(cert => cert.blockId.toString() === identifier) || null;
    default:
      return null;
  }
};

// Verify a certificate
export const verifyCertificate = async (
  identifier: string, 
  method: VerificationMethod = 'certHash'
): Promise<{
  isValid: boolean;
  certificate?: Certificate;
  transaction?: BlockchainTransaction;
  error?: string;
}> => {
  // Add console logging for debugging
  console.log("Verifying certificate with:", { identifier, method });
  
  // Get all certificates for debugging
  const allCertificates = getUserCertificates();
  console.log("All available certificates:", allCertificates);
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const certificate = findCertificate(identifier, method);
    console.log("Found certificate:", certificate);
    
    if (!certificate) {
      return {
        isValid: false,
        error: `Certificate not found using ${method}.`
      };
    }
    
    // Simulate transaction details
    const transaction: BlockchainTransaction = {
      hash: certificate.txHash,
      blockId: certificate.blockId,
      timestamp: new Date(certificate.issuedDate).getTime(),
      confirmations: Math.floor(Math.random() * 100) + 50,
      status: 'confirmed'
    };
    
    return {
      isValid: true,
      certificate,
      transaction
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      isValid: false,
      error: "An unexpected error occurred during verification."
    };
  }
};

// Verify a certificate from file
export const verifyCertificateFromFile = async (file: File): Promise<{
  isValid: boolean;
  certificate?: Certificate;
  transaction?: BlockchainTransaction;
  error?: string;
}> => {
  // This would be replaced with actual file parsing and verification
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate error for now (would be replaced with actual logic)
  return {
    isValid: false,
    error: "File verification is not supported in this demo version."
  };
};

// Generate a PDF certificate
export const generateCertificatePDF = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Element not found');
  }
  
  // Configure pdf options for standard certificate size (8.5" x 11")
  const options = {
    margin: [0.5, 0.5],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: true },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', // 8.5" x 11" 
      orientation: 'landscape' 
    }
  };
  
  // Generate the PDF
  await html2pdf().set(options).from(element).save();
};

// Helper for Web Share API
export const shareCertificate = async (certificate: Certificate): Promise<boolean> => {
  if (!certificate) return false;
  
  const verificationUrl = `${window.location.origin}/verify-cert/${certificate.certHash}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${certificate.title} Certificate`,
        text: `Check out my blockchain-verified ${certificate.title} certificate!`,
        url: verificationUrl
      });
      return true;
    } catch (error) {
      console.error("Sharing failed:", error);
      return false;
    }
  }
  
  return false;
};

// Check if MetaMask is installed
export const hasMetaMask = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof window.ethereum !== 'undefined' && 
    window.ethereum.isMetaMask;
};

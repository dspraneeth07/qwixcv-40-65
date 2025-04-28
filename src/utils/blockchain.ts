
import html2pdf from 'html2pdf.js';
import { Certificate } from '@/types/certification';
import { useToast } from '@/components/ui/use-toast';
import { getQwixVaultIdByEmail } from './blockchainDocuments';
import QRCode from 'qrcode';

// Generate Certificate PDF
export const generateCertificatePDF = async (elementId: string, fileName?: string): Promise<string> => {
  try {
    // Get the element to convert
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    // Configure options for the PDF
    const pdfOptions = {
      margin: 0,
      filename: fileName || 'certificate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF as a blob URL
    const pdfBlob = await html2pdf().from(element).set(pdfOptions).outputPdf('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Share certificate
export const shareCertificate = async (certificate: Certificate) => {
  const verificationUrl = `${window.location.origin}/verify-cert/${certificate.certHash}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${certificate.title} - Certificate`,
        text: `Check out my certificate: ${certificate.title}`,
        url: verificationUrl
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      
      // Fall back to clipboard
      return copyToClipboard(verificationUrl);
    }
  } else {
    // Fall back to clipboard
    return copyToClipboard(verificationUrl);
  }
};

// Copy to clipboard helper
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Generate a certificate
export const generateCertificate = async (
  testId: string, 
  title: string,
  score: number, 
  recipientName: string,
  recipientEmail: string
): Promise<Certificate> => {
  // Create a unique ID for the certificate
  const uniqueId = `cert-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  // Create a certificate hash
  const certHash = `qwix-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
  
  // Create a transaction hash
  const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  // Create a new certificate
  const certificate: Certificate = {
    id: uniqueId,
    testId,
    title,
    score,
    issuedDate: new Date().toISOString(),
    isPublic: true,
    certHash,
    txHash,
    blockId: Math.floor(Math.random() * 1000000),
    issuerName: "QwiXCert Authority",
    holderName: recipientName,
    holderEmail: recipientEmail,
    vaultId: getQwixVaultIdByEmail(recipientEmail) || "default-vault",
    recipientName,
    recipientEmail,
    uniqueId,
    blockchainNetwork: "Polygon",
    issuer: "QwiXCert Authority",
    contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    smartContractStandard: "ERC-721"
  };

  return certificate;
};

// Certificate verification functions
export const verifyCertificate = async (
  identifier: string, 
  method: 'certHash' | 'txHash' | 'blockId' | 'uniqueId' = 'certHash'
): Promise<{ isValid: boolean; certificate?: Certificate; transaction?: any; error?: string }> => {
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get all certificates
  const certificates = getUserCertificates();
  
  // Find the certificate based on the method
  let certificate;
  
  switch (method) {
    case 'certHash':
      certificate = certificates.find(cert => cert.certHash === identifier);
      break;
    case 'txHash':
      certificate = certificates.find(cert => cert.txHash === identifier);
      break;
    case 'blockId':
      certificate = certificates.find(cert => cert.blockId.toString() === identifier);
      break;
    case 'uniqueId':
      certificate = certificates.find(cert => cert.uniqueId === identifier);
      break;
    default:
      return { isValid: false, error: 'Invalid verification method' };
  }
  
  if (certificate) {
    // Create a mock transaction
    const transaction = {
      hash: certificate.txHash,
      blockId: certificate.blockId,
      confirmations: Math.floor(Math.random() * 1000),
      timestamp: certificate.issuedDate,
      status: 'confirmed' as const
    };
    
    return { isValid: true, certificate, transaction };
  }
  
  return { isValid: false, error: 'Certificate not found' };
};

// Verify certificate from file
export const verifyCertificateFromFile = async (file: File): Promise<{ isValid: boolean; certificate?: Certificate; error?: string }> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, we would extract the certificate data from the file
  // For this demo, we'll just return a mock response
  if (file.type === 'application/pdf') {
    // Mock success for PDFs
    const mockCertificate: Certificate = {
      id: `cert-${Date.now()}`,
      testId: 'mock-test-001',
      title: 'Mock Certificate from File',
      score: 85,
      issuedDate: new Date().toISOString(),
      isPublic: true,
      certHash: `qwix-${Date.now().toString(36)}`,
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockId: Math.floor(Math.random() * 1000000),
      issuerName: 'QwiXCert Authority',
      holderName: 'File Holder',
      holderEmail: 'file@example.com',
      vaultId: 'mock-vault-id',
      recipientName: 'File Holder',
      recipientEmail: 'file@example.com',
      uniqueId: `file-cert-${Date.now()}`,
      blockchainNetwork: 'Polygon',
      issuer: 'QwiXCert Authority',
      contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      smartContractStandard: 'ERC-721'
    };
    
    return { isValid: true, certificate: mockCertificate };
  }
  
  return { isValid: false, error: 'Invalid certificate file format. Please upload a PDF.' };
};

// Get user certificates
export const getUserCertificates = (): Certificate[] => {
  try {
    // In a real app, this would fetch from a database
    // For now, we'll just use localStorage
    const certificatesStr = localStorage.getItem('user_certificates');
    if (certificatesStr) {
      return JSON.parse(certificatesStr);
    }
  } catch (error) {
    console.error('Error getting certificates:', error);
  }
  
  return [];
};

// Update certificate visibility
export const updateCertificateVisibility = (certificateId: string, isPublic: boolean): boolean => {
  try {
    const certificates = getUserCertificates();
    const updatedCertificates = certificates.map(cert => 
      cert.id === certificateId ? { ...cert, isPublic } : cert
    );
    
    localStorage.setItem('user_certificates', JSON.stringify(updatedCertificates));
    return true;
  } catch (error) {
    console.error('Error updating certificate visibility:', error);
    return false;
  }
};

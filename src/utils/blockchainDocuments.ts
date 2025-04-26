
import { BlockchainDocument } from "@/context/BlockchainContext";

// Helper function to get user documents from local storage
export const getUserDocuments = (): BlockchainDocument[] => {
  try {
    const documentsString = localStorage.getItem('qwix_blockchain_documents');
    if (!documentsString) {
      return [];
    }
    
    return JSON.parse(documentsString);
  } catch (error) {
    console.error("Error loading documents:", error);
    return [];
  }
};

// Helper function to save user documents to local storage
export const saveUserDocuments = (documents: BlockchainDocument[]): void => {
  try {
    localStorage.setItem('qwix_blockchain_documents', JSON.stringify(documents));
  } catch (error) {
    console.error("Error saving documents:", error);
  }
};

// Helper function to add a new document
export const addUserDocument = (document: BlockchainDocument): void => {
  const documents = getUserDocuments();
  documents.push(document);
  saveUserDocuments(documents);
};

// Helper to get documents for a specific owner
export const getUserDocumentsByOwner = (ownerAddress: string): BlockchainDocument[] => {
  const documents = getUserDocuments();
  return documents.filter(doc => doc.ownerAddress === ownerAddress);
};

// Mock function to generate sample documents if none exist
export const createSampleDocuments = (ownerAddress: string): void => {
  const documents = getUserDocuments();
  
  // Only create samples if there are no documents
  if (documents.length === 0) {
    const sampleDocs: BlockchainDocument[] = [
      {
        uniqueId: `QM-${Date.now().toString(36)}-sample1`,
        fileName: "Resume_2025.pdf",
        description: "Professional Resume with Blockchain Verification",
        fileType: "application/pdf",
        fileSize: 245000,
        timestamp: new Date().toISOString(),
        blockchainHash: "0x7a69c8a47b584e1d78c97e9a773f7e94d09d85e0d1233a82f19d28c954610bb3",
        ownerAddress,
        ipfsUri: "ipfs://QmWZabcdef1234567890",
        tokenId: 12345,
        verificationUrl: `${window.location.origin}/verify-document/sample1`
      },
      {
        uniqueId: `QM-${Date.now().toString(36)}-sample2`,
        fileName: "Degree_Certificate.pdf",
        description: "Bachelor's Degree in Computer Science",
        fileType: "application/pdf",
        fileSize: 567000,
        timestamp: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
        blockchainHash: "0x9b75c8a47b584e1d78c97e9a773f7e94d09d85e0d1233a82f19d28c954610cc4",
        ownerAddress,
        ipfsUri: "ipfs://QmWZ123456789abcdef",
        tokenId: 12346,
        verificationUrl: `${window.location.origin}/verify-document/sample2`
      }
    ];
    
    saveUserDocuments(sampleDocs);
  }
};

// Helper function for blockchain document verification
export const generateCertificatePDF = async (elementId: string, fileName: string): Promise<void> => {
  try {
    // In a real implementation, this would use html2pdf or jsPDF
    // For demo purposes, we'll just simulate a download
    console.log(`Generating PDF for element: ${elementId}, filename: ${fileName}`);
    
    // Create a simple "download" that just alerts the user
    const link = document.createElement('a');
    link.download = fileName;
    link.href = 'data:text/plain;charset=utf-8,This is a simulated certificate download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating PDF:", error);
    return Promise.reject(error);
  }
};

// Helper function to share certificates
export const shareCertificate = async (verificationUrl: string): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Blockchain Verified Certificate',
        text: 'Check out my blockchain verified certificate!',
        url: verificationUrl
      });
      return true;
    } else {
      // Fallback for browsers that don't support Web Share API
      await navigator.clipboard.writeText(verificationUrl);
      return true;
    }
  } catch (error) {
    console.error("Error sharing certificate:", error);
    return false;
  }
};

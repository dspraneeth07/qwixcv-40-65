
import { BlockchainDocument } from "@/context/BlockchainContext";

// Helper function to get user documents from local storage with userId filter
export const getUserDocuments = (userId?: string): BlockchainDocument[] => {
  try {
    const documentsString = localStorage.getItem('qwix_blockchain_documents');
    if (!documentsString) {
      return [];
    }
    
    const documents = JSON.parse(documentsString) as BlockchainDocument[];
    
    // If userId is provided, filter by that userId
    if (userId) {
      return documents.filter(doc => doc.userId === userId);
    }
    
    return documents;
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

// Helper to get documents for a specific user
export const getUserDocumentsByUserId = (userId: string): BlockchainDocument[] => {
  const documents = getUserDocuments();
  return documents.filter(doc => doc.userId === userId);
};

// Function to generate a unique QwixVault ID based on user details
export const generateQwixVaultId = (userId: string, email: string): string => {
  // Create a deterministic but unique ID
  const emailHash = btoa(email).replace(/[/+=]/g, '').substring(0, 8);
  const userIdPart = userId.substring(0, 4);
  return `QV-${userIdPart}-${emailHash}`;
};

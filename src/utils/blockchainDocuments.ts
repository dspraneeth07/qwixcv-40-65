import { v4 as uuidv4 } from 'uuid';
import { BlockchainDocument } from '@/types/blockchain';

// Local storage key for documents
const DOCUMENTS_STORAGE_KEY = 'qwix_blockchain_documents';

// Helper to get documents from localStorage
export const getUserDocuments = (): BlockchainDocument[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedDocs = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    const docs = storedDocs ? JSON.parse(storedDocs) : [];
    console.log("Retrieved documents from storage:", docs);
    return docs;
  } catch (error) {
    console.error("Error retrieving documents:", error);
    return [];
  }
};

// Save documents to localStorage
const saveDocuments = (documents: BlockchainDocument[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    console.log("Saved documents to storage:", documents);
  } catch (error) {
    console.error("Error saving documents:", error);
  }
};

// Generate a unique blockchain hash
const generateBlockchainHash = (): string => {
  return `0x${Array.from({length: 40}, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
};

// Generate a unique block ID
const generateBlockId = (): number => {
  return Math.floor(Math.random() * 10000000) + 1000000;
};

// Interface for document upload parameters
interface DocumentUploadParams {
  fileName: string;
  description?: string;
  fileType: string;
  fileSize: number;
  ownerAddress: string;
}

// Upload document to blockchain
export const uploadDocumentToBlockchain = async (
  params: DocumentUploadParams
): Promise<BlockchainDocument> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const now = new Date().toISOString();
  const newDocument: BlockchainDocument = {
    id: uuidv4(),
    fileName: params.fileName,
    description: params.description || '',
    fileType: params.fileType,
    fileSize: params.fileSize,
    timestamp: now,
    blockchainHash: generateBlockchainHash(),
    blockId: generateBlockId(),
    blockchainStatus: Math.random() > 0.3 ? 'verified' : 'pending',
    ownerAddress: params.ownerAddress,
  };
  
  const documents = getUserDocuments();
  documents.push(newDocument);
  saveDocuments(documents);
  
  return newDocument;
};

// Update document metadata
export const updateDocumentMetadata = async (
  documentId: string,
  updates: {
    fileName?: string;
    description?: string;
  }
): Promise<BlockchainDocument> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const documents = getUserDocuments();
  const documentIndex = documents.findIndex(doc => doc.id === documentId);
  
  if (documentIndex === -1) {
    throw new Error(`Document with ID ${documentId} not found`);
  }
  
  // Update document
  const updatedDocument = {
    ...documents[documentIndex],
    ...updates,
  };
  
  documents[documentIndex] = updatedDocument;
  saveDocuments(documents);
  
  return updatedDocument;
};

// Delete document
export const deleteDocument = async (documentId: string): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const documents = getUserDocuments();
  const filteredDocuments = documents.filter(doc => doc.id !== documentId);
  
  if (filteredDocuments.length === documents.length) {
    throw new Error(`Document with ID ${documentId} not found`);
  }
  
  saveDocuments(filteredDocuments);
};

// Refresh document blockchain status
export const refreshDocumentStatus = async (documentId: string): Promise<BlockchainDocument> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const documents = getUserDocuments();
  const documentIndex = documents.findIndex(doc => doc.id === documentId);
  
  if (documentIndex === -1) {
    throw new Error(`Document with ID ${documentId} not found`);
  }
  
  // If document is already verified, keep it verified
  // If it's pending, there's a high chance it will become verified
  if (documents[documentIndex].blockchainStatus === 'pending' && Math.random() > 0.2) {
    documents[documentIndex].blockchainStatus = 'verified';
  }
  
  saveDocuments(documents);
  
  return documents[documentIndex];
};

// Share document
export const shareDocument = async (documentId: string): Promise<string> => {
  const documents = getUserDocuments();
  const document = documents.find(doc => doc.id === documentId);
  
  if (!document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }
  
  // Generate verification URL (in a real app, this would be a hosted verification page)
  const verificationUrl = `${window.location.origin}/verify-cert/${document.blockchainHash}`;
  
  return verificationUrl;
};

// Verify document by hash
export const verifyDocumentByHash = async (hash: string): Promise<{
  isValid: boolean;
  document?: BlockchainDocument;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const documents = getUserDocuments();
  const document = documents.find(doc => doc.blockchainHash === hash);
  
  if (!document) {
    return { isValid: false };
  }
  
  return {
    isValid: true,
    document
  };
};

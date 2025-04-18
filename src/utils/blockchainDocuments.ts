import { v4 as uuidv4 } from 'uuid';
import { NFTStorage } from 'nft.storage';
import { BlockchainDocument, DocumentUploadParams } from '@/types/blockchain';
import { useBlockchain } from '@/context/BlockchainContext';

// NFT.Storage API key for IPFS storage
const NFT_STORAGE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU5MWE3NDQ0ODVBQUYyMTE1MzU1OTlkZGQwRTdGOTcyQzczNTIxNzQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTY2MTYyMzc5NywibmFtZSI6IlF3aXhCbG9jayJ9.iZVMeFkVe1Bw8IWkZJmGQPQKTLT9HnW83vubGolFbBI';

// Local storage key for documents
const DOCUMENTS_STORAGE_KEY = 'qwix_blockchain_documents';

// Get NFT.Storage client
const getNftStorageClient = () => {
  return new NFTStorage({ token: NFT_STORAGE_API_KEY });
};

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

// Upload document to IPFS
const uploadToIPFS = async (file: File, metadata: any): Promise<string> => {
  const client = getNftStorageClient();
  
  // Create a Blob with metadata
  const metadataBlob = new Blob([JSON.stringify({
    name: metadata.fileName,
    description: metadata.description || '',
    properties: {
      fileType: file.type,
      fileSize: file.size,
      timestamp: new Date().toISOString(),
      ownerAddress: metadata.ownerAddress
    }
  })], { type: 'application/json' });
  
  // Store as NFT
  const cid = await client.storeBlob(metadataBlob);
  
  // Also store the file content
  const fileCid = await client.storeBlob(file);
  
  // Return both CIDs
  return JSON.stringify({
    metadata: `ipfs://${cid}`,
    content: `ipfs://${fileCid}`
  });
};

// Upload document to blockchain
export const uploadDocumentToBlockchain = async (
  params: DocumentUploadParams
): Promise<BlockchainDocument> => {
  // Upload to IPFS
  const ipfsData = await uploadToIPFS(params.file, {
    fileName: params.fileName,
    description: params.description,
    ownerAddress: params.ownerAddress
  });
  
  const ipfsJson = JSON.parse(ipfsData);
  const blockchainHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const blockId = Math.floor(Math.random() * 10000000) + 1000000;
  
  const now = new Date().toISOString();
  const newDocument: BlockchainDocument = {
    id: uuidv4(),
    fileName: params.fileName,
    description: params.description || '',
    fileType: params.file.type,
    fileSize: params.file.size,
    timestamp: now,
    blockchainHash,
    blockId,
    blockchainStatus: 'pending',
    ownerAddress: params.ownerAddress,
    ipfsUri: ipfsJson.metadata,
    ipfsContentUri: ipfsJson.content
  };
  
  // In a full implementation, we would mint an NFT here
  // For now, we just set up the data and save to localStorage
  
  const documents = getUserDocuments();
  documents.push(newDocument);
  saveDocuments(documents);
  
  // Simulate verification after a delay
  setTimeout(() => {
    const docs = getUserDocuments();
    const docIndex = docs.findIndex(d => d.id === newDocument.id);
    if (docIndex >= 0) {
      docs[docIndex].blockchainStatus = 'verified';
      saveDocuments(docs);
    }
  }, 5000);
  
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
  
  // If this were a full implementation, we would verify on the blockchain here
  
  return {
    isValid: true,
    document
  };
};

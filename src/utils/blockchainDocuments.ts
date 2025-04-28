
import type { BlockchainDocument, Certificate } from '@/types/blockchain';

// Get all documents from all users
export const getAllDocuments = (): BlockchainDocument[] => {
  // First check new storage format
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  const allDocuments: BlockchainDocument[] = [];
  
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    for (const email in vaultUsers) {
      if (vaultUsers[email].documents) {
        allDocuments.push(...vaultUsers[email].documents);
      }
    }
  }
  
  // Also check legacy storage
  const legacyDocsStr = localStorage.getItem('qwix_blockchain_documents');
  if (legacyDocsStr) {
    try {
      const legacyDocs = JSON.parse(legacyDocsStr);
      if (Array.isArray(legacyDocs)) {
        allDocuments.push(...legacyDocs);
      }
    } catch (e) {
      console.error("Error parsing legacy documents:", e);
    }
  }
  
  return allDocuments;
};

// Get documents for a specific user by owner address
export const getUserDocumentsByOwner = (ownerAddress: string): BlockchainDocument[] => {
  const allDocuments = getAllDocuments();
  return allDocuments.filter(doc => doc.ownerAddress === ownerAddress);
};

// Get documents for a specific user by email
export const getUserDocumentsByEmail = (email: string): BlockchainDocument[] => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    if (vaultUsers[email] && vaultUsers[email].documents) {
      return vaultUsers[email].documents;
    }
  }
  return [];
};

// Save a new document to a user's vault
export const saveDocumentToUserVault = (
  email: string,
  document: BlockchainDocument
): boolean => {
  if (!email || !document) return false;
  
  try {
    const vaultUsersStr = localStorage.getItem('qwixvault_users');
    const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};
    
    if (!vaultUsers[email]) {
      console.error("User vault not found");
      return false;
    }
    
    // Add document if it doesn't exist already
    const existingIndex = vaultUsers[email].documents.findIndex(
      (doc: BlockchainDocument) => doc.uniqueId === document.uniqueId
    );
    
    if (existingIndex >= 0) {
      vaultUsers[email].documents[existingIndex] = document;
    } else {
      vaultUsers[email].documents.push(document);
    }
    
    // Save back to localStorage
    localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
    return true;
  } catch (error) {
    console.error("Error saving document to user vault:", error);
    return false;
  }
};

// Get all certificates from all users
export const getAllCertificates = (): Certificate[] => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  const allCertificates: Certificate[] = [];
  
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    for (const email in vaultUsers) {
      if (vaultUsers[email].certificates) {
        allCertificates.push(...vaultUsers[email].certificates);
      }
    }
  }
  
  return allCertificates;
};

// Get certificates for a specific user by email
export const getUserCertificatesByEmail = (email: string): Certificate[] => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    if (vaultUsers[email] && vaultUsers[email].certificates) {
      return vaultUsers[email].certificates;
    }
  }
  return [];
};

// Get certificates for a specific QwixVault ID
export const getCertificatesByVaultId = (vaultId: string): Certificate[] => {
  const allCertificates = getAllCertificates();
  return allCertificates.filter(cert => cert.vaultId === vaultId);
};

// Verify if a certificate exists by its hash
export const verifyCertificateByHash = (certHash: string): Certificate | null => {
  const allCertificates = getAllCertificates();
  return allCertificates.find(cert => cert.certHash === certHash) || null;
};

// Get a user's QwixVault ID by email
export const getQwixVaultIdByEmail = (email: string): string | null => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    if (vaultUsers[email]) {
      return vaultUsers[email].vaultId;
    }
  }
  return null;
};

// Update document upload functions to use the new storage format
export const getUserDocuments = (): BlockchainDocument[] => {
  // For backward compatibility, still check the legacy storage
  const documentsString = localStorage.getItem('qwix_blockchain_documents');
  
  if (documentsString) {
    try {
      return JSON.parse(documentsString);
    } catch (e) {
      console.error("Error parsing documents:", e);
      return [];
    }
  }
  
  return [];
};

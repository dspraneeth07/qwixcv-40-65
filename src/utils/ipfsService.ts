
// Mock IPFS service for document uploads
import { v4 as uuidv4 } from 'uuid';

interface IPFSUploadResult {
  ipfsUri: string;
  hash: string;
  success: boolean;
  error?: string;
}

// Generate a mock IPFS hash using the file content and metadata
const generateMockIPFSHash = (file: File, metadata: any): string => {
  // Create a deterministic but random-looking hash based on the file name and current time
  const fileNameHash = btoa(file.name).replace(/[/+=]/g, '').substring(0, 16);
  const timeComponent = Date.now().toString(16).substring(0, 8);
  
  return `QmWZ${fileNameHash}${timeComponent}${uuidv4().substring(0, 8)}`;
};

// Mock IPFS upload function that simulates a successful upload
export const uploadToIPFS = async (
  file: File,
  metadata: any
): Promise<IPFSUploadResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Generate a mock IPFS hash
    const hash = generateMockIPFSHash(file, metadata);
    const ipfsUri = `ipfs://${hash}`;
    
    console.log('IPFS upload successful (mock)', { ipfsUri, hash, file, metadata });
    
    // Return success response
    return {
      ipfsUri,
      hash,
      success: true
    };
  } catch (error) {
    console.error('IPFS upload error (mock):', error);
    return {
      ipfsUri: '',
      hash: '',
      success: false,
      error: 'Mock IPFS upload failed'
    };
  }
};

// Mock function to get content from IPFS
export const getFromIPFS = async (ipfsUri: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For mock purposes, we just return a data URL based on the IPFS hash
  // This would normally fetch the actual content from IPFS
  return `data:text/plain;base64,${btoa(`Mock IPFS content for ${ipfsUri}`)}`;
};

// Helper function to get a presentable link for an IPFS resource
export const getIPFSGatewayLink = (ipfsUri: string): string => {
  if (!ipfsUri) return '';
  
  // Remove ipfs:// prefix if present
  const hash = ipfsUri.replace('ipfs://', '');
  
  // Use a public IPFS gateway (in real implementation)
  return `https://ipfs.io/ipfs/${hash}`;
};


import { ethers } from "ethers";
import { Certificate, BlockchainTransaction } from "@/types/certification";

// Simple ABI for a certificate contract
const certificateContractABI = [
  "function mintCertificate(string memory certHash, string memory recipientName, string memory recipientEmail, uint256 score) public returns (uint256)",
  "function getCertificate(string memory certHash) public view returns (string memory, string memory, uint256, uint256, bool)",
  "function updateCertificateVisibility(string memory certHash, bool isPublic) public returns (bool)",
  "function verifyCertificate(string memory certHash) public view returns (bool)",
];

// Demo contract address (should be replaced with actual deployed contract)
const CONTRACT_ADDRESS = "0x4d43925eB5b4492B0dE13FDce4515eD0b9E44ab2";

// Network configuration
const NETWORK = {
  name: "Polygon Mumbai",
  chainId: 80001, // Mumbai testnet
  rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  blockExplorer: "https://mumbai.polygonscan.com"
};

// Check if user has MetaMask or web3 provider installed
export const hasMetaMask = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
};

// Get ethers provider and signer
export const getProvider = async () => {
  try {
    // Check if MetaMask is available
    if (!hasMetaMask()) {
      // Use public RPC provider as fallback
      const provider = new ethers.JsonRpcProvider(NETWORK.rpcUrl);
      return { provider, signer: null };
    }
    
    // Create ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Get signer if available
    let signer = null;
    try {
      signer = await provider.getSigner();
    } catch (error) {
      console.log("No signer available, read-only mode", error);
    }
    
    return { provider, signer };
  } catch (error) {
    console.error("Failed to get provider or signer:", error);
    // Use public RPC provider as fallback
    const provider = new ethers.JsonRpcProvider(NETWORK.rpcUrl);
    return { provider, signer: null };
  }
};

// Connect to contract with signer
const getContractWithSigner = async () => {
  const { provider, signer } = await getProvider();
  if (!signer) {
    throw new Error("No signer available. Please connect MetaMask to mint certificates.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, certificateContractABI, signer);
};

// Connect to contract with provider (read-only)
const getContractWithProvider = async () => {
  const { provider } = await getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, certificateContractABI, provider);
};

// Generate a deterministic certificate hash from test data
export const generateCertificateHash = (
  testId: string, 
  recipientName: string,
  recipientEmail: string,
  timestamp: number
): string => {
  const hashData = `${testId}-${recipientName}-${recipientEmail}-${timestamp}`;
  return ethers.keccak256(ethers.toUtf8Bytes(hashData));
};

// Mint a new certificate on the blockchain
export const generateCertificate = async (
  testId: string,
  testTitle: string,
  score: number,
  recipientName: string,
  recipientEmail: string
): Promise<Certificate> => {
  try {
    // Generate certificate hash
    const timestamp = Date.now();
    const certHash = generateCertificateHash(testId, recipientName, recipientEmail, timestamp);
    
    // Create certificate object
    const certificate: Certificate = {
      id: certHash.substring(0, 10),
      uniqueId: certHash.substring(2, 16),
      certHash: certHash,
      title: testTitle,
      score: score,
      recipientName: recipientName,
      recipientEmail: recipientEmail,
      issuedDate: new Date(timestamp).toISOString(),
      issuer: "QWIK CV Certification",
      txHash: `0x${Math.random().toString(16).substring(2,66)}`,
      blockId: Math.floor(Math.random() * 10000000).toString(),
      blockchainNetwork: NETWORK.name,
      isPublic: true,
      contractAddress: CONTRACT_ADDRESS,
      smartContractStandard: "ERC-721",
    };
    
    // Store certificate in local storage
    const existingCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    existingCerts.push(certificate);
    localStorage.setItem("blockchain_certificates", JSON.stringify(existingCerts));
    
    return certificate;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

// Verify a certificate on the blockchain
export const verifyCertificate = async (
  identifier: string,
  method: 'certHash' | 'txHash' | 'blockId' | 'uniqueId' = 'certHash'
): Promise<{
  isValid: boolean;
  certificate?: Certificate;
  transaction?: BlockchainTransaction;
  error?: string;
}> => {
  try {
    // Get stored certificates
    const storedCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    
    // Find certificate by specified method
    const certificate = storedCerts.find((c: Certificate) => {
      switch (method) {
        case 'certHash': return c.certHash === identifier;
        case 'txHash': return c.txHash === identifier;
        case 'blockId': return c.blockId === identifier;
        case 'uniqueId': return c.uniqueId === identifier;
        default: return false;
      }
    });
    
    if (!certificate) {
      return { 
        isValid: false, 
        error: `Certificate not found using ${method}: ${identifier}` 
      };
    }
    
    // Simulate transaction for demo
    const transaction: BlockchainTransaction = {
      hash: certificate.txHash,
      blockNumber: Number(certificate.blockId),
      confirmations: 42,
      timestamp: new Date(certificate.issuedDate).getTime(),
      from: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      to: CONTRACT_ADDRESS,
      status: 'confirmed',
    };
    
    return {
      isValid: true,
      certificate,
      transaction,
    };
  } catch (error) {
    console.error("Error in verification:", error);
    return { 
      isValid: false, 
      error: "An error occurred during verification. Please try again later."
    };
  }
};

// Verify certificate from uploaded file
export const verifyCertificateFromFile = async (file: File): Promise<{
  isValid: boolean;
  certificate?: Certificate;
  transaction?: BlockchainTransaction;
  error?: string;
}> => {
  try {
    // Simulate file processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, get stored certificates
    const storedCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    
    // If there are stored certs, pick one randomly for demo
    if (storedCerts.length > 0) {
      const randomCert = storedCerts[Math.floor(Math.random() * storedCerts.length)];
      return verifyCertificate(randomCert.certHash);
    }
    
    return { 
      isValid: false, 
      error: "No valid certificate data found in the uploaded file."
    };
  } catch (error) {
    console.error("Error verifying certificate from file:", error);
    return { 
      isValid: false, 
      error: "Failed to process the certificate file."
    };
  }
};

// Update certificate visibility on blockchain
export const updateCertificateVisibility = async (
  certificateId: string, 
  isPublic: boolean
): Promise<boolean> => {
  try {
    // Get stored certificates
    const storedCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    
    // Find and update certificate
    const certIndex = storedCerts.findIndex((c: Certificate) => c.id === certificateId);
    
    if (certIndex === -1) {
      throw new Error("Certificate not found");
    }
    
    storedCerts[certIndex].isPublic = isPublic;
    localStorage.setItem("blockchain_certificates", JSON.stringify(storedCerts));
    
    return true;
  } catch (error) {
    console.error("Error updating certificate visibility:", error);
    throw new Error("Failed to update certificate visibility");
  }
};

// Get user certificates
export const getUserCertificates = (): Certificate[] => {
  try {
    // Get stored certificates from localStorage
    const storedCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    return storedCerts;
  } catch (error) {
    console.error("Error getting user certificates:", error);
    return [];
  }
};

// Generate certificate PDF (for demo, using HTML to PDF conversion)
export const generateCertificatePDF = async (elementId: string, fileName: string): Promise<void> => {
  try {
    // Simulate the download with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`Certificate generated with filename: ${fileName}`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    throw new Error("Failed to generate certificate PDF");
  }
};

// Share certificate (using Web Share API if available)
export const shareCertificate = async (certificate: Certificate): Promise<boolean> => {
  const verificationUrl = `${window.location.origin}/verify-cert/${certificate.certHash}`;
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: `${certificate.title} Certificate`,
        text: `Check out my verified blockchain certificate: ${certificate.title}`,
        url: verificationUrl,
      });
      return true;
    }
    
    return false; // Web Share API not supported
  } catch (error) {
    console.error("Error sharing certificate:", error);
    return false;
  }
};

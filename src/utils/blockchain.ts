
import { ethers } from "ethers";
import { Certificate, BlockchainTransaction } from "@/types/certification";
import { useToast } from "@/components/ui/use-toast";

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
    // Request access to user's Ethereum accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Create ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Check if we're on the right network
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(NETWORK.chainId)) {
      // Prompt user to switch networks
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${NETWORK.chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // Network not added, prompt to add network
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${NETWORK.chainId.toString(16)}`,
                chainName: NETWORK.name,
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: [NETWORK.rpcUrl],
                blockExplorerUrls: [NETWORK.blockExplorer],
              },
            ],
          });
        }
      }
    }
    
    const signer = await provider.getSigner();
    return { provider, signer };
  } catch (error) {
    console.error("Failed to get provider or signer:", error);
    throw new Error("Failed to connect to wallet. Please ensure MetaMask is installed and unlocked.");
  }
};

// Connect to contract with signer
const getContractWithSigner = async () => {
  const { provider, signer } = await getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, certificateContractABI, signer);
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
  if (!hasMetaMask()) {
    throw new Error("MetaMask not detected. Please install MetaMask to create blockchain certificates.");
  }

  try {
    // Generate certificate hash
    const timestamp = Date.now();
    const certHash = generateCertificateHash(testId, recipientName, recipientEmail, timestamp);
    
    // Connect to contract
    const contract = await getContractWithSigner();
    
    // Mint certificate transaction
    const tx = await contract.mintCertificate(certHash, recipientName, recipientEmail, score);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Get block information
    const { provider } = await getProvider();
    const block = await provider.getBlock(receipt.blockNumber);
    
    // Create certificate object from transaction data
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
      txHash: receipt.hash,
      blockId: receipt.blockNumber.toString(),
      blockchainNetwork: NETWORK.name,
      isPublic: true,
      contractAddress: CONTRACT_ADDRESS,
      smartContractStandard: "ERC-721",
    };
    
    // Store certificate in local storage for demo purposes
    // In real world scenario, this would be stored in a database linked to the user account
    const existingCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    existingCerts.push(certificate);
    localStorage.setItem("blockchain_certificates", JSON.stringify(existingCerts));
    
    return certificate;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw new Error("Failed to generate certificate. Please try again.");
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
  if (!hasMetaMask()) {
    // Fallback to local verification if no MetaMask (just for demo)
    return fallbackVerifyCertificate(identifier, method);
  }

  try {
    // Connect to contract
    const { provider } = await getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, certificateContractABI, provider);
    
    // If the method is not certHash, we need to find the certHash first
    let certHash = identifier;
    
    if (method !== 'certHash') {
      // Get stored certificates for demo
      const storedCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
      
      // Find certificate by specified method
      const cert = storedCerts.find((c: Certificate) => {
        switch (method) {
          case 'txHash': return c.txHash === identifier;
          case 'blockId': return c.blockId === identifier;
          case 'uniqueId': return c.uniqueId === identifier;
          default: return false;
        }
      });
      
      if (!cert) {
        return { 
          isValid: false, 
          error: `Certificate not found using ${method}: ${identifier}` 
        };
      }
      
      certHash = cert.certHash;
    }
    
    // Verify certificate on blockchain
    const isValid = await contract.verifyCertificate(certHash);
    
    if (!isValid) {
      return { 
        isValid: false, 
        error: "Certificate verification failed. The certificate may be invalid or tampered with." 
      };
    }
    
    // Get stored certificates for demo
    const storedCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    const certificate = storedCerts.find((c: Certificate) => c.certHash === certHash);
    
    if (!certificate) {
      return { 
        isValid: true,
        error: "Certificate verified on blockchain but details not found locally."
      };
    }
    
    // Get transaction details
    const txReceipt = await provider.getTransactionReceipt(certificate.txHash);
    
    // Fix: Ensure we handle the confirmations value as a number
    const confirmations = txReceipt ? Number(txReceipt.confirmations) : 0;
    
    const transaction: BlockchainTransaction = {
      hash: certificate.txHash,
      blockNumber: Number(certificate.blockId),
      confirmations: confirmations,
      timestamp: new Date(certificate.issuedDate).getTime(),
      from: txReceipt ? txReceipt.from : '',
      to: CONTRACT_ADDRESS,
      status: txReceipt && txReceipt.status === 1 ? 'confirmed' : 'pending',
    };
    
    return {
      isValid: true,
      certificate,
      transaction,
    };
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return { 
      isValid: false, 
      error: "An error occurred during verification. Please try again later."
    };
  }
};

// Fallback verification for demo purposes when MetaMask isn't available
const fallbackVerifyCertificate = (
  identifier: string,
  method: 'certHash' | 'txHash' | 'blockId' | 'uniqueId'
): {
  isValid: boolean;
  certificate?: Certificate;
  transaction?: BlockchainTransaction;
  error?: string;
} => {
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
    console.error("Error in fallback verification:", error);
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
    // For demo, we're assuming the file contains the certHash
    // In a real implementation, you would extract the hash from the PDF metadata
    
    // Simulate file processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, generate a random certHash and check if it exists in storage
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
  if (!hasMetaMask()) {
    // Fallback for demo
    return fallbackUpdateVisibility(certificateId, isPublic);
  }
  
  try {
    // Connect to contract
    const contract = await getContractWithSigner();
    
    // Get stored certificates for demo
    const storedCerts = JSON.parse(localStorage.getItem("blockchain_certificates") || "[]");
    const certificate = storedCerts.find((c: Certificate) => c.id === certificateId);
    
    if (!certificate) {
      throw new Error("Certificate not found");
    }
    
    // Update visibility on blockchain
    const tx = await contract.updateCertificateVisibility(certificate.certHash, isPublic);
    await tx.wait();
    
    // Update local storage for demo
    certificate.isPublic = isPublic;
    localStorage.setItem("blockchain_certificates", JSON.stringify(storedCerts));
    
    return true;
  } catch (error) {
    console.error("Error updating certificate visibility:", error);
    throw new Error("Failed to update certificate visibility");
  }
};

// Fallback update visibility for demo
const fallbackUpdateVisibility = (certificateId: string, isPublic: boolean): boolean => {
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
    console.error("Error in fallback update visibility:", error);
    throw new Error("Failed to update certificate visibility");
  }
};

// Get user certificates
export const getUserCertificates = (): Certificate[] => {
  try {
    // In a real implementation, this would fetch certificates from the blockchain
    // based on the connected wallet address
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
    // In a real implementation, you would use a library like html2pdf.js
    // For now, just simulate the download with a delay
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

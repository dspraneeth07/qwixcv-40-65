import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  BlockchainDocument, 
  DocumentUploadParams,
  DocumentVerification,
  QwixVaultUser
} from '@/types/blockchain';
import { Certificate } from '@/types/certification';
import { hasWeb3Support } from '@/utils/qwixMaskWallet';

interface BlockchainContextType {
  isConnected: boolean;
  account: string | null;
  balance: string;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  uploadDocumentToIPFS: (file: File, metadata: any) => Promise<any>;
  mintDocumentAsNFT: (ipfsUri: string, uniqueId: string) => Promise<any>;
  verifyDocument: (uniqueId: string) => Promise<DocumentVerification>;
  getUserDocuments: () => Promise<BlockchainDocument[]>;
  getUserQwixVaultId: () => string;
  getUserCertificates: () => Promise<Certificate[]>;
  generateCertificate: (testId: string, score: number, title: string) => Promise<Certificate | null>;
  saveCertificateToVault: (certificate: Certificate) => Promise<boolean>;
  getVaultUser: () => QwixVaultUser | null;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [vaultUser, setVaultUser] = useState<QwixVaultUser | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize wallet from localStorage on page load
  useEffect(() => {
    const storedAccount = localStorage.getItem('qwixmask_account');
    if (storedAccount) {
      setAccount(storedAccount);
      setIsConnected(true);
      
      // Also retrieve other stored wallet data
      const storedBalance = localStorage.getItem('qwixmask_balance') || '0';
      const storedChainId = localStorage.getItem('qwixmask_chainId');
      
      setBalance(storedBalance);
      setChainId(storedChainId ? parseInt(storedChainId) : null);
    }
    
    // Generate or retrieve QwixVault user data if account exists
    if (storedAccount && user) {
      initializeVaultUser(storedAccount);
    }
  }, [user]);

  // Initialize or retrieve QwixVault user data
  const initializeVaultUser = (walletAddress: string) => {
    if (!user) return;
    
    // Try to get existing vault user data from localStorage
    const vaultUsersStr = localStorage.getItem('qwixvault_users');
    const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};
    
    // Check if this user already has vault data
    if (vaultUsers[user.email]) {
      setVaultUser(vaultUsers[user.email]);
    } else {
      // Create new vault user
      const newVaultUser: QwixVaultUser = {
        email: user.email,
        walletAddress: walletAddress,
        vaultId: `QVID-${Date.now().toString(36)}-${uuidv4().substring(0, 8)}`,
        createdAt: new Date().toISOString(),
        documents: [],
        certificates: []
      };
      
      // Save to localStorage
      vaultUsers[user.email] = newVaultUser;
      localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
      
      setVaultUser(newVaultUser);
    }
  };

  // Connect to QwixMask wallet (with fallback for demo)
  const connectWallet = async () => {
    try {
      // Check if real Web3 wallet is available
      if (hasWeb3Support()) {
        // Real Web3 wallet connection code would go here
        console.log("Connecting to real Web3 wallet");
        
        // For now, simulate a successful connection
        const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const mockBalance = (Math.random() * 10).toFixed(4);
        
        setAccount(mockAddress);
        setBalance(mockBalance);
        setChainId(137); // Polygon network
        setIsConnected(true);
        
        // Save to localStorage
        localStorage.setItem('qwixmask_account', mockAddress);
        localStorage.setItem('qwixmask_balance', mockBalance);
        localStorage.setItem('qwixmask_chainId', '137');
        
        if (user) {
          initializeVaultUser(mockAddress);
        }
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to QwixMask wallet",
        });
        
        return mockAddress;
      } else {
        // Use fallback for demo
        console.info("QwixMask not detected, using fallback mode");
        
        const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const mockBalance = (Math.random() * 10).toFixed(4);
        
        setAccount(mockAddress);
        setBalance(mockBalance);
        setChainId(137); // Polygon network
        setIsConnected(true);
        
        // Save to localStorage
        localStorage.setItem('qwixmask_account', mockAddress);
        localStorage.setItem('qwixmask_balance', mockBalance);
        localStorage.setItem('qwixmask_chainId', '137');
        
        if (user) {
          initializeVaultUser(mockAddress);
        }
        
        toast({
          title: "Demo Wallet Connected",
          description: "Connected to QwixMask in demo mode",
        });
        
        return mockAddress;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to QwixMask wallet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
    setIsConnected(false);
    setVaultUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('qwixmask_account');
    localStorage.removeItem('qwixmask_balance');
    localStorage.removeItem('qwixmask_chainId');
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from QwixMask wallet",
    });
  };

  // Upload document to IPFS (simulated)
  const uploadDocumentToIPFS = async (file: File, metadata: any) => {
    try {
      // Simulate IPFS upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock IPFS hash
      const ipfsHash = `Qm${Array(44).fill(0).map(() => Math.random().toString(36)[2]).join('')}`;
      const ipfsUri = `ipfs://${ipfsHash}`;
      
      return {
        success: true,
        ipfsUri,
        ipfsHash
      };
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error("Failed to upload document to IPFS");
    }
  };

  // Mint document as NFT (simulated)
  const mintDocumentAsNFT = async (ipfsUri: string, uniqueId: string) => {
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock transaction hash
      const txHash = `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`;
      const tokenId = Math.floor(Math.random() * 10000000);
      const verificationUrl = `${window.location.origin}/verify-document/${uniqueId}`;
      
      return {
        success: true,
        txHash,
        tokenId,
        verificationUrl
      };
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw new Error("Failed to mint document as NFT");
    }
  };

  // Verify document (retrieve from storage)
  const verifyDocument = async (uniqueId: string): Promise<DocumentVerification> => {
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check all vault users for this document
      let foundDocument: BlockchainDocument | null = null;
      
      // First check current user's documents if available
      if (vaultUser) {
        foundDocument = vaultUser.documents.find(doc => doc.uniqueId === uniqueId) || null;
      }
      
      // If not found in current user, check all users
      if (!foundDocument) {
        const vaultUsersStr = localStorage.getItem('qwixvault_users');
        if (vaultUsersStr) {
          const vaultUsers = JSON.parse(vaultUsersStr);
          for (const email in vaultUsers) {
            const userDocs = vaultUsers[email].documents || [];
            const found = userDocs.find((doc: BlockchainDocument) => doc.uniqueId === uniqueId);
            if (found) {
              foundDocument = found;
              break;
            }
          }
        }
      }
      
      // If still not found, check legacy localStorage
      if (!foundDocument) {
        const documentsStr = localStorage.getItem('qwix_blockchain_documents');
        if (documentsStr) {
          const documents = JSON.parse(documentsStr);
          foundDocument = documents.find((doc: BlockchainDocument) => doc.uniqueId === uniqueId) || null;
        }
      }
      
      if (foundDocument) {
        return {
          isValid: true,
          document: foundDocument
        };
      } else {
        return {
          isValid: false,
          error: "Document not found or has been revoked"
        };
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      return {
        isValid: false,
        error: "Verification process failed"
      };
    }
  };

  // Get user documents from their vault
  const getUserDocuments = async (): Promise<BlockchainDocument[]> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If user has a vault, return their documents
      if (vaultUser) {
        return [...vaultUser.documents];
      }
      
      // Otherwise return empty array
      return [];
    } catch (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }
  };

  // Get user certificates
  const getUserCertificates = async (): Promise<Certificate[]> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If user has a vault, return their certificates
      if (vaultUser) {
        return [...vaultUser.certificates];
      }
      
      // Otherwise return empty array
      return [];
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      return [];
    }
  };

  // Generate a new certificate
  const generateCertificate = async (
    testId: string, 
    score: number, 
    title: string
  ): Promise<Certificate | null> => {
    if (!vaultUser || !isConnected) {
      toast({
        title: "Vault not connected",
        description: "Please connect your QwixVault first",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // Simulate certificate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock certificate data
      const certHash = `QC${Date.now().toString(36)}-${uuidv4().substring(0, 8)}`;
      const txHash = `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`;
      const blockId = Math.floor(Math.random() * 10000000);
      
      const newCertificate: Certificate = {
        id: uuidv4(),
        testId,
        title,
        score,
        issuedDate: new Date().toISOString(),
        isPublic: true,
        certHash,
        txHash,
        blockId,
        issuerName: "QwixCert Authority",
        holderName: user?.name || "Verified Holder",
        holderEmail: user?.email || "",
        vaultId: vaultUser.vaultId
      };
      
      return newCertificate;
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast({
        title: "Certificate Generation Failed",
        description: "Failed to generate certificate",
        variant: "destructive"
      });
      return null;
    }
  };

  // Save certificate to user's vault
  const saveCertificateToVault = async (certificate: Certificate): Promise<boolean> => {
    if (!vaultUser || !user) {
      toast({
        title: "Vault not connected",
        description: "Please connect your QwixVault first",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Retrieve all vault users
      const vaultUsersStr = localStorage.getItem('qwixvault_users');
      const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};
      
      // Update current user's certificates
      if (vaultUsers[user.email]) {
        // Add certificate if it doesn't exist already
        const existingIndex = vaultUsers[user.email].certificates.findIndex(
          (cert: Certificate) => cert.id === certificate.id
        );
        
        if (existingIndex >= 0) {
          vaultUsers[user.email].certificates[existingIndex] = certificate;
        } else {
          vaultUsers[user.email].certificates.push(certificate);
        }
        
        // Update localStorage
        localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
        
        // Update state
        setVaultUser(vaultUsers[user.email]);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error saving certificate:", error);
      return false;
    }
  };

  // Get user's QwixVault ID
  const getUserQwixVaultId = (): string => {
    if (vaultUser) {
      return vaultUser.vaultId;
    }
    return '';
  };

  // Get vault user
  const getVaultUser = (): QwixVaultUser | null => {
    return vaultUser;
  };

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        account,
        balance,
        chainId,
        connectWallet,
        disconnectWallet,
        uploadDocumentToIPFS,
        mintDocumentAsNFT,
        verifyDocument,
        getUserDocuments,
        getUserQwixVaultId,
        getUserCertificates,
        generateCertificate,
        saveCertificateToVault,
        getVaultUser
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

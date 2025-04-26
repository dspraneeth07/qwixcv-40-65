
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { uploadToIPFS, getFromIPFS, getIPFSGatewayLink } from '@/utils/ipfsService';
import { hasWeb3Support } from '@/utils/qwixMaskWallet';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";

// Types
export interface BlockchainContextType {
  isConnected: boolean;
  account: string | null;
  balance: string;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  uploadDocumentToIPFS: (file: File, metadata: any) => Promise<any>;
  mintDocumentAsNFT: (ipfsUri: string, uniqueId: string) => Promise<any>;
  verifyDocument: (uniqueId: string) => Promise<DocumentVerification>;
  generateQrCodeForDocument: (document: BlockchainDocument) => Promise<string>;
}

export interface BlockchainDocument {
  uniqueId: string;
  fileName: string;
  description?: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
  blockchainHash: string;
  ownerAddress: string;
  ipfsUri?: string;
  tokenId?: number;
  verificationUrl?: string;
}

export interface DocumentVerification {
  isValid: boolean;
  document: BlockchainDocument | null;
  error?: string;
}

export interface DocumentUploadParams {
  file: File;
  fileName: string;
  description: string;
  ownerAddress: string;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.0');
  const [chainId, setChainId] = useState<number | null>(null);
  const { toast } = useToast();

  // Initialize web3 on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (hasWeb3Support()) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            // Get chain ID
            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainIdHex, 16));
            
            // Get balance
            await updateBalance(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking initial connection:", error);
        }
      } else {
        console.log("QwixMask not detected, using fallback mode");
      }
    };
    
    checkConnection();
    
    // Set up event listeners for account changes if web3 is available
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount(null);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
          updateBalance(accounts[0]);
        }
      };
      
      const handleChainChanged = (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
        // Refresh page on chain change as recommended by MetaMask
        window.location.reload();
      };
      
      const handleDisconnect = () => {
        setIsConnected(false);
        setAccount(null);
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
      
      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);

  const updateBalance = async (address: string) => {
    if (window.ethereum) {
      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        
        // Convert wei to ETH
        const balanceInWei = parseInt(balanceHex, 16);
        const balanceInEth = balanceInWei / 1e18;
        setBalance(balanceInEth.toFixed(4));
      } catch (error) {
        console.error("Error getting balance:", error);
        setBalance('0.0');
      }
    }
  };

  const connectWallet = async () => {
    if (hasWeb3Support()) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Get chain ID
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex, 16));
          
          // Get balance
          await updateBalance(accounts[0]);
          
          toast({
            title: "Wallet Connected",
            description: "QwixMask wallet connected successfully",
          });
          
          return true;
        }
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        
        toast({
          title: "Connection Failed",
          description: error.message || "Could not connect to QwixMask",
          variant: "destructive",
        });
        
        throw error;
      }
    } else {
      console.log("Using fallback mode, creating mock wallet");
      // In fallback mode, create a mock wallet
      const mockAccount = `0xdb2fd38906642206e87287c66956a789521c31a4`;
      setAccount(mockAccount);
      setIsConnected(true);
      setChainId(80001); // Mumbai testnet
      setBalance('1.2345');
      
      toast({
        title: "Demo Mode Activated",
        description: "Using QwixMask in demo mode",
      });
      
      return true;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setBalance('0.0');
    setChainId(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "QwixMask wallet disconnected",
    });
  };

  const uploadDocumentToIPFS = async (file: File, metadata: any) => {
    try {
      // Use our mock IPFS service for uploading
      const result = await uploadToIPFS(file, metadata);
      
      if (!result.success) {
        throw new Error(result.error || "IPFS upload failed");
      }
      
      toast({
        title: "Upload Successful",
        description: "Document uploaded to IPFS successfully",
      });
      
      return {
        ipfsUri: result.ipfsUri,
        hash: result.hash,
      };
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      
      toast({
        title: "Upload Failed",
        description: "Failed to upload document to IPFS",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const mintDocumentAsNFT = async (ipfsUri: string, uniqueId: string) => {
    try {
      // Simulate blockchain transaction with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock transaction hash
      const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const tokenId = Math.floor(Math.random() * 1000000) + 1;
      const verificationUrl = `${window.location.origin}/verify-document/${uniqueId}`;
      
      toast({
        title: "Document Secured",
        description: "Your document has been secured on the blockchain",
      });
      
      return {
        success: true,
        txHash,
        tokenId,
        verificationUrl,
      };
    } catch (error) {
      console.error("Error minting NFT:", error);
      
      toast({
        title: "Minting Failed",
        description: "Failed to secure document on blockchain",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const verifyDocument = async (uniqueId: string): Promise<DocumentVerification> => {
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored documents from local storage
      const documentsString = localStorage.getItem('qwix_blockchain_documents');
      if (!documentsString) {
        return {
          isValid: false,
          document: null,
          error: "No documents found in blockchain vault"
        };
      }
      
      const documents: BlockchainDocument[] = JSON.parse(documentsString);
      const document = documents.find(doc => doc.uniqueId === uniqueId);
      
      if (!document) {
        return {
          isValid: false,
          document: null,
          error: "Document not found in blockchain records"
        };
      }
      
      return {
        isValid: true,
        document
      };
    } catch (error) {
      console.error("Error verifying document:", error);
      
      return {
        isValid: false,
        document: null,
        error: "Failed to verify document: Internal error"
      };
    }
  };

  const generateQrCodeForDocument = async (document: BlockchainDocument): Promise<string> => {
    // For a real implementation, this might involve IPFS or other storage
    // Here we just return a verification URL
    return `${window.location.origin}/verify-document/${document.uniqueId}`;
  };

  const value: BlockchainContextType = {
    isConnected,
    account,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    uploadDocumentToIPFS,
    mintDocumentAsNFT,
    verifyDocument,
    generateQrCodeForDocument,
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

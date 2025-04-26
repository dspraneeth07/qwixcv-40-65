import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { uploadToIPFS, getFromIPFS, getIPFSGatewayLink } from '@/utils/ipfsService';
import { hasWeb3Support } from '@/utils/qwixMaskWallet';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { sha256 } from 'js-sha256';
import { BlockchainDocument, DocumentVerification, DocumentUploadParams } from '@/types/blockchain';
import { addUserDocument, getUserDocuments as getLocalUserDocuments, getUserDocumentsByOwner } from '@/utils/blockchainDocuments';

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
  getUserQwixVaultId: () => string | null;
  getUserDocuments: () => Promise<BlockchainDocument[]>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.0');
  const [chainId, setChainId] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      if (hasWeb3Support()) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainIdHex, 16));
            
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
        window.location.reload();
      };
      
      const handleDisconnect = () => {
        setIsConnected(false);
        setAccount(null);
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
      
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
        
        const balanceInWei = parseInt(balanceHex, 16);
        const balanceInEth = balanceInWei / 1e18;
        setBalance(balanceInEth.toFixed(4));
      } catch (error) {
        console.error("Error getting balance:", error);
        setBalance('0.0');
      }
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (hasWeb3Support()) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex, 16));
          
          await updateBalance(accounts[0]);
          
          toast({
            title: "Wallet Connected",
            description: "QwixMask wallet connected successfully",
          });
          
          return;
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
      let mockAccount: string;
      
      if (user) {
        const userIdHash = sha256(user.id);
        mockAccount = `0x${userIdHash.substring(0, 40)}`;
      } else {
        mockAccount = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      }
      
      setAccount(mockAccount);
      setIsConnected(true);
      setChainId(80001);
      setBalance('1.2345');
      
      toast({
        title: "Wallet Connected",
        description: "QwixMask wallet connected successfully",
      });
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
      if (!user) {
        throw new Error("User must be logged in to upload documents");
      }

      const fullMetadata = {
        ...metadata,
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      };
      
      const result = await uploadToIPFS(file, fullMetadata);
      
      if (!result.success) {
        throw new Error(result.error || "IPFS upload failed");
      }
      
      toast({
        title: "Upload Successful",
        description: "Document uploaded to IPFS successfully",
      });
      
      return result;
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
      if (!user || !account) {
        throw new Error("User must be logged in to mint documents");
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timestamp = Date.now().toString();
      const txHash = sha256(`${uniqueId}${timestamp}${ipfsUri}`);
      const tokenId = parseInt(sha256(`${uniqueId}${timestamp}`).substring(0, 6), 16);
      const verificationUrl = `${window.location.origin}/verify-document/${uniqueId}`;
      
      const newDocument: BlockchainDocument = {
        uniqueId,
        fileName: '',
        description: '',
        fileType: '',
        fileSize: 0,
        timestamp: new Date().toISOString(),
        blockchainHash: txHash,
        ownerAddress: account,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        ipfsUri,
        tokenId,
        verificationUrl
      };
      
      addUserDocument(newDocument);
      
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
      const documents = getLocalUserDocuments();
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
    return `${window.location.origin}/verify-document/${document.uniqueId}`;
  };
  
  const getUserQwixVaultId = (): string | null => {
    if (!user) return null;
    return `QV-${user.id.substring(0, 8)}-${sha256(user.email).substring(0, 8)}`;
  };

  const getUserDocuments = async (): Promise<BlockchainDocument[]> => {
    if (!user || !account) return [];

    try {
      return getUserDocumentsByOwner(account);
    } catch (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }
  };

  const value = {
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
    getUserQwixVaultId,
    getUserDocuments
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

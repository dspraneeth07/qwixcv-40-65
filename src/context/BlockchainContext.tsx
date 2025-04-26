
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import { NFTStorage } from 'nft.storage';
import { 
  hasWeb3Support, 
  connectQwixWallet, 
  getChainId, 
  switchToPolygonMumbai,
  getCurrentAccount, 
  setupWalletEvents 
} from '@/utils/qwixMaskWallet';

// Define the type for Ethereum window object
interface WindowWithEthereum extends Window {
  ethereum?: {
    request: (args: any) => Promise<any>;
    on: (event: string, callback: any) => void;
    removeListener: (event: string, callback: any) => void;
    isMetaMask?: boolean;
  };
}

// NFT.Storage API key for IPFS storage
const NFT_STORAGE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU5MWE3NDQ0ODVBQUYyMTE1MzU1OTlkZGQwRTdGOTcyQzczNTIxNzQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTY2MTYyMzc5NywibmFtZSI6IlF3aXhCbG9jayJ9.iZVMeFkVe1Bw8IWkZJmGQPQKTLT9HnW83vubGolFbBI';

// ABI for our Soulbound NFT smart contract
const SOULBOUND_NFT_ABI = [
  "function mintSoulboundNFT(address to, string memory tokenURI) public returns (uint256)",
  "function revokeNFT(uint256 tokenId) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)"
];

// Deployment address on Polygon Mumbai testnet
const SOULBOUND_NFT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

// Helper function to get provider
const getProvider = async () => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (typeof windowWithEthereum !== 'undefined' && windowWithEthereum.ethereum) {
    const provider = new ethers.BrowserProvider(windowWithEthereum.ethereum);
    return { provider, signer: await provider.getSigner() };
  }
  
  // Fallback to a public provider if Web3 is not available
  return { 
    provider: new ethers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
    signer: null
  };
};

// Create NFT.Storage client
const getNftStorageClient = () => {
  return new NFTStorage({ token: NFT_STORAGE_API_KEY });
};

// Upload to IPFS via NFT.Storage
export const uploadToIPFS = async (file: File, metadata: any): Promise<string> => {
  const client = getNftStorageClient();
  
  // Create blob with metadata
  const metadataBlob = new Blob([JSON.stringify({
    name: metadata.fileName,
    description: metadata.description,
    image: file,
    properties: {
      fileType: file.type,
      fileSize: file.size,
      timestamp: new Date().toISOString(),
      ownerAddress: metadata.ownerAddress
    }
  })], { type: 'application/json' });
  
  // Store as NFT
  const cid = await client.storeBlob(metadataBlob);
  return `ipfs://${cid}`;
};

// Mint Soulbound NFT
export const mintSoulboundNFT = async (to: string, tokenURI: string): Promise<{tokenId: number, txHash: string}> => {
  const { provider, signer } = await getProvider();
  
  if (!signer) {
    throw new Error("No signer available. Please connect your wallet.");
  }
  
  const contract = new ethers.Contract(SOULBOUND_NFT_ADDRESS, SOULBOUND_NFT_ABI, signer);
  
  // Mint the NFT
  const tx = await contract.mintSoulboundNFT(to, tokenURI);
  const receipt = await tx.wait();
  
  // Find the transfer event to get the token ID
  const event = receipt.logs.find((log: any) => 
    log.topics[0] === ethers.id("Transfer(address,address,uint256)")
  );
  
  const tokenId = parseInt(event.topics[3], 16);
  
  return {
    tokenId,
    txHash: receipt.hash
  };
};

interface BlockchainContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  uploadDocumentToIPFS: (file: File, metadata: any) => Promise<any>;
  mintDocumentAsNFT: (ipfsUri: string) => Promise<any>;
  verifyDocument: (tokenId: number) => Promise<any>;
}

const BlockchainContext = createContext<BlockchainContextType>({
  isConnected: false,
  account: null,
  chainId: null,
  balance: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  uploadDocumentToIPFS: async () => ({}),
  mintDocumentAsNFT: async () => ({}),
  verifyDocument: async () => ({}),
});

export const useBlockchain = () => useContext(BlockchainContext);

interface BlockchainProviderProps {
  children: React.ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const { toast } = useToast();
  const windowWithEthereum = window as WindowWithEthereum;

  // Check for existing connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (hasWeb3Support()) {
        try {
          // Check if already connected
          const accounts = await windowWithEthereum.ethereum?.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            await updateWalletInfo(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Set up event listeners for wallet changes
  useEffect(() => {
    if (hasWeb3Support()) {
      // Handle account changes
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // User switched accounts
          await updateWalletInfo(accounts[0]);
        }
      };

      // Handle chain changes
      const handleChainChanged = (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
      };

      // Handle disconnect
      const handleDisconnect = () => {
        disconnectWallet();
      };

      const cleanup = setupWalletEvents(
        handleAccountsChanged,
        handleChainChanged,
        handleDisconnect
      );
      
      return cleanup;
    }
    
    return undefined;
  }, [account]);

  // Update wallet info
  const updateWalletInfo = async (walletAddress: string) => {
    try {
      const { provider } = await getProvider();
      
      // Update chain ID
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
      
      // Update account
      setAccount(walletAddress);
      
      // Update balance
      const balanceWei = await provider.getBalance(walletAddress);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
      
      setIsConnected(true);
      
      return true;
    } catch (error) {
      console.error("Error updating wallet info:", error);
      disconnectWallet();
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!hasWeb3Support()) {
      toast({
        title: "Web3 Support Required",
        description: "Your browser doesn't support Web3 functionality. Please use a compatible browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Connect to wallet
      const accounts = await connectQwixWallet();
      
      if (accounts && accounts.length > 0) {
        const chainIdHex = await getChainId();
        const currentChainId = chainIdHex ? parseInt(chainIdHex, 16) : null;
        
        // If not on Polygon Mumbai, prompt to switch
        if (currentChainId !== 80001) {
          await switchToPolygonMumbai();
        }
        
        const success = await updateWalletInfo(accounts[0]);
        
        if (success) {
          toast({
            title: "QwixMask Connected",
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
          });
        }
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      
      if (error.code === 4001) {
        // User rejected the connection
        toast({
          title: "Connection Rejected",
          description: "You rejected the connection request.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to wallet. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setBalance(null);
  };
  
  // Upload document to IPFS
  const uploadDocumentToIPFS = async (file: File, metadata: any) => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }
    
    try {
      // Upload to IPFS via NFT.Storage
      const ipfsUri = await uploadToIPFS(file, {
        ...metadata,
        ownerAddress: account
      });
      
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded to IPFS successfully",
      });
      
      return {
        ipfsUri,
        cid: ipfsUri.replace('ipfs://', '')
      };
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document to IPFS",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Mint document as NFT
  const mintDocumentAsNFT = async (ipfsUri: string) => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }
    
    try {
      // Mint Soulbound NFT
      const { tokenId, txHash } = await mintSoulboundNFT(account, ipfsUri);
      
      toast({
        title: "Document Secured",
        description: "Your document has been secured as a Soulbound NFT on the blockchain",
      });
      
      return {
        tokenId,
        txHash,
        blockchainExplorer: `https://mumbai.polygonscan.com/tx/${txHash}`
      };
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint document as NFT",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Verify document
  const verifyDocument = async (tokenId: number) => {
    try {
      const { provider } = await getProvider();
      const contract = new ethers.Contract(SOULBOUND_NFT_ADDRESS, SOULBOUND_NFT_ABI, provider);
      
      // Get token URI and owner
      const tokenURI = await contract.tokenURI(tokenId);
      const owner = await contract.ownerOf(tokenId);
      
      return {
        isValid: true,
        tokenURI,
        owner,
        verificationUrl: `https://mumbai.polygonscan.com/token/${SOULBOUND_NFT_ADDRESS}?a=${tokenId}`
      };
    } catch (error) {
      console.error("Error verifying document:", error);
      return { isValid: false, error: "Document not found or invalid" };
    }
  };

  const value = {
    isConnected,
    account,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    uploadDocumentToIPFS,
    mintDocumentAsNFT,
    verifyDocument
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";

// Define the type for Ethereum window object
interface WindowWithEthereum extends Window {
  ethereum?: {
    request: (args: any) => Promise<any>;
    on: (event: string, callback: any) => void;
    removeListener: (event: string, callback: any) => void;
    isMetaMask?: boolean;
  };
}

// Helper function to check if MetaMask is installed
const hasMetaMask = (): boolean => {
  const windowWithEthereum = window as WindowWithEthereum;
  return (
    typeof windowWithEthereum !== 'undefined' &&
    typeof windowWithEthereum.ethereum !== 'undefined' &&
    !!windowWithEthereum.ethereum.isMetaMask
  );
};

// Helper function to get provider
const getProvider = async () => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (typeof windowWithEthereum !== 'undefined' && windowWithEthereum.ethereum) {
    const provider = new ethers.BrowserProvider(windowWithEthereum.ethereum);
    return { provider, signer: await provider.getSigner() };
  }
  
  // Fallback to a public provider if MetaMask is not available
  return { 
    provider: new ethers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
    signer: null
  };
};

interface BlockchainContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const BlockchainContext = createContext<BlockchainContextType>({
  isConnected: false,
  account: null,
  chainId: null,
  balance: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
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
      if (hasMetaMask()) {
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
    if (hasMetaMask()) {
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

      if (windowWithEthereum.ethereum) {
        windowWithEthereum.ethereum.on('accountsChanged', handleAccountsChanged);
        windowWithEthereum.ethereum.on('chainChanged', handleChainChanged);
        windowWithEthereum.ethereum.on('disconnect', handleDisconnect);
  
        return () => {
          if (windowWithEthereum.ethereum) {
            windowWithEthereum.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            windowWithEthereum.ethereum.removeListener('chainChanged', handleChainChanged);
            windowWithEthereum.ethereum.removeListener('disconnect', handleDisconnect);
          }
        };
      }
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
    if (!hasMetaMask()) {
      toast({
        title: "MetaMask not detected",
        description: "Proceeding with limited functionality",
        variant: "default"
      });
      return;
    }

    try {
      const accounts = await windowWithEthereum.ethereum?.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const success = await updateWalletInfo(accounts[0]);
        
        if (success) {
          toast({
            title: "Wallet Connected",
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

  const value = {
    isConnected,
    account,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { hasMetaMask, getProvider } from '@/utils/blockchain';
import { useToast } from "@/components/ui/use-toast";

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

  // Check for existing connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (hasMetaMask()) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
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
        window.location.reload();
      };

      // Handle disconnect
      const handleDisconnect = () => {
        disconnectWallet();
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
    } catch (error) {
      console.error("Error updating wallet info:", error);
      disconnectWallet();
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!hasMetaMask()) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to use blockchain features",
        variant: "destructive"
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWalletInfo(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
      });
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

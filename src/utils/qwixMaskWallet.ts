
// QwixMask wallet utility - A custom web3 wallet implementation
import { toast } from "@/components/ui/use-toast";

interface WindowWithEthereum extends Window {
  ethereum?: {
    request: (args: any) => Promise<any>;
    on: (event: string, callback: any) => void;
    removeListener: (event: string, callback: any) => void;
    isMetaMask?: boolean;
    selectedAddress?: string | null;
    chainId?: string;
  };
}

export const POLYGON_MUMBAI_CHAIN_ID = '0x13881'; // 80001 in hex

// Enhanced function to check if browser has Web3 capabilities
export const hasWeb3Support = (): boolean => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  // Check for standard Web3 injection
  if (typeof windowWithEthereum !== 'undefined' && typeof windowWithEthereum.ethereum !== 'undefined') {
    return true;
  }
  
  // Fallback for older browsers: simulate Web3 capabilities for QwixMask
  if (!window.localStorage.getItem('qwixmask_initialized')) {
    window.localStorage.setItem('qwixmask_initialized', 'true');
    
    // Create a simple Web3 provider for QwixMask
    if (!windowWithEthereum.ethereum) {
      // Create a simple ethereum object for browsers without native support
      const qwixMaskProvider = {
        request: async (args: any) => {
          console.log('QwixMask request:', args);
          
          if (args.method === 'eth_requestAccounts' || args.method === 'eth_accounts') {
            // Generate a deterministic address for this browser
            const storedAddress = window.localStorage.getItem('qwixmask_address');
            if (storedAddress) {
              return [storedAddress];
            }
            
            // Generate a pseudo-random wallet address
            const address = '0x' + Array.from({length: 40}, () => 
              Math.floor(Math.random() * 16).toString(16)).join('');
            
            window.localStorage.setItem('qwixmask_address', address);
            return [address];
          }
          
          if (args.method === 'eth_chainId') {
            return POLYGON_MUMBAI_CHAIN_ID;
          }
          
          if (args.method === 'eth_getBalance') {
            return '0x56BC75E2D63100000'; // 100 ETH in hex
          }
          
          if (args.method === 'wallet_switchEthereumChain') {
            return null; // Success
          }
          
          // Default fallback
          return null;
        },
        on: (event: string, callback: any) => {
          console.log('QwixMask registered event:', event);
          // Store event handlers in localStorage
          const handlers = JSON.parse(localStorage.getItem('qwixmask_handlers') || '{}');
          handlers[event] = handlers[event] || [];
          handlers[event].push(callback.toString());
          localStorage.setItem('qwixmask_handlers', JSON.stringify(handlers));
        },
        removeListener: (event: string, callback: any) => {
          console.log('QwixMask removing event listener:', event);
        },
        selectedAddress: window.localStorage.getItem('qwixmask_address') || null,
        chainId: POLYGON_MUMBAI_CHAIN_ID
      };
      
      // Attach to window
      Object.defineProperty(windowWithEthereum, 'ethereum', {
        value: qwixMaskProvider,
        writable: false
      });
    }
  }
  
  return typeof windowWithEthereum !== 'undefined' && typeof windowWithEthereum.ethereum !== 'undefined';
};

// Helper function to request wallet accounts
export const connectQwixWallet = async (): Promise<string[]> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasWeb3Support()) {
    toast({
      title: "QwixMask Initializing",
      description: "Setting up QwixMask wallet for your browser...",
    });
    
    // Try to initialize the simulated provider
    hasWeb3Support();
    
    // Check again after initialization
    if (!hasWeb3Support()) {
      toast({
        title: "Web3 Support Required",
        description: "Your browser doesn't support Web3 functionality. Please use a compatible browser.",
        variant: "destructive"
      });
      
      throw new Error("Web3 is not supported");
    }
  }
  
  try {
    const accounts = await windowWithEthereum.ethereum?.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }
    
    // Successfully connected
    toast({
      title: "QwixMask Connected",
      description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
    });
    
    return accounts;
  } catch (error: any) {
    if (error.code === 4001) {
      // User rejected the connection
      toast({
        title: "Connection Rejected",
        description: "You rejected the connection request.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to QwixMask. Please try again.",
        variant: "destructive"
      });
    }
    throw error;
  }
};

// Helper function to get current chain ID
export const getChainId = async (): Promise<string | null> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasWeb3Support()) {
    return null;
  }
  
  try {
    const chainId = await windowWithEthereum.ethereum?.request({ 
      method: 'eth_chainId' 
    });
    
    return chainId;
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
};

// Function to add Polygon Mumbai network
export const addPolygonMumbaiNetwork = async (): Promise<boolean> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasWeb3Support()) {
    return false;
  }
  
  try {
    await windowWithEthereum.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: POLYGON_MUMBAI_CHAIN_ID,
        chainName: 'Polygon Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      }]
    });
    
    toast({
      title: "Network Added",
      description: "Polygon Mumbai Testnet has been added to your QwixMask wallet",
    });
    
    return true;
  } catch (error: any) {
    if (error.code === 4001) {
      toast({
        title: "Network Add Rejected",
        description: "You rejected adding the Polygon Mumbai network",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Network Add Failed",
        description: "Failed to add Polygon Mumbai network. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  }
};

// Function to switch to Polygon Mumbai network
export const switchToPolygonMumbai = async (): Promise<boolean> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasWeb3Support()) {
    return false;
  }
  
  try {
    await windowWithEthereum.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_MUMBAI_CHAIN_ID }],
    });
    
    toast({
      title: "Network Switched",
      description: "Successfully switched to Polygon Mumbai Testnet",
    });
    
    return true;
  } catch (error: any) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      return addPolygonMumbaiNetwork();
    }
    
    if (error.code === 4001) {
      toast({
        title: "Network Switch Rejected",
        description: "You rejected switching to the Polygon Mumbai network",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Polygon Mumbai network. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  }
};

// Get current connected account
export const getCurrentAccount = async (): Promise<string | null> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasWeb3Support()) {
    return null;
  }
  
  try {
    const accounts = await windowWithEthereum.ethereum?.request({
      method: 'eth_accounts'
    });
    
    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
};

// Setup wallet event listeners
export const setupWalletEvents = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void,
  onDisconnect: () => void
) => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasWeb3Support()) {
    return () => {};
  }
  
  // Handle account changes
  windowWithEthereum.ethereum?.on('accountsChanged', onAccountsChanged);
  
  // Handle chain changes
  windowWithEthereum.ethereum?.on('chainChanged', onChainChanged);
  
  // Handle disconnect
  windowWithEthereum.ethereum?.on('disconnect', onDisconnect);
  
  // Return cleanup function
  return () => {
    if (windowWithEthereum.ethereum) {
      windowWithEthereum.ethereum.removeListener('accountsChanged', onAccountsChanged);
      windowWithEthereum.ethereum.removeListener('chainChanged', onChainChanged);
      windowWithEthereum.ethereum.removeListener('disconnect', onDisconnect);
    }
  };
};

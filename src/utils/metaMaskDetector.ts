
// MetaMask detection utility

// Define the type for Ethereum window object
interface WindowWithEthereum extends Window {
  ethereum?: {
    request: (args: any) => Promise<any>;
    on: (event: string, callback: any) => void;
    removeListener: (event: string, callback: any) => void;
    isMetaMask?: boolean;
  };
}

// Helper function to check if MetaMask is installed and accessible
export const hasMetaMask = (): boolean => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  return (
    typeof windowWithEthereum !== 'undefined' &&
    typeof windowWithEthereum.ethereum !== 'undefined' &&
    !!windowWithEthereum.ethereum.isMetaMask
  );
};

// Helper function to request accounts from MetaMask
export const requestMetaMaskAccounts = async (): Promise<string[]> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    throw new Error("MetaMask is not installed");
  }
  
  try {
    const accounts = await windowWithEthereum.ethereum?.request({ 
      method: 'eth_requestAccounts' 
    });
    
    return accounts || [];
  } catch (error) {
    console.error("Error requesting accounts from MetaMask:", error);
    throw error;
  }
};

// Helper function to get current chain ID from MetaMask
export const getMetaMaskChainId = async (): Promise<string | null> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return null;
  }
  
  try {
    const chainId = await windowWithEthereum.ethereum?.request({ 
      method: 'eth_chainId' 
    });
    
    return chainId;
  } catch (error) {
    console.error("Error getting chain ID from MetaMask:", error);
    return null;
  }
};

// Function to add Polygon Mumbai network to MetaMask
export const addPolygonMumbaiNetwork = async (): Promise<boolean> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return false;
  }
  
  try {
    await windowWithEthereum.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x13881', // 80001 in hex
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
    
    return true;
  } catch (error) {
    console.error("Error adding Polygon Mumbai network to MetaMask:", error);
    return false;
  }
};

// Function to switch to Polygon Mumbai network
export const switchToPolygonMumbai = async (): Promise<boolean> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return false;
  }
  
  try {
    await windowWithEthereum.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }], // 0x13881 is 80001 in hex
    });
    
    return true;
  } catch (error: any) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      return addPolygonMumbaiNetwork();
    }
    
    console.error("Error switching to Polygon Mumbai network:", error);
    return false;
  }
};

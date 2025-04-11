
import React from 'react';
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/context/BlockchainContext';
import { Wallet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { hasMetaMask } from '@/utils/blockchain';

const MetaMaskIntegration = () => {
  const { isConnected, account, connectWallet } = useBlockchain();

  const handleConnectClick = () => {
    if (!hasMetaMask()) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    connectWallet();
  };

  const truncateAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 flex flex-col items-center text-center space-y-4">
      <div className="bg-white rounded-full p-3 shadow-md">
        <Wallet className="h-8 w-8 text-blue-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-bold">Blockchain Integration</h3>
        {!hasMetaMask() ? (
          <p className="text-sm text-muted-foreground mt-1">
            Install MetaMask to access blockchain features
          </p>
        ) : !isConnected ? (
          <p className="text-sm text-muted-foreground mt-1">
            Connect your wallet to access blockchain features
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Connected: {truncateAddress(account)}
          </p>
        )}
      </div>
      
      {!hasMetaMask() ? (
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleConnectClick}>
          Install MetaMask
        </Button>
      ) : !isConnected ? (
        <Button onClick={handleConnectClick}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Your wallet is connected and ready
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MetaMaskIntegration;

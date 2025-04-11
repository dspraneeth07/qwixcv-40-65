
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from '@/context/BlockchainContext';
import { Badge } from "@/components/ui/badge";
import { Wallet, ExternalLink, AlertCircle } from "lucide-react";
import { hasMetaMask } from '@/utils/blockchain';
import { Button } from "@/components/ui/button";

const BlockchainInfoCard = () => {
  const { isConnected, account, balance, chainId, connectWallet } = useBlockchain();

  const getNetworkName = (id: number | null): string => {
    if (!id) return 'Unknown Network';
    
    switch (id) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Polygon Mumbai';
      default:
        return `Chain ID: ${id}`;
    }
  };

  const viewOnExplorer = () => {
    if (!account || !chainId) return;
    
    let explorerUrl = '';
    
    switch (chainId) {
      case 1:
        explorerUrl = `https://etherscan.io/address/${account}`;
        break;
      case 5:
        explorerUrl = `https://goerli.etherscan.io/address/${account}`;
        break;
      case 137:
        explorerUrl = `https://polygonscan.com/address/${account}`;
        break;
      case 80001:
        explorerUrl = `https://mumbai.polygonscan.com/address/${account}`;
        break;
      default:
        return;
    }
    
    window.open(explorerUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Wallet className="h-5 w-5 mr-2 text-blue-600" />
          Blockchain Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to access blockchain features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasMetaMask() ? (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium">MetaMask Required</p>
                  <p className="mt-1">Install MetaMask to use blockchain features</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500"
              onClick={() => window.open('https://metamask.io/download/', '_blank')}
            >
              Install MetaMask
            </Button>
          </div>
        ) : !isConnected ? (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
              <p>Connect your wallet to create and verify blockchain certificates</p>
            </div>
            
            <Button 
              className="w-full"
              onClick={connectWallet}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Address:</span>
                <span className="text-sm font-mono">{account?.substring(0, 8)}...{account?.substring(account.length - 6)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="text-sm">{balance} MATIC</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network:</span>
                <Badge variant="outline">{getNetworkName(chainId)}</Badge>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs flex items-center"
              onClick={viewOnExplorer}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View on Explorer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainInfoCard;

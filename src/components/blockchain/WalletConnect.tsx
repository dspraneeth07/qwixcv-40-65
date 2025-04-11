
import React from 'react';
import { useBlockchain } from '@/context/BlockchainContext';
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, LogOut, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { hasMetaMask } from '@/utils/blockchain';

export const WalletConnect: React.FC = () => {
  const { isConnected, account, balance, chainId, connectWallet, disconnectWallet } = useBlockchain();

  const truncateAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

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

  if (!hasMetaMask()) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>MetaMask Required</AlertTitle>
        <AlertDescription>
          Please install{" "}
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold underline"
          >
            MetaMask
          </a>{" "}
          to use blockchain features.
        </AlertDescription>
      </Alert>
    );
  }

  if (isConnected && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
            <span>{truncateAddress(account)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium mb-1">Account:</p>
            <p className="text-xs text-muted-foreground font-mono">{account}</p>
          </div>
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium mb-1">Balance:</p>
            <p className="text-xs text-muted-foreground">{balance} MATIC</p>
          </div>
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium mb-1">Network:</p>
            <p className="text-xs text-muted-foreground">{getNetworkName(chainId)}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={viewOnExplorer} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>View on Explorer</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connectWallet}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;

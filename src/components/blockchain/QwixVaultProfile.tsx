
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, QrCode, Shield, Copy, RefreshCw } from "lucide-react";
import { useBlockchain } from '@/context/BlockchainContext';
import { useToast } from "@/components/ui/use-toast";
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

const QwixVaultProfile = () => {
  const { account, isConnected, connectWallet } = useBlockchain();
  const { toast } = useToast();
  
  // Generate a unique QwixVault ID from the account address
  const qwixVaultId = account ? 
    `QV-${account.substring(2, 6)}-${account.substring(account.length - 4)}` : null;
  
  // Generate verification URL
  const verificationUrl = account ? 
    `${window.location.origin}/verify-document/${account}` : '';
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: `${label} copied to clipboard`,
        });
      },
      (err) => {
        toast({
          title: "Copy failed",
          description: `Could not copy ${label.toLowerCase()}: ${err}`,
          variant: "destructive"
        });
      }
    );
  };
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            QwixVault Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your QwixMask wallet to access your QwixVault account and secure your documents on the blockchain.
          </p>
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          QwixVault Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
          <div className="bg-white p-2 rounded-lg mb-3">
            <QRCode value={verificationUrl} size={150} />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Scan this QR code to verify your QwixVault identity
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">QwixVault ID:</span>
            <div className="flex items-center">
              <span className="font-mono text-sm">{qwixVaultId}</span>
              <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0" 
                      onClick={() => copyToClipboard(qwixVaultId || '', 'QwixVault ID')}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wallet Address:</span>
            <div className="flex items-center">
              <span className="font-mono text-sm">
                {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
              </span>
              <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0" 
                      onClick={() => copyToClipboard(account || '', 'Wallet address')}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline">
            <Link to="/blockchain-vault">
              <Fingerprint className="mr-2 h-4 w-4" />
              Open Vault
            </Link>
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QwixVaultProfile;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight, QrCode, Fingerprint } from "lucide-react";
import { Link } from 'react-router-dom';
import { useBlockchain } from '@/context/BlockchainContext';

const BlockchainVaultCard = () => {
  const { isConnected } = useBlockchain();
  
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/40 to-indigo-500/40 rounded-bl-full" />
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <div className="mr-2 bg-purple-100 dark:bg-purple-900 p-1.5 rounded-full">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
          QwixMask Blockchain Vault
        </CardTitle>
        <CardDescription>
          Securely store and verify professional documents with blockchain identity
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Storage security</span>
            <span className="font-medium">100%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <QrCode className="h-6 w-6 text-purple-500 mb-1" />
            <span className="text-xs text-center">Document QR Identity</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <Fingerprint className="h-6 w-6 text-indigo-500 mb-1" />
            <span className="text-xs text-center">Unique ID Verification</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Blockchain:</span>{" "}
            <span>QwixChain</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>{" "}
            <span className="text-green-600 font-medium">{isConnected ? 'Connected' : 'Ready'}</span>
          </div>
        </div>
        
        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90">
          <Link to="/blockchain-vault" className="flex items-center justify-center">
            Access Vault
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlockchainVaultCard;

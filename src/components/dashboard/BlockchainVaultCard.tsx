
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

const BlockchainVaultCard = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-modern-blue-400/40 to-soft-purple/40 rounded-bl-full" />
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <div className="mr-2 bg-modern-blue-100 dark:bg-modern-blue-900 p-1.5 rounded-full">
            <Wallet className="h-5 w-5 text-modern-blue-600 dark:text-modern-blue-300" />
          </div>
          QwixMask Blockchain Vault
        </CardTitle>
        <CardDescription>
          Securely store and verify your professional documents with blockchain
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Storage security</span>
            <span className="font-medium">100%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="h-full bg-gradient-to-r from-modern-blue-500 to-soft-purple rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Blockchain:</span>{" "}
            <span>Polygon</span>
          </div>
          <div>
            <span className="text-muted-foreground">Documents:</span>{" "}
            <span>Secured</span>
          </div>
        </div>
        
        <Button asChild className="w-full bg-gradient-to-r from-modern-blue-600 to-soft-purple hover:opacity-90">
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

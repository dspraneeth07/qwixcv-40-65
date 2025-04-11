
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import CertificateVerifier from '@/components/certification/CertificateVerifier';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';
import WalletConnect from '@/components/blockchain/WalletConnect';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { hasMetaMask } from '@/utils/blockchain';

const CertificateVerification = () => {
  const { certHash } = useParams<{ certHash?: string }>();
  const [showWalletWarning, setShowWalletWarning] = useState(false);
  
  useEffect(() => {
    // Check if MetaMask is installed
    setShowWalletWarning(!hasMetaMask());
  }, []);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <QwiXCertHeader 
            title="Certificate Verification" 
            subtitle="Verify the authenticity of blockchain certificates"
            showBadge={false}
          />
          
          <div className="min-w-[180px]">
            <WalletConnect />
          </div>
        </div>
        
        {showWalletWarning && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              MetaMask is recommended for full blockchain verification. Without it, we'll use a fallback verification method.
            </AlertDescription>
          </Alert>
        )}
        
        <CertificateVerifier initialHash={certHash} />
      </div>
    </MainLayout>
  );
};

export default CertificateVerification;

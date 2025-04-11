
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CertificateVerifier from '@/components/certification/CertificateVerifier';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';
import WalletConnect from '@/components/blockchain/WalletConnect';
import { hasMetaMask } from '@/utils/blockchain';

const CertificateVerification = () => {
  const { certHash } = useParams<{ certHash?: string }>();
  
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
        
        <CertificateVerifier initialHash={certHash} />
      </div>
    </MainLayout>
  );
};

export default CertificateVerification;

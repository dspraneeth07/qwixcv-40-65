
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CertificateVerifier from '@/components/certification/CertificateVerifier';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';

const CertificateVerification = () => {
  const { certHash } = useParams<{ certHash?: string }>();
  
  return (
    <MainLayout>
      <div className="container py-10">
        <QwiXCertHeader 
          title="Certificate Verification" 
          subtitle="Verify the authenticity of blockchain-powered certifications instantly"
        />
        
        <CertificateVerifier initialHash={certHash} />
      </div>
    </MainLayout>
  );
};

export default CertificateVerification;

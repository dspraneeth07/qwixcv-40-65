
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CertificateVerifier from '@/components/certification/CertificateVerifier';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Award } from 'lucide-react';

const CertificateVerification = () => {
  const { certHash } = useParams<{ certHash?: string }>();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <MainLayout>
      <div className="container py-10">
        <QwiXCertHeader 
          title="Certificate Verification" 
          subtitle="Verify the authenticity of blockchain-powered certifications instantly"
        />
        
        <CertificateVerifier initialHash={certHash} />
        
        {/* Navigation links */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Button variant="outline" asChild className="w-full md:w-auto">
            <Link to="/certification-center" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore Certification Tests
            </Link>
          </Button>
          
          <Button asChild className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-500">
            <Link to="/dashboard" className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              View Your Certificates
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CertificateVerification;


import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CertificateVerifier from '@/components/certification/CertificateVerifier';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Shield, FileCheck } from 'lucide-react';

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
          title="QwiXCert Verification" 
          subtitle="Verify the authenticity of blockchain-powered certifications instantly"
        />
        
        <CertificateVerifier initialHash={certHash} />
        
        {/* Navigation links */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
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
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-start">
              <FileCheck className="h-5 w-5 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">About QwiXCert Blockchain Verification</h3>
                <p className="text-blue-700 mb-3">
                  QwiXCert uses advanced blockchain technology to create tamper-proof certifications that can be instantly verified by employers, recruiters, and educational institutions.
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
                  <Button asChild variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                    <Link to="/">
                      Learn More About QwiXCert
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/certification-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Get Certified
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CertificateVerification;

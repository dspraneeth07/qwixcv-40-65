
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DocumentVerifier from '@/components/blockchain/DocumentVerifier';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Fingerprint, QrCode } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';

const VerifyDocument = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const [isScanning, setIsScanning] = useState(false);
  
  useEffect(() => {
    // If this is a QR code scan request, we could initialize a QR scanner here
    if (uniqueId === 'scan') {
      setIsScanning(true);
    }
  }, [uniqueId]);
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Fingerprint className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Blockchain Document Verification</h1>
            <p className="text-muted-foreground mt-2">
              Verify the authenticity and integrity of documents secured on the blockchain
            </p>
          </div>
          
          {isScanning ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Scan QR Code
                </CardTitle>
                <CardDescription>
                  Scan a document QR code to verify its authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    QR scanner would be implemented here in a production environment
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For demonstration purposes, please enter the document unique ID manually
                  </p>
                </div>
                
                <DocumentVerifier />
              </CardContent>
            </Card>
          ) : (
            <DocumentVerifier uniqueId={uniqueId} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyDocument;

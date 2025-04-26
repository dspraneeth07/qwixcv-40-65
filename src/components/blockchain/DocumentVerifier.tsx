
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useBlockchain } from '@/context/BlockchainContext';
import type { DocumentVerification } from '@/types/blockchain';
import { Search, CheckCircle, XCircle, Loader2, QrCode, ExternalLink, Fingerprint } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import QRCode from 'qrcode.react';

interface DocumentVerifierProps {
  uniqueId?: string;
}

const DocumentVerifier: React.FC<DocumentVerifierProps> = ({ uniqueId: initialUniqueId }) => {
  const [uniqueIdInput, setUniqueIdInput] = useState(initialUniqueId || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<DocumentVerification | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  
  const { verifyDocument, generateQrCodeForDocument } = useBlockchain();
  const { toast } = useToast();
  
  // Auto-verify when component mounts with a uniqueId
  useEffect(() => {
    if (initialUniqueId && !verificationResult) {
      handleVerify();
    }
  }, [initialUniqueId]);
  
  const handleVerify = async () => {
    if (!uniqueIdInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a document unique ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      // Add a small delay to prevent UI freezing
      setTimeout(async () => {
        try {
          const result = await verifyDocument(uniqueIdInput.trim());
          setVerificationResult(result);
          
          if (result.isValid) {
            toast({
              title: "Document Verified",
              description: "The document is valid and was found on the blockchain",
            });
          } else {
            toast({
              title: "Verification Failed",
              description: result.error || "Document could not be verified",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast({
            title: "Verification Error",
            description: "An unexpected error occurred during verification",
            variant: "destructive"
          });
        } finally {
          setIsVerifying(false);
        }
      }, 100);
    } catch (error) {
      console.error("Verification setup error:", error);
      setIsVerifying(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const verificationUrl = verificationResult?.document 
    ? `${window.location.origin}/verify-document/${verificationResult.document.uniqueId}`
    : '';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Fingerprint className="h-5 w-5 mr-2 text-primary" />
          Document Verification
        </CardTitle>
        <CardDescription>
          Verify the authenticity of a document using its unique blockchain identity
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input
              placeholder="Enter document unique ID..."
              value={uniqueIdInput}
              onChange={(e) => setUniqueIdInput(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Verify</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowQrCode(!showQrCode)}
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showQrCode && !verificationResult && (
          <div className="flex flex-col items-center justify-center space-y-3 p-4 border rounded-md">
            <p className="text-sm text-muted-foreground">Scan a document's QR code to verify</p>
            <div className="bg-white p-4 rounded">
              <QRCode 
                value={`${window.location.origin}/verify-document/scan`} 
                size={150}
                renderAs="svg"
                level="H"
              />
            </div>
          </div>
        )}
        
        {verificationResult && (
          <div className="mt-4 space-y-4">
            {verificationResult.isValid ? (
              <>
                <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Document Verified</AlertTitle>
                  <AlertDescription className="text-green-700">
                    This document is authentic and has been verified on the blockchain.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4 border p-4 rounded-md">
                  <div>
                    <h3 className="font-medium text-lg">{verificationResult.document?.fileName}</h3>
                    {verificationResult.document?.description && (
                      <p className="text-sm text-muted-foreground">{verificationResult.document.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Document ID:</span>
                        <p className="text-sm font-mono">{verificationResult.document?.uniqueId}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">File Type:</span>
                        <p className="text-sm">{verificationResult.document?.fileType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Timestamp:</span>
                        <p className="text-sm">{formatDate(verificationResult.document?.timestamp || '')}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Blockchain Hash:</span>
                        <p className="text-sm font-mono truncate">{verificationResult.document?.blockchainHash}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Owner Address:</span>
                        <p className="text-sm font-mono truncate">{verificationResult.document?.ownerAddress}</p>
                      </div>
                      {verificationResult.document?.ipfsUri && (
                        <div>
                          <span className="text-sm font-medium">IPFS Hash:</span>
                          <p className="text-sm font-mono truncate">{verificationResult.document.ipfsUri.replace('ipfs://', '')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="text-center">
                      <h4 className="text-sm font-medium mb-2">Verification QR Code</h4>
                      <div className="bg-white inline-block p-3 border rounded">
                        <QRCode 
                          value={verificationUrl} 
                          size={150}
                          renderAs="svg"
                          level="H"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Scan to verify this document</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  {verificationResult.error || "This document could not be verified on the blockchain."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col space-y-4 text-center text-sm text-muted-foreground">
        <div className="w-full h-px bg-border"></div>
        <p>
          QwixMask blockchain verification ensures tamper-proof document authentication
          using secure cryptographic proofs and unique identity verification.
        </p>
      </CardFooter>
    </Card>
  );
};

export default DocumentVerifier;

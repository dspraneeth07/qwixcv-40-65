
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Search, QrCode, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Certificate } from "@/types/certification";
import { verifyCertificate } from "@/utils/blockchain";

interface CertificateVerifierProps {
  initialHash?: string;
}

const CertificateVerifier = ({ initialHash }: CertificateVerifierProps) => {
  const [certHash, setCertHash] = useState(initialHash || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    isValid: boolean;
    certificate?: Certificate;
    error?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!certHash.trim()) {
      toast({
        title: "Error",
        description: "Please enter a certificate hash",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    setResult(null);
    
    try {
      const verificationResult = await verifyCertificate(certHash);
      setResult(verificationResult);
    } catch (error) {
      setResult({
        isValid: false,
        error: "Failed to verify the certificate. Try again later."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <div className="flex items-center justify-center mb-3">
          <Shield className="h-7 w-7 text-green-600 mr-2" />
          <CardTitle>Certificate Verification</CardTitle>
        </div>
        <CardDescription>
          Verify the authenticity of a QwiXCertChain certificate using its unique hash
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                placeholder="Enter certificate hash..." 
                value={certHash}
                onChange={(e) => setCertHash(e.target.value)}
              />
            </div>
            <Button onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Verify</span>
            </Button>
            <Button variant="outline">
              <QrCode className="h-4 w-4" />
              <span className="sr-only">Scan QR</span>
            </Button>
          </div>
          
          {result && (
            <div className="mt-6">
              {result.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Error</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              ) : result.isValid ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Certificate Verified</AlertTitle>
                    <AlertDescription className="text-green-700">
                      This certificate is authentic and has been verified on the blockchain.
                    </AlertDescription>
                  </Alert>
                  
                  {result.certificate && (
                    <Card>
                      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-green-50">
                        <CardTitle className="text-lg">{result.certificate.title}</CardTitle>
                        <CardDescription>
                          Issued on {new Date(result.certificate.issuedDate).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium">Recipient:</span>
                            <span>{result.certificate.recipientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Score:</span>
                            <span>{result.certificate.score}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Blockchain Transaction:</span>
                            <a 
                              href={`https://polygonscan.com/tx/${result.certificate.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm font-mono"
                            >
                              {result.certificate.txHash.substring(0, 8)}...
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Certificate</AlertTitle>
                  <AlertDescription>
                    This certificate could not be verified. It may be invalid or tampered with.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        <div className="w-full h-px bg-border"></div>
        <div className="text-sm text-muted-foreground text-center">
          QwiXCertChain uses blockchain technology to ensure certificates are tamper-proof and verifiable.
        </div>
      </CardFooter>
    </Card>
  );
};

export default CertificateVerifier;

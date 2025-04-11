
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, QrCode, AlertCircle, CheckCircle, XCircle, Loader2, ExternalLink, Info, Calendar, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Certificate, BlockchainTransaction } from "@/types/certification";
import { verifyCertificate } from "@/utils/blockchain";
import QRCode from 'qrcode.react';

interface CertificateVerifierProps {
  initialHash?: string;
}

const CertificateVerifier = ({ initialHash }: CertificateVerifierProps) => {
  const [certHash, setCertHash] = useState(initialHash || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [result, setResult] = useState<{
    isValid: boolean;
    certificate?: Certificate;
    transaction?: BlockchainTransaction;
    error?: string;
  } | null>(null);
  const { toast } = useToast();

  // Auto-verify if initialHash is provided
  useEffect(() => {
    if (initialHash) {
      handleVerify();
    }
  }, [initialHash]);

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const verificationUrl = result?.certificate 
    ? `${window.location.origin}/verify-cert/${result.certificate.certHash}` 
    : '';

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
            <Button variant="outline" onClick={() => setShowQR(!showQR)}>
              <QrCode className="h-4 w-4" />
              <span className="sr-only">Scan QR</span>
            </Button>
          </div>
          
          {showQR && !result?.certificate && (
            <div className="flex flex-col items-center justify-center space-y-3 p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Scan a QR code to verify a certificate</p>
              <div className="bg-white p-3 rounded-lg border">
                <QRCode value="https://qwixzen.com/verify-certificate" size={150} />
              </div>
            </div>
          )}
          
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
                    <>
                      <Card className="overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-6 text-white">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">QwiXCertChain</h2>
                            <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                              Blockchain Verified
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">{result.certificate.title}</h3>
                          <p className="opacity-90">Awarded to</p>
                          <p className="text-xl font-semibold mb-3">{result.certificate.recipientName}</p>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xs opacity-80">Issued By</p>
                              <p className="font-medium">{result.certificate.issuer}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-80">Issue Date</p>
                              <p className="font-medium">{formatDate(result.certificate.issuedDate)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Certificate Details</h4>
                                <div className="space-y-2 mt-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Recipient:</span>
                                    <span className="text-sm">{result.certificate.recipientName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Email:</span>
                                    <span className="text-sm">{result.certificate.recipientEmail}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Score:</span>
                                    <span className="text-sm">{result.certificate.score}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Issued On:</span>
                                    <span className="text-sm">{formatDate(result.certificate.issuedDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Certificate ID:</span>
                                    <span className="text-sm font-mono">{result.certificate.uniqueId}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Blockchain Verification</h4>
                                <div className="space-y-2 mt-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Network:</span>
                                    <span className="text-sm">{result.certificate.blockchainNetwork}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Transaction:</span>
                                    <a 
                                      href={`https://polygonscan.com/tx/${result.certificate.txHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm font-mono flex items-center"
                                    >
                                      {result.certificate.txHash.substring(0, 6)}...
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </div>
                                  {result.transaction && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">Block Number:</span>
                                        <span className="text-sm font-mono">{result.transaction.blockNumber}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">Confirmations:</span>
                                        <span className="text-sm">{result.transaction.confirmations}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">Status:</span>
                                        <Badge variant={result.transaction.status === 'confirmed' ? 'default' : 'outline'} className="text-xs">
                                          {result.transaction.status}
                                        </Badge>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-center">
                            <div className="text-center">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Verification QR Code</h4>
                              <div className="bg-white p-3 rounded-lg border inline-block">
                                <QRCode value={verificationUrl} size={150} />
                                <p className="text-xs text-muted-foreground mt-2">Scan to verify certificate</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>How to Verify</AlertTitle>
                        <AlertDescription>
                          This certificate has been cryptographically secured on the {result.certificate.blockchainNetwork}.
                          You can verify its authenticity by checking the transaction on{' '}
                          <a 
                            href={`https://polygonscan.com/tx/${result.certificate.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Polygonscan
                          </a>.
                        </AlertDescription>
                      </Alert>
                    </>
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
          Each certificate is minted as a digital asset on the Polygon blockchain.
        </div>
      </CardFooter>
    </Card>
  );
};

export default CertificateVerifier;

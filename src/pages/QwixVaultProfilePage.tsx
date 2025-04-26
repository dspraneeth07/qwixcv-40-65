
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, User, Fingerprint } from "lucide-react";
import { getUserDocuments } from '@/utils/blockchainDocuments';
import { BlockchainDocument } from '@/types/blockchain';
import DocumentsDashboard from '@/components/blockchain/DocumentsDashboard';
import QRCode from 'qrcode.react';

interface ProfileParams {
  address: string;
}

const QwixVaultProfilePage = () => {
  const { address } = useParams<ProfileParams>();
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Generate a unique QwixVault ID from the address
  const qwixVaultId = address ? 
    `QV-${address.substring(2, 6)}-${address.substring(address.length - 4)}` : null;
  
  // Generate verification URL
  const verificationUrl = address ? 
    `${window.location.origin}/verify-document/${address}` : '';
  
  useEffect(() => {
    if (address) {
      // Get documents for this address
      const allDocs = getUserDocuments();
      const userDocs = allDocs.filter(doc => doc.ownerAddress.toLowerCase() === address.toLowerCase());
      setDocuments(userDocs);
      setLoading(false);
    }
  }, [address]);
  
  if (!address) {
    return (
      <MainLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <Shield className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Invalid Profile</h2>
              <p className="text-muted-foreground text-center">
                No wallet address provided. Please scan a valid QwixVault QR code.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-2">QwixVault Profile</h1>
        <p className="text-muted-foreground mb-6">
          Blockchain-verified documents and digital identity
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  QwixVault Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <div className="bg-primary/10 rounded-full p-6 mb-4">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">QwixVault User</h3>
                  <p className="font-mono text-sm my-2">{qwixVaultId}</p>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Wallet Address:</span>
                    <p className="font-mono text-sm break-all mt-1">
                      {address}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Verification QR:</span>
                    <div className="bg-white p-2 rounded-lg mt-1 flex justify-center">
                      <QRCode value={verificationUrl} size={120} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="documents">
              <TabsList>
                <TabsTrigger value="documents" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="credentials" className="flex items-center">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Credentials
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="pt-4">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Blockchain Verified Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {documents.map(doc => (
                        <Card key={doc.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{doc.fileName}</h4>
                              <div className={`h-2 w-2 rounded-full ${
                                doc.blockchainStatus === 'verified' ? 'bg-green-500' :
                                doc.blockchainStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(doc.timestamp).toLocaleString()}
                            </div>
                            <div className="text-xs mt-2 font-mono truncate">
                              ID: {doc.id.substring(0, 8)}...
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No blockchain documents found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="credentials" className="pt-4">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <Fingerprint className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No credentials found</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default QwixVaultProfilePage;

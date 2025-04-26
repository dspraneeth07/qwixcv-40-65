
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlockchain } from '@/context/BlockchainContext';
import { BlockchainDocument } from '@/types/blockchain';
import { getUserDocumentsByOwner } from '@/utils/blockchainDocuments';
import { Fingerprint, Shield, FileText, Calendar, Download, ExternalLink, Share2, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentVerifier from '@/components/blockchain/DocumentVerifier';

const QwixVaultProfile = () => {
  const { address } = useParams<{ address: string }>();
  const { account } = useBlockchain();
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [profileDetails, setProfileDetails] = useState<{
    name: string | null;
    email: string | null;
    qwixVaultId: string | null;
  }>({
    name: null,
    email: null,
    qwixVaultId: null
  });
  
  // Load user documents and profile details
  useEffect(() => {
    if (address) {
      // Get documents for this wallet address
      const userDocs = getUserDocumentsByOwner(address);
      setDocuments(userDocs);
      
      // Check if current user is the profile owner
      setIsOwner(account?.toLowerCase() === address.toLowerCase());
      
      // Extract profile details from documents if available
      const profileDoc = userDocs.find(doc => doc.userName || doc.userEmail);
      if (profileDoc) {
        setProfileDetails({
          name: profileDoc.userName || null,
          email: profileDoc.userEmail || null,
          qwixVaultId: profileDoc.userId ? `QV-${profileDoc.userId.substring(0, 4)}-${btoa(profileDoc.userEmail || '').replace(/[/+=]/g, '').substring(0, 8)}` : null
        });
      }
    }
  }, [address, account]);
  
  const formatFileType = (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF Document';
    if (fileType.includes('png')) return 'PNG Image';
    if (fileType.includes('jpeg') || fileType.includes('jpg')) return 'JPEG Image';
    return fileType;
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">QwixVault Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  QwixVault Profile
                </CardTitle>
                <CardDescription>
                  Blockchain-secured document vault
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {profileDetails.qwixVaultId || `QV-${address?.substring(2, 6) || ''}`}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {profileDetails.name && (
                        <p className="text-sm">{profileDetails.name}</p>
                      )}
                      {profileDetails.email && (
                        <p className="text-sm text-muted-foreground">{profileDetails.email}</p>
                      )}
                      <Badge variant="outline" className="font-mono text-xs w-fit mt-1">
                        {address}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3">
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold">{documents.length}</h4>
                      <p className="text-xs text-muted-foreground">Documents</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold">100%</h4>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <Button asChild className="w-full">
                      <a href="/blockchain-vault">
                        <Fingerprint className="mr-2 h-4 w-4" />
                        Manage Your Vault
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Document Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentVerifier />
              </CardContent>
            </Card>
          </div>
          
          {/* Documents */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="documents">
              <TabsList className="mb-6">
                <TabsTrigger value="documents" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents">
                <div className="space-y-6">
                  {documents.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg border-dashed">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No documents found in this vault</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <Card key={doc.uniqueId}>
                          <CardContent className="p-0">
                            <div className="flex items-start p-4 gap-4">
                              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="h-8 w-8 text-slate-400" />
                              </div>
                              
                              <div className="flex-grow">
                                <h3 className="font-medium mb-1">{doc.fileName}</h3>
                                {doc.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                                )}
                                
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <Badge variant="outline">
                                    {formatFileType(doc.fileType)}
                                  </Badge>
                                  <Badge variant="outline">
                                    {formatBytes(doc.fileSize)}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(doc.timestamp)}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" title="Download">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" title="Share">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" title="Verify" asChild>
                                  <a href={`/verify-document/${doc.uniqueId}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                            
                            <div className="px-4 py-3 bg-muted/20 text-xs border-t">
                              <div className="font-mono">
                                ID: {doc.uniqueId} | TX: {doc.blockchainHash.substring(0, 10)}...{doc.blockchainHash.substring(doc.blockchainHash.length - 5)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={`activity-${doc.uniqueId}`} className="flex items-center gap-4 border-b pb-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium">
                          Document uploaded: {doc.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(doc.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No activity found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QwixVaultProfile;

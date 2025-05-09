
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Link, QrCode, Shield, Database, Upload, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentVerifier from "@/components/blockchain/DocumentVerifier";

interface VerifiedDocument {
  id: string;
  type: string;
  name: string;
  issuedBy: string;
  issuedTo: string;
  issuedDate: string;
  expiryDate?: string;
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  blockchainRef: string;
}

const BlockchainVerification = () => {
  const [activeTab, setActiveTab] = useState('verify');
  const [uniqueId, setUniqueId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Mock data for verified documents
  const verifiedDocuments: VerifiedDocument[] = [
    {
      id: 'doc-1',
      type: 'Education Certificate',
      name: 'Bachelor of Technology',
      issuedBy: 'University of Technology',
      issuedTo: 'John Smith',
      issuedDate: '2018-05-15',
      status: 'verified',
      blockchainRef: 'Qmx72bF9...'
    },
    {
      id: 'doc-2',
      type: 'Experience Letter',
      name: 'Software Engineer - ABC Corp',
      issuedBy: 'ABC Corporation',
      issuedTo: 'John Smith',
      issuedDate: '2022-02-10',
      status: 'verified',
      blockchainRef: 'QmUqzpR7...'
    },
    {
      id: 'doc-3',
      type: 'Certification',
      name: 'AWS Solutions Architect',
      issuedBy: 'Amazon Web Services',
      issuedTo: 'Sarah Williams',
      issuedDate: '2021-07-22',
      expiryDate: '2024-07-22',
      status: 'verified',
      blockchainRef: 'QmaPhRwZ...'
    },
    {
      id: 'doc-4',
      type: 'Experience Letter',
      name: 'Project Manager - XYZ Inc.',
      issuedBy: 'XYZ Inc.',
      issuedTo: 'Michael Johnson',
      issuedDate: '2023-01-05',
      status: 'pending',
      blockchainRef: 'QmZpX9v4...'
    },
    {
      id: 'doc-5',
      type: 'Education Certificate',
      name: 'Master of Business Administration',
      issuedBy: 'Business School',
      issuedTo: 'Emily Brown',
      issuedDate: '2020-06-30',
      status: 'verified',
      blockchainRef: 'QmrT7nQ9...'
    }
  ];

  const handleVerify = () => {
    if (!uniqueId.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a document ID to verify",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      setActiveTab('results');
      
      toast({
        title: "Document Found",
        description: "Document has been successfully verified on blockchain",
      });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-500 border-red-500">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Document Verification</h1>
          <p className="text-muted-foreground">Verify and manage candidate documents using blockchain technology</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verify">
            <Shield className="h-4 w-4 mr-2" />
            Verify Document
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload To Blockchain
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            <Database className="h-4 w-4 mr-2" />
            Verification Dashboard
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="verify" className="space-y-4">
          <DocumentVerifier />
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Document Verified</CardTitle>
                  <CardDescription>This document is authentic and has been verified on the blockchain</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Document Type</h3>
                    <p className="text-lg font-medium">Education Certificate</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Document Name</h3>
                    <p className="text-lg font-medium">Bachelor of Technology in Computer Science</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issued By</h3>
                    <p className="text-lg font-medium">University of Technology</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issued To</h3>
                    <p className="text-lg font-medium">John Smith</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issued Date</h3>
                    <p className="text-lg font-medium">May 15, 2018</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Blockchain Reference</h3>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded-md">
                      Qmx72bF9HtK8LmRQcr6G5J2kNpLj8CcXm9N3XwEBp5HfGn
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 font-medium">Verified on Blockchain</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-green-800">Security Information</p>
                    <p className="text-sm text-green-700 mt-1">
                      This document was securely stored on the blockchain on May 15, 2018 at 10:23 AM GMT.
                      The document's fingerprint (hash) was calculated using SHA-256 and stored immutably.
                      Any tampering with the document would change its hash and invalidate verification.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR
                  </Button>
                  <Button variant="outline">
                    <Link className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document to Blockchain</CardTitle>
              <CardDescription>
                Securely store documents on the blockchain for immutable verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <select className="w-full rounded-md border border-input bg-transparent px-3 py-2">
                    <option>Education Certificate</option>
                    <option>Experience Letter</option>
                    <option>ID Proof</option>
                    <option>Certification</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input id="documentName" placeholder="Enter document name" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issuedBy">Issued By</Label>
                    <Input id="issuedBy" placeholder="Organization/Institute name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuedTo">Issued To</Label>
                    <Input id="issuedTo" placeholder="Recipient name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuedDate">Issue Date</Label>
                    <Input id="issuedDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                    <Input id="expiryDate" type="date" />
                  </div>
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Upload Document</h3>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports PDF, JPG, PNG (Max size: 10MB)
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                      Select File
                    </Button>
                    <input 
                      id="file-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => {
                toast({
                  title: "Document uploaded",
                  description: "Document has been successfully uploaded to the blockchain"
                });
              }}>
                Upload to Blockchain
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Verification Dashboard</CardTitle>
                  <CardDescription>
                    Manage and track all blockchain-verified documents
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-8 w-[200px] md:w-[300px]"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Issued By</TableHead>
                    <TableHead>Issued To</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifiedDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(doc.status)}
                          {getStatusBadge(doc.status)}
                        </div>
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>{doc.issuedBy}</TableCell>
                      <TableCell>{doc.issuedTo}</TableCell>
                      <TableCell>{new Date(doc.issuedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockchainVerification;


import React, { useState, useEffect } from 'react';
import { useBlockchain } from '@/context/BlockchainContext';
import { getUserDocuments, updateDocumentMetadata, deleteDocument, refreshDocumentStatus } from '@/utils/blockchainDocuments';
import { BlockchainDocument } from '@/types/blockchain';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  FileCertificate,
  FileImage,
  Edit,
  Trash2,
  RefreshCw,
  Check,
  Clock,
  QrCode,
  FileCode,
  Copy,
  Link2,
  AlertCircle,
  Search
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import QRCode from 'qrcode.react';

export const DocumentsDashboard: React.FC = () => {
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDocument, setEditingDocument] = useState<BlockchainDocument | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isMetadataDialogOpen, setIsMetadataDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<BlockchainDocument | null>(null);
  const [documentToShowQr, setDocumentToShowQr] = useState<BlockchainDocument | null>(null);
  const [documentToShowMetadata, setDocumentToShowMetadata] = useState<BlockchainDocument | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [refreshingDocId, setRefreshingDocId] = useState<string | null>(null);
  const { account } = useBlockchain();
  const { toast } = useToast();

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = () => {
      setIsLoading(true);
      try {
        const docs = getUserDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error loading documents",
          description: "Failed to load your blockchain documents",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [account, toast]);

  // Handle document editing
  const openEditDialog = (document: BlockchainDocument) => {
    setEditingDocument(document);
    setEditName(document.fileName);
    setEditDescription(document.description || '');
    setIsEditDialogOpen(true);
  };

  const saveEditedDocument = async () => {
    if (!editingDocument) return;
    
    try {
      const updatedDoc = await updateDocumentMetadata(
        editingDocument.id,
        {
          fileName: editName,
          description: editDescription
        }
      );
      
      setDocuments(prev => 
        prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc)
      );
      
      toast({
        title: "Document updated",
        description: "Document metadata has been updated successfully"
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Update failed",
        description: "Failed to update document metadata",
        variant: "destructive"
      });
    }
  };

  // Handle document deletion
  const openDeleteDialog = (document: BlockchainDocument) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(documentToDelete.id);
      
      setDocuments(prev => 
        prev.filter(doc => doc.id !== documentToDelete.id)
      );
      
      toast({
        title: "Document deleted",
        description: "Document has been removed from the blockchain"
      });
      
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete the document",
        variant: "destructive"
      });
    }
  };

  // Show QR code dialog
  const openQrDialog = (document: BlockchainDocument) => {
    setDocumentToShowQr(document);
    setIsQrDialogOpen(true);
  };

  // Show metadata dialog
  const openMetadataDialog = (document: BlockchainDocument) => {
    setDocumentToShowMetadata(document);
    setIsMetadataDialogOpen(true);
  };

  // Refresh document blockchain status
  const handleRefreshStatus = async (documentId: string) => {
    setRefreshingDocId(documentId);
    
    try {
      const updatedDoc = await refreshDocumentStatus(documentId);
      
      setDocuments(prev => 
        prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc)
      );
      
      toast({
        title: "Status updated",
        description: "Document blockchain status has been refreshed"
      });
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast({
        title: "Refresh failed",
        description: "Failed to refresh document status",
        variant: "destructive"
      });
    } finally {
      setRefreshingDocId(null);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard`
    });
  };

  // Generate verification URL for sharing
  const getVerificationUrl = (document: BlockchainDocument) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/verify-cert/${document.blockchainHash}`;
  };

  // Get document icon based on file type
  const getDocumentIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-8 w-8 text-primary" />;
    } else if (fileType.includes('image')) {
      return <FileImage className="h-8 w-8 text-primary" />;
    } else if (fileType.includes('certificate')) {
      return <FileCertificate className="h-8 w-8 text-primary" />;
    } else {
      return <FileCode className="h-8 w-8 text-primary" />;
    }
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    doc.blockchainHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-[180px] mb-2" />
                <Skeleton className="h-4 w-[120px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[250px]"
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          {documents.length} document{documents.length !== 1 ? 's' : ''} stored on blockchain
        </div>
      </div>
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-secondary/20 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/30 mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 
              "Try adjusting your search term or upload new documents" : 
              "Upload a document to the blockchain to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex-1 pr-4">
                    <CardTitle className="text-base truncate">{document.fileName}</CardTitle>
                    <CardDescription className="truncate">
                      {new Date(document.timestamp).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {document.blockchainStatus === 'verified' ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
                        <Check className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/10">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    {getDocumentIcon(document.fileType)}
                  </div>
                  
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="text-sm flex items-center gap-1">
                      <span className="text-muted-foreground">Hash:</span>
                      <span className="font-mono text-xs truncate">
                        {document.blockchainHash.substring(0, 10)}...
                      </span>
                      <button 
                        onClick={() => copyToClipboard(document.blockchainHash, 'Hash')}
                        className="hover:text-primary"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <div className="text-sm flex items-center gap-1">
                      <span className="text-muted-foreground">Block:</span>
                      <span className="font-mono text-xs">{document.blockId}</span>
                    </div>
                    
                    {document.description && (
                      <div className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {document.description}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between gap-2 pt-0">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openQrDialog(document)}>
                    <QrCode className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={() => openMetadataDialog(document)}>
                    <Search className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRefreshStatus(document.id)}
                    disabled={refreshingDocId === document.id}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshingDocId === document.id ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(document)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => openDeleteDialog(document)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document metadata. The blockchain hash will remain unchanged.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Document Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter document description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedDocument}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              This will remove the document from your blockchain vault. This action marks the document as revoked on the blockchain and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm font-medium">
              Are you sure you want to delete "{documentToDelete?.fileName}"?
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteDocument}>Delete Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blockchain Verification QR</DialogTitle>
            <DialogDescription>
              Share this QR code to allow others to verify the authenticity of your document.
            </DialogDescription>
          </DialogHeader>
          
          {documentToShowQr && (
            <div className="py-4 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCode 
                  value={getVerificationUrl(documentToShowQr)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="w-full">
                <div className="flex items-center justify-between bg-secondary/20 p-2 rounded mb-2">
                  <span className="text-sm font-mono truncate mr-2">{getVerificationUrl(documentToShowQr)}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(getVerificationUrl(documentToShowQr), 'Verification URL')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button className="w-full" onClick={() => {
                  window.open(getVerificationUrl(documentToShowQr), '_blank');
                }}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Open Verification Page
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Document Metadata Dialog */}
      <Dialog open={isMetadataDialogOpen} onOpenChange={setIsMetadataDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Metadata</DialogTitle>
            <DialogDescription>
              Detailed blockchain information about this document.
            </DialogDescription>
          </DialogHeader>
          
          {documentToShowMetadata && (
            <div className="py-2 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Document Information</h4>
                <div className="bg-secondary/20 rounded-md p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="col-span-2 font-medium">{documentToShowMetadata.fileName}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="col-span-2">{documentToShowMetadata.fileType}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="col-span-2">{(documentToShowMetadata.fileSize / 1024).toFixed(2)} KB</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span className="col-span-2">{new Date(documentToShowMetadata.timestamp).toLocaleString()}</span>
                  </div>
                  
                  {documentToShowMetadata.description && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Description:</span>
                      <span className="col-span-2">{documentToShowMetadata.description}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Blockchain Data</h4>
                <div className="bg-secondary/20 rounded-md p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Hash:</span>
                    <div className="col-span-2 flex items-center gap-1">
                      <span className="font-mono text-xs break-all">{documentToShowMetadata.blockchainHash}</span>
                      <button 
                        onClick={() => copyToClipboard(documentToShowMetadata.blockchainHash, 'Hash')}
                        className="hover:text-primary"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Document ID:</span>
                    <div className="col-span-2 flex items-center gap-1">
                      <span className="font-mono text-xs">{documentToShowMetadata.id}</span>
                      <button 
                        onClick={() => copyToClipboard(documentToShowMetadata.id, 'Document ID')}
                        className="hover:text-primary"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Block ID:</span>
                    <span className="col-span-2 font-mono">{documentToShowMetadata.blockId}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="col-span-2">
                      {documentToShowMetadata.blockchainStatus === 'verified' ? (
                        <span className="text-green-600 flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="text-orange-600 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Owner:</span>
                    <div className="col-span-2 flex items-center gap-1">
                      <span className="font-mono text-xs truncate">{documentToShowMetadata.ownerAddress}</span>
                      <button 
                        onClick={() => copyToClipboard(documentToShowMetadata.ownerAddress, 'Owner Address')}
                        className="hover:text-primary"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="col-span-2">Polygon Mumbai</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

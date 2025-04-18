
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, FileImage, X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { uploadDocumentToBlockchain } from '@/utils/blockchainDocuments';
import { useBlockchain } from '@/context/BlockchainContext';
import DocumentUploadPreview from './DocumentUploadPreview';

interface DocumentUploaderProps {
  onUploadComplete: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadComplete }) => {
  const [documentName, setDocumentName] = useState('');
  const [documentDesc, setDocumentDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { account } = useBlockchain();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, PNG, or JPEG file",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // PDF icon or preview
        setFilePreview(null);
      }
      
      // Use filename as default document name (without extension)
      if (!documentName) {
        const filename = selectedFile.name.split('.').slice(0, -1).join('.');
        setDocumentName(filename);
      }
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 300);
    
    return interval;
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!documentName.trim()) {
      toast({
        title: "Missing document name",
        description: "Please provide a name for your document",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Simulate upload progress
      const progressInterval = simulateUploadProgress();
      
      // Simulate blockchain upload with a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Upload to blockchain
      const result = await uploadDocumentToBlockchain({
        fileName: documentName,
        description: documentDesc,
        fileType: file.type,
        fileSize: file.size,
        ownerAddress: account || '',
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Show success toast
      toast({
        title: "Document secured on-chain successfully 🚀",
        description: `Document "${documentName}" has been uploaded and secured on the blockchain`,
      });
      
      // Reset form
      setTimeout(() => {
        setDocumentName('');
        setDocumentDesc('');
        clearFile();
        setIsUploading(false);
        setUploadProgress(0);
        onUploadComplete();
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive"
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="space-y-6">
      <DocumentUploadPreview 
        file={file}
        filePreview={filePreview}
        clearFile={clearFile}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Document File</Label>
          <div className="mt-1">
            <Button
              type="button"
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center border-dashed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-5 w-5 mb-2" />
              {file ? file.name : "Upload a PDF, PNG, or JPEG file"}
              <span className="text-xs text-muted-foreground mt-1">
                Max file size: 5MB
              </span>
            </Button>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-name">Document Name</Label>
          <Input
            id="document-name"
            placeholder="e.g., Resume, Certificate, Transcript"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            maxLength={50}
            disabled={isUploading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-desc">Description (Optional)</Label>
          <Textarea
            id="document-desc"
            placeholder="e.g., University degree certificate, Work experience letter"
            value={documentDesc}
            onChange={(e) => setDocumentDesc(e.target.value)}
            rows={3}
            maxLength={200}
            disabled={isUploading}
          />
        </div>
        
        <Button 
          className="w-full"
          onClick={handleUpload}
          disabled={isUploading || !file || !documentName.trim()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Securing on blockchain...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload to Blockchain
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

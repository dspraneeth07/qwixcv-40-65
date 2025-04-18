
import { useState } from 'react';
import { Upload, File, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface ResumeUploaderProps {
  onResumeProcessed: (resumeText: string, resumeFileName: string) => void;
  isProcessing: boolean;
}

const ResumeUploader = ({ onResumeProcessed, isProcessing }: ResumeUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [processingText, setProcessingText] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      simulateUpload(selectedFile);
    }
  };

  const simulateUpload = async (file: File) => {
    // Reset progress
    setUploadProgress(0);
    setProcessingText('Starting upload...');
    
    // Simulate upload progress
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 200));
      setUploadProgress(i * 10);
      
      if (i === 5) setProcessingText('Uploading file...');
      if (i === 8) setProcessingText('Processing PDF...');
      if (i === 10) setProcessingText('Extracting text...');
    }
    
    // Now actually process the PDF
    extractTextFromPDF(file);
  };

  const extractTextFromPDF = async (file: File) => {
    try {
      setProcessingText('Analyzing content...');
      
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // For now, we'll use a mock implementation that converts the PDF to text
      // In a real implementation, you would use a library like pdf.js
      const pdfText = await mockPdfToText(arrayBuffer);
      
      setProcessingText('Analysis complete!');
      onResumeProcessed(pdfText, file.name);
      
      toast({
        title: "Resume processed successfully",
        description: `"${file.name}" has been analyzed and is ready for your interview`,
      });
      
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      toast({
        title: "Processing failed",
        description: "Failed to extract text from the PDF",
        variant: "destructive"
      });
    }
  };

  // Mock PDF to text conversion (would use pdf.js in production)
  const mockPdfToText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    // In a real implementation, this would convert the PDF to text
    // For now, return the first 5KB of the file as a string
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuffer.slice(0, 5000));
    
    // Simulate processing time
    await new Promise(r => setTimeout(r, 1500));
    
    return text;
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex flex-col items-center text-center">
        {!file ? (
          <>
            <div className="mb-4 p-6 border-2 border-dashed rounded-lg flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Upload your resume</p>
              <p className="text-xs text-muted-foreground mb-4">Drag and drop or click to browse</p>
              <Button variant="outline" className="relative">
                Select PDF
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported format: PDF up to 5MB
            </p>
          </>
        ) : (
          <div className="w-full">
            <div className="mb-3 p-3 bg-muted rounded-lg flex items-center">
              <File className="h-5 w-5 text-blue-500 mr-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
              </div>
              {uploadProgress < 100 ? (
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setFile(null)}
                    disabled={uploadProgress > 0 && uploadProgress < 100}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>{processingText}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;

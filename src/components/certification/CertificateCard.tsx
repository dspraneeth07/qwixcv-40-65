
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Award, Download, Share2, Link, Eye, EyeOff, QrCode, Loader2 } from "lucide-react";
import { Certificate } from "@/types/certification";
import { generateCertificatePDF, shareCertificate } from "@/utils/blockchain";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import QRCode from 'qrcode.react';

interface CertificateCardProps {
  certificate: Certificate;
  onUpdateVisibility: (certificateId: string, isPublic: boolean) => void;
}

const CertificateCard = ({ certificate, onUpdateVisibility }: CertificateCardProps) => {
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { id, title, score, issuedDate, txHash, isPublic, certHash, blockId } = certificate;
  
  const verificationUrl = `${window.location.origin}/verify-cert/${certHash}`;
  
  const toggleVisibility = () => {
    onUpdateVisibility(id, !isPublic);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationUrl);
    toast({
      title: "Link Copied",
      description: "Certificate verification link copied to clipboard",
    });
  };
  
  const handleDownloadPDF = async () => {
    setIsLoading(true);
    
    try {
      // Create temporary div for PDF generation if not in view
      const tempDiv = document.createElement('div');
      tempDiv.id = `temp-cert-${id}`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Create simplified certificate design for PDF
      tempDiv.innerHTML = `
        <div style="padding: 30px; font-family: Arial, sans-serif; color: white; background: linear-gradient(to right, #3b82f6, #8b5cf6); width: 800px; height: 600px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <h2 style="font-size: 24px; font-weight: bold;">QwiXCertChain</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.4);">
              Blockchain Verified
            </div>
          </div>
          <h3 style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">${title}</h3>
          <p style="opacity: 0.9;">Awarded to</p>
          <p style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">${certificate.recipientName}</p>
          <p style="font-size: 16px; margin-top: 30px;">Issued by: ${certificate.issuer}</p>
          <p style="font-size: 16px;">Issue Date: ${new Date(issuedDate).toLocaleDateString()}</p>
          <p style="font-size: 16px;">Certificate ID: ${certificate.uniqueId}</p>
          <p style="font-size: 16px;">Score: ${score}%</p>
          <div style="margin-top: 20px; font-size: 12px;">
            <p>Blockchain: ${certificate.blockchainNetwork}</p>
            <p>Transaction: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 5)}</p>
            <p>Block ID: ${blockId || 'N/A'}</p>
          </div>
          <p style="position: absolute; bottom: 20px; text-align: center; width: 90%; font-size: 12px;">
            Verify this certificate at: ${verificationUrl}
          </p>
        </div>
      `;
      
      const fileName = `${title.replace(/\s+/g, '_')}_Certificate.pdf`;
      await generateCertificatePDF(`temp-cert-${id}`, fileName);
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded as a PDF",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download certificate as PDF",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShareCertificate = async () => {
    setIsSharing(true);
    
    try {
      const success = await shareCertificate(certificate);
      
      if (success) {
        toast({
          title: "Certificate Shared",
          description: "Your certificate has been shared successfully",
        });
      } else {
        // Fallback to copy link if Web Share API is not supported
        copyToClipboard();
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share certificate",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{formatDistanceToNow(new Date(issuedDate), { addSuffix: true })}</span>
            </div>
          </div>
          <Badge variant={isPublic ? "default" : "outline"}>
            {isPublic ? "Public" : "Private"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Score:</span>
            <span className="font-mono text-sm">{score}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Certificate ID:</span>
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[150px]">
              {certificate.uniqueId}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Block ID:</span>
            <span className="text-xs font-mono text-muted-foreground">
              {blockId || 'N/A'}
            </span>
          </div>
          
          {showQR && (
            <div className="flex justify-center my-4 bg-white p-3 rounded-md">
              <div className="text-center">
                <QRCode value={verificationUrl} size={150} />
                <p className="text-xs text-muted-foreground mt-2">Scan to verify</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={toggleVisibility}
        >
          {isPublic ? (
            <>
              <EyeOff className="h-3.5 w-3.5 mr-1" />
              Make Private
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 mr-1" />
              Make Public
            </>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Award className="h-3.5 w-3.5 mr-1" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowQR(!showQR)}>
              <QrCode className="h-4 w-4 mr-2" />
              {showQR ? "Hide QR Code" : "Show QR Code"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyToClipboard}>
              <Link className="h-4 w-4 mr-2" />
              Copy Verification Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadPDF} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download Certificate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareCertificate} disabled={isSharing}>
              {isSharing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Share Certificate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;

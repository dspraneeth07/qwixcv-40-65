
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
      
      // Create simplified certificate design for PDF with A4 landscape dimensions
      tempDiv.innerHTML = `
        <div style="padding: 40px; font-family: 'SF Pro Display', Arial, sans-serif; color: white; background: linear-gradient(to right, #3b82f6, #8b5cf6); width: 1122px; height: 793px; position: relative;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <h2 style="font-size: 32px; font-weight: bold;">QwiXCertChain</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.4);">
              Blockchain Verified
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">${title}</h1>
            <p style="font-size: 24px; opacity: 0.9; margin-bottom: 10px;">This certificate is awarded to</p>
            <p style="font-size: 36px; font-weight: bold; margin-bottom: 30px;">${certificate.recipientName}</p>
            <p style="font-size: 20px;">For successfully demonstrating proficiency with a score of <strong>${score}%</strong></p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 60px;">
            <div>
              <p style="font-size: 18px; margin-bottom: 5px;">Issued by: ${certificate.issuer}</p>
              <p style="font-size: 18px;">Issue Date: ${new Date(issuedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p style="font-size: 18px; margin-bottom: 5px;">Certificate ID: ${certificate.uniqueId}</p>
              <p style="font-size: 18px;">Blockchain: ${certificate.blockchainNetwork}</p>
            </div>
          </div>
          
          <div style="position: absolute; bottom: 40px; width: calc(100% - 80px);">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div style="font-size: 12px;">
                <p>Transaction: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 5)}</p>
                <p>Block ID: ${blockId || 'N/A'}</p>
                <p>Certificate Hash: ${certHash}</p>
              </div>
              <div style="text-align: center; background: white; padding: 15px; border-radius: 8px;">
                <img src="data:image/svg+xml;base64,${btoa(
                  new XMLSerializer().serializeToString(
                    document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                  )
                )}" alt="QR Code" width="100" height="100" />
                <p style="color: #333; font-size: 12px; margin-top: 5px;">Scan to verify</p>
              </div>
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: 14px;">
              Verify the authenticity of this certificate at: ${verificationUrl}
            </p>
          </div>
        </div>
      `;
      
      // Replace the placeholder QR code with a real one
      const qrCodeImg = document.createElement('img');
      // Use a different approach to generate QR code image
      const qrComponent = document.createElement('div');
      qrComponent.style.display = 'none';
      document.body.appendChild(qrComponent);
      
      // Render the QR code to the hidden div
      const qrElement = document.createElement('div');
      qrComponent.appendChild(qrElement);
      
      // Render QR code
      const qrCodeInstance = <QRCode value={verificationUrl} size={100} />;
      const tempQrContainer = document.createElement('div');
      tempQrContainer.id = 'temp-qr-container';
      document.body.appendChild(tempQrContainer);
      
      // Use html2canvas directly to capture the QR code
      import('html2canvas').then(async (html2canvasModule) => {
        const html2canvas = html2canvasModule.default;
        
        // Create a temporary QR code element
        document.getElementById('temp-qr-container')!.innerHTML = `
          <div style="padding: 10px; background: white;">
            <svg id="temp-qr-svg" width="100" height="100"></svg>
          </div>
        `;
        
        // Use the qrcode library directly to render to SVG
        import('qrcode').then(async (qrcodeModule) => {
          // Generate QR code string
          const qrSvgString = await qrcodeModule.default.toString(verificationUrl, {
            type: 'svg',
            width: 100,
            margin: 0,
          });
          
          // Insert the SVG string
          const svgElement = document.getElementById('temp-qr-svg');
          if (svgElement) {
            svgElement.outerHTML = qrSvgString;
          }
          
          // Capture the QR code as an image
          const qrCanvas = await html2canvas(document.getElementById('temp-qr-container')!);
          qrCodeImg.src = qrCanvas.toDataURL('image/png');
          qrCodeImg.width = 100;
          qrCodeImg.height = 100;
          
          // Replace the placeholder
          const qrPlaceholder = tempDiv.querySelector('img');
          if (qrPlaceholder && qrPlaceholder.parentNode) {
            qrPlaceholder.parentNode.replaceChild(qrCodeImg, qrPlaceholder);
          }
          
          // Generate the PDF
          const fileName = `${title.replace(/\s+/g, '_')}_Certificate.pdf`;
          await generateCertificatePDF(`temp-cert-${id}`, fileName);
          
          // Clean up
          document.body.removeChild(tempDiv);
          document.body.removeChild(tempQrContainer);
          
          toast({
            title: "Certificate Downloaded",
            description: "Your certificate has been downloaded as a PDF",
          });
          
          setIsLoading(false);
        });
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download certificate as PDF",
        variant: "destructive"
      });
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

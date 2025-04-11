
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Award, Download, Share2, Link, Eye, EyeOff, QrCode } from "lucide-react";
import { Certificate } from "@/types/certification";
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
  const { id, title, score, issuedDate, txHash, isPublic, certHash } = certificate;
  
  const verificationUrl = `${window.location.origin}/verify-cert/${certHash}`;
  
  const toggleVisibility = () => {
    onUpdateVisibility(id, !isPublic);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationUrl);
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
            <span className="text-sm font-medium">Blockchain:</span>
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[150px]">
              {txHash.substring(0, 6)}...{txHash.substring(txHash.length - 4)}
            </span>
          </div>
          
          {showQR && (
            <div className="flex justify-center my-4 bg-white p-3 rounded-md">
              <QRCode value={verificationUrl} size={150} />
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
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share Certificate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;

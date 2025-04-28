
import html2pdf from 'html2pdf.js';
import { Certificate } from '@/types/certification';
import { useToast } from '@/components/ui/use-toast';
import { getQwixVaultIdByEmail } from './blockchainDocuments';
import QRCode from 'qrcode';

// Generate Certificate PDF
export const generateCertificatePDF = async (certificate: Certificate): Promise<string> => {
  try {
    // Create certificate template
    const template = `
      <div style="width: 210mm; height: 297mm; padding: 15mm; border: 10px double #3730a3; position: relative; background-color: white; color: #1f2937; font-family: 'Playfair Display', serif;">
        <div style="text-align: center; margin-bottom: 10mm;">
          <h1 style="font-size: 36px; color: #3730a3; margin-bottom: 5mm;">Certificate of Achievement</h1>
          <h2 style="font-size: 24px; color: #4f46e5; margin-bottom: 5mm;">${certificate.title}</h2>
        </div>
        
        <div style="text-align: center; margin: 15mm 0;">
          <p style="font-size: 16px; margin-bottom: 5mm;">This certificate is presented to</p>
          <h2 style="font-size: 32px; color: #3730a3; margin-bottom: 5mm; font-style: italic;">${certificate.holderName}</h2>
          <p style="font-size: 16px; margin-bottom: 5mm;">for successfully completing the assessment with a score of</p>
          <div style="font-size: 24px; color: #4f46e5; margin: 10mm 0; padding: 5mm; border: 2px solid #4f46e5; display: inline-block; border-radius: 5px;">
            <strong>${certificate.score}%</strong>
          </div>
        </div>
        
        <div style="margin-top: 20mm;">
          <div style="display: flex; justify-content: space-between; margin-top: 30mm;">
            <div style="text-align: center; width: 40%;">
              <div style="border-top: 1px solid #000; padding-top: 2mm;">
                <p style="margin: 0; font-size: 16px;">${certificate.issuerName}</p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">Issuing Authority</p>
              </div>
            </div>
            
            <div style="text-align: center; width: 40%;">
              <div style="border-top: 1px solid #000; padding-top: 2mm;">
                <p style="margin: 0; font-size: 16px;">${new Date(certificate.issuedDate).toLocaleDateString()}</p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">Date of Issue</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="position: absolute; bottom: 15mm; left: 15mm; display: flex; align-items: center;">
          <div id="qrcode" style="margin-right: 10mm;"></div>
          <div>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Certificate ID: ${certificate.certHash}</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Block: ${certificate.blockId}</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Verify at: ${window.location.origin}/verify-cert/${certificate.certHash}</p>
          </div>
        </div>
        
        <div style="position: absolute; top: 15mm; right: 15mm;">
          <img src="/qwixcert-logo.png" style="height: 15mm;">
        </div>
        
        <div style="position: absolute; bottom: 10mm; right: 15mm; text-align: right;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">QwixVault ID: ${certificate.vaultId}</p>
          <p style="margin: 0; font-size: 10px; color: #6b7280;">Secured with blockchain technology</p>
        </div>
      </div>
    `;
    
    // Create a temporary div to render the certificate
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    document.body.appendChild(tempDiv);
    
    // Generate QR code
    const verificationUrl = `${window.location.origin}/verify-cert/${certificate.certHash}`;
    const qrCode = await QRCode.toDataURL(verificationUrl);
    
    // Add QR code to the template
    const qrElement = document.createElement('img');
    qrElement.src = qrCode;
    qrElement.style.width = '20mm';
    qrElement.style.height = '20mm';
    const qrContainer = tempDiv.querySelector('#qrcode');
    if (qrContainer) {
      qrContainer.appendChild(qrElement);
    }
    
    // Generate PDF
    const pdfOptions = {
      margin: 0,
      filename: `${certificate.title.replace(/\s+/g, '-')}-${certificate.certHash}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF as a blob URL
    const pdfBlob = await html2pdf().from(tempDiv).set(pdfOptions).outputPdf('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Clean up
    document.body.removeChild(tempDiv);
    
    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Share certificate
export const shareCertificate = async (certificate: Certificate) => {
  const verificationUrl = `${window.location.origin}/verify-cert/${certificate.certHash}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${certificate.title} - Certificate`,
        text: `Check out my certificate: ${certificate.title}`,
        url: verificationUrl
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      
      // Fall back to clipboard
      return copyToClipboard(verificationUrl);
    }
  } else {
    // Fall back to clipboard
    return copyToClipboard(verificationUrl);
  }
};

// Copy to clipboard helper
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

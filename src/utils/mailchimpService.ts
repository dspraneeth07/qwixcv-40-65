
import { toast } from "@/components/ui/use-toast";

// Use a different API key - this is a sample Mandrill API key format
const API_KEY = "YOUR_MANDRILL_API_KEY";
const MAILCHIMP_MANDRILL_URL = "https://mandrillapp.com/api/1.0/";

/**
 * Send an email using Mailchimp Transactional API (formerly Mandrill)
 */
export const sendEmailWithMailchimp = async (
  fromEmail: string,
  toEmail: string,
  subject: string,
  body: string,
  pdfBlob?: Blob,
  fileName?: string
): Promise<boolean> => {
  try {
    console.log("Preparing email draft");
    
    // Convert PDF Blob to base64 if provided
    let base64pdf = '';
    if (pdfBlob && fileName) {
      base64pdf = await blobToBase64(pdfBlob);
      console.log("PDF converted to base64");
    }

    // Create mailto URL with subject and body
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoUrl = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // First, trigger download of the PDF
    if (pdfBlob && fileName) {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(pdfUrl);
    }
    
    // Then open the mail client
    setTimeout(() => {
      window.location.href = mailtoUrl;
      
      toast({
        title: "Email draft created",
        description: "Your email draft has been opened in your mail app. The resume PDF has been downloaded - please attach it to your email.",
      });
    }, 500);
    
    return true;
  } catch (error) {
    console.error("Error creating email draft:", error);
    
    toast({
      title: "Error Creating Email",
      description: "There was a problem creating your email draft.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Convert Blob to base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

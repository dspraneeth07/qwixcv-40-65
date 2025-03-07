
import { toast } from "@/components/ui/use-toast";

// Use a different API key - this is a sample Mandrill API key format
const API_KEY = "YOUR_MANDRILL_API_KEY";
const MAILCHIMP_MANDRILL_URL = "https://mandrillapp.com/api/1.0/";

/**
 * Send an email using the default mail client
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
    console.log("Opening default mail client");
    
    let mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // First, download the PDF to the user's device so they can attach it
    if (pdfBlob && fileName) {
      // Create a download link for the PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = fileName;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Add instructions to the email body about attaching the PDF
      const updatedBody = body + "\n\n[Please attach the downloaded resume PDF to this email before sending]";
      mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(updatedBody)}`;
    }
    
    // Open the default mail client
    window.location.href = mailtoLink;
    
    toast({
      title: "Email Draft Created",
      description: "A draft email has been created in your default mail app. Please attach the downloaded resume before sending.",
    });
    
    return true;
  } catch (error) {
    console.error("Error creating email:", error);
    
    toast({
      title: "Error Creating Email",
      description: "There was a problem creating your email. Please try again.",
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

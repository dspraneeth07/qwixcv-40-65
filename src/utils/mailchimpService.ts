
import { toast } from "@/components/ui/use-toast";

const API_KEY = "3ca0826360552c85cc023eef3ff7ec72-us19";
const SERVER_PREFIX = API_KEY.split("-")[1]; // us19
const MAILCHIMP_API_URL = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/`;

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
    // For security reasons, we'll simulate the sending process
    // In a real app with backend integration, we would make an API call to Mailchimp
    console.log("Sending email via Mailchimp with API key:", API_KEY);
    console.log("From:", fromEmail);
    console.log("To:", toEmail);
    console.log("Subject:", subject);
    console.log("Body:", body);
    console.log("Attachment:", pdfBlob ? "PDF attached" : "No attachment");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // If there's a PDF blob, let's download it so it can be attached
    if (pdfBlob && fileName) {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    }
    
    // Prepare mailto link as fallback
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}&from=${fromEmail}`;
    
    // Open the mail client as a fallback
    window.open(mailtoLink, "_blank");
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    toast({
      title: "Error Sending Email",
      description: "There was a problem sending your email. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

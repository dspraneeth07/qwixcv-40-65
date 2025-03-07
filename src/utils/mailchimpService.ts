
import { toast } from "@/components/ui/use-toast";

const API_KEY = "3ca0826360552c85cc023eef3ff7ec72-us19";
const SERVER_PREFIX = API_KEY.split("-")[1]; // us19
const MAILCHIMP_API_URL = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/`;
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
    console.log("Sending email via Mailchimp with API key:", API_KEY);
    
    // Convert PDF Blob to base64 if provided
    let attachments = [];
    if (pdfBlob && fileName) {
      const base64data = await blobToBase64(pdfBlob);
      attachments.push({
        type: "application/pdf",
        name: fileName,
        content: base64data.split(',')[1] // Remove the data:application/pdf;base64, part
      });
    }

    // Prepare email content
    const emailData = {
      key: API_KEY,
      message: {
        from_email: fromEmail,
        to: [{ email: toEmail, type: "to" }],
        subject: subject,
        html: body.replace(/\n/g, "<br>"),
        attachments: attachments
      }
    };

    // Make direct API call to Mandrill (Mailchimp's transactional email service)
    const response = await fetch(`${MAILCHIMP_MANDRILL_URL}messages/send.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData)
    });

    // Check if call was successful
    if (response.ok) {
      toast({
        title: "Email Sent Successfully",
        description: `Your application has been sent to ${toEmail}.`,
      });
      return true;
    } else {
      const errorData = await response.json();
      console.error("Mailchimp API Error:", errorData);
      
      // Fallback to mailto link if Mailchimp API fails
      fallbackToMailtoLink(fromEmail, toEmail, subject, body);
      
      toast({
        title: "Direct Email Failed",
        description: "We've opened your mail client as a fallback option.",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    
    // Fallback to mailto link if there's any error
    fallbackToMailtoLink(fromEmail, toEmail, subject, body);
    
    toast({
      title: "Error Sending Email",
      description: "There was a problem sending your email directly. We've opened your mail client as a fallback.",
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

/**
 * Fallback function to open mail client
 */
const fallbackToMailtoLink = (fromEmail: string, toEmail: string, subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const mailtoLink = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}&from=${fromEmail}`;
  window.open(mailtoLink, "_blank");
};

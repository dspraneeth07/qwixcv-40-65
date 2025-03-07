
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
    console.log("Sending email via Mandrill with API key:", API_KEY);
    
    // Convert PDF Blob to base64 if provided
    let attachments = [];
    if (pdfBlob && fileName) {
      const base64data = await blobToBase64(pdfBlob);
      
      // Extract only the base64 data part (remove the data:application/pdf;base64, prefix)
      const base64Content = base64data.split(',')[1]; 
      
      console.log("PDF converted to base64, first 50 chars:", base64Content?.substring(0, 50));
      
      attachments.push({
        type: "application/pdf",
        name: fileName,
        content: base64Content
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

    console.log("Sending email with data:", JSON.stringify({
      ...emailData,
      message: {
        ...emailData.message,
        attachments: attachments.length > 0 ? [`${attachments.length} attachments included`] : []
      }
    }));

    // Make direct API call to Mandrill (Mailchimp's transactional email service)
    const response = await fetch(`${MAILCHIMP_MANDRILL_URL}messages/send.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData)
    });

    const responseData = await response.json();
    console.log("Mailchimp API Response:", responseData);

    // Check if call was successful
    if (responseData && responseData[0] && responseData[0].status === "sent") {
      toast({
        title: "Email Sent Successfully",
        description: `Your application has been sent to ${toEmail}.`,
      });
      return true;
    } else {
      console.error("Mandrill API Error:", responseData);
      
      // Show error message
      toast({
        title: "Email Sending Failed",
        description: responseData.message || "Could not send email directly. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    
    toast({
      title: "Error Sending Email",
      description: "There was a problem sending your email directly.",
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

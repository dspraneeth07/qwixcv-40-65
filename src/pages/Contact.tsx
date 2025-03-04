
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageSquare, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Have questions or need help? We're here to support you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" required placeholder="John Doe" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required placeholder="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="How can we help?" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  required 
                  placeholder="Let us know how we can help you..."
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Support Options</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Email Support</h3>
                  <p className="text-muted-foreground mb-1">
                    Email our customer support team for general inquiries.
                  </p>
                  <a href="mailto:support@smartresume.com" className="text-primary hover:underline">
                    support@smartresume.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Phone Support</h3>
                  <p className="text-muted-foreground mb-1">
                    For urgent matters, call our support line (Monday-Friday, 9AM-5PM EST).
                  </p>
                  <a href="tel:+11234567890" className="text-primary hover:underline">
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mr-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Live Chat</h3>
                  <p className="text-muted-foreground mb-1">
                    Chat with our support team for real-time assistance.
                  </p>
                  <Button variant="outline" size="sm">
                    Start Live Chat
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted p-6 rounded-lg mt-10">
                <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-primary">How do I download my resume?</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">Can I cancel my subscription?</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">Do you offer refunds?</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">How does the AI assistant work?</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;

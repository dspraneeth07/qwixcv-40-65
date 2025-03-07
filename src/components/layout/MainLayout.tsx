
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu, Briefcase } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Resume Builder", href: "/builder" },
    { name: "ATS Scanner", href: "/ats-scanner" },
    { name: "Job Board", href: "/job-board" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-white"
            >
              <FileText className="h-6 w-6" />
              <span className="font-playfair">QwiX CV</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white font-poppins"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px] bg-gradient-to-b from-indigo-600 to-purple-700 text-white">
                <div className="flex flex-col gap-6 pt-10">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-base font-medium text-white/80 transition-colors hover:text-white font-poppins"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white py-8 md:py-12">
        <div className="container flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold font-playfair">QwiX CV</span>
            </div>
            <p className="text-sm text-gray-300 font-poppins">
              AI-powered resume builder for job seekers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <p className="font-medium font-playfair">Product</p>
              <Link to="/builder" className="text-sm text-gray-300 hover:text-white font-poppins">Resume Builder</Link>
              <Link to="/ats-scanner" className="text-sm text-gray-300 hover:text-white font-poppins">ATS Scanner</Link>
              <Link to="/pricing" className="text-sm text-gray-300 hover:text-white font-poppins">Pricing</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <p className="font-medium font-playfair">Company</p>
              <Link to="/about" className="text-sm text-gray-300 hover:text-white font-poppins">About</Link>
              <Link to="/contact" className="text-sm text-gray-300 hover:text-white font-poppins">Contact</Link>
              <Link to="/privacy" className="text-sm text-gray-300 hover:text-white font-poppins">Privacy</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <p className="font-medium font-playfair">Follow us</p>
              <a href="#" className="text-sm text-gray-300 hover:text-white font-poppins">Twitter</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white font-poppins">LinkedIn</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white font-poppins">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="container mt-8 pt-8 border-t border-white/20">
          <p className="text-center text-sm text-gray-400 font-poppins">
            © {new Date().getFullYear()} QwiX CV by QwikZen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

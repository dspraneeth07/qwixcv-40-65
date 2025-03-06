
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Resume Builder", href: "/builder" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-primary"
            >
              <FileText className="h-6 w-6" />
              <span>SmartResume</span>
            </Link>
          </div>
          
          {/* Desktop Navigation and Theme Toggle */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                <div className="flex flex-col gap-6 pt-10">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
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
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-8 md:py-12">
        <div className="container flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">SmartResume</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered resume builder for job seekers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <p className="font-medium">Product</p>
              <Link to="/builder" className="text-sm text-muted-foreground hover:text-primary">Resume Builder</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <p className="font-medium">Company</p>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <p className="font-medium">Follow us</p>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">LinkedIn</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="container mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SmartResume. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "QwiXCert", href: "#certification" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="border-b bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <GraduationCap className="h-6 w-6" />
            <span className="font-sf-pro tracking-tight">QwiXEd360°</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-white font-poppins"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Log in
            </Link>
          </Button>
          <Button asChild>
            <Link to="/register">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign up
            </Link>
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button asChild size="sm" variant="ghost" className="text-white">
            <Link to="/login">Log in</Link>
          </Button>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px] bg-gradient-to-b from-modern-blue-600 to-soft-purple text-white">
              <div className="flex flex-col gap-6 pt-10">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-base font-medium text-white/90 transition-colors hover:text-white font-poppins"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-6 mt-6 border-t border-white/20">
                  <Button asChild className="w-full">
                    <Link 
                      to="/register" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign up
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full mt-2 bg-transparent border-white text-white">
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Log in
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;

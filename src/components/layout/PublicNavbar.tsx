
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, GraduationCap, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="hidden md:flex items-center gap-4">
          {/* CV Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white/90 hover:text-white hover:bg-white/10 p-1.5 h-auto px-2"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">CV Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>Resume Builder</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>ATS Scanner</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>LinkedIn Optimizer</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>Resume Compare</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* QwiX Jobs Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white/90 hover:text-white hover:bg-white/10 p-1.5 h-auto px-2"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">QwiX Jobs</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>Job Board</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>Career Path Simulator</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>Interview Coach</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* QwiX Learn Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white/90 hover:text-white hover:bg-white/10 p-1.5 h-auto px-2"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">QwiX Learn</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>AI Coding Coach</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>QwiXPro Builder</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>Skill Gap Analysis</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <span>Mindprint Assessment</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/login">
              QwiXCert
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/about">
              About
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/contact">
              Contact
            </Link>
          </Button>
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
                <div className="space-y-1 px-2">
                  <p className="text-sm font-semibold text-white/70 mb-2">CV TOOLS</p>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Resume Builder
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ATS Scanner
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    LinkedIn Optimizer
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Resume Compare
                  </Link>
                </div>
                
                <div className="space-y-1 px-2">
                  <p className="text-sm font-semibold text-white/70 mb-2">QWIX JOBS</p>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Job Board
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Career Path Simulator
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Interview Coach
                  </Link>
                </div>

                <div className="space-y-1 px-2">
                  <p className="text-sm font-semibold text-white/70 mb-2">QWIX LEARN</p>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    AI Coding Coach
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    QwiXPro Builder
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Skill Gap Analysis
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mindprint Assessment
                  </Link>
                </div>
                
                <div className="space-y-1 px-2">
                  <p className="text-sm font-semibold text-white/70 mb-2">NAVIGATION</p>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    QwiXCert
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
                
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

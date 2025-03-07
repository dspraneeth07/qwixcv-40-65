
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/6928559c-2051-4148-8209-c73a31d58097.png" 
            alt="QwiX CV Logo" 
            className="h-8 w-auto"
          />
          <span className="font-bold text-xl text-modern-blue-600">QwiX CV</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium">Home</Link>
          <Link to="/builder" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium">Resume Builder</Link>
          <Link to="/ats-scanner" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium">ATS Scanner</Link>
          <Link to="/job-board" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium">Job Board</Link>
          <Link to="/about" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium">Contact</Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-full">
            Sign In
          </Button>
          <Button variant="ats" size="sm" className="rounded-full">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-700"
          onClick={toggleMenu}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full py-4 px-4 shadow-lg absolute top-full left-0">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium py-2">Home</Link>
            <Link to="/builder" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium py-2">Resume Builder</Link>
            <Link to="/ats-scanner" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium py-2">ATS Scanner</Link>
            <Link to="/job-board" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium py-2">Job Board</Link>
            <Link to="/about" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium py-2">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-modern-blue-600 transition-colors font-medium py-2">Contact</Link>
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="rounded-full flex-1">
                Sign In
              </Button>
              <Button variant="ats" size="sm" className="rounded-full flex-1">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

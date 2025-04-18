import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';

interface LayoutProps {
  children: React.ReactNode;
}

interface User {
  name: string;
  email: string;
  avatarUrl?: string; // Make avatarUrl optional
}

// Mock user for demonstration
const currentUser: User = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "/avatar-placeholder.png"
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="font-bold text-xl flex items-center">
                <span className="text-primary">QwiX</span>
                <span className="text-muted-foreground ml-1">Career</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/interview-coach" className="text-sm font-medium hover:text-primary transition-colors">
                  Interview Coach
                </Link>
                <Link to="/resume-builder" className="text-sm font-medium hover:text-primary transition-colors">
                  Resume Builder
                </Link>
                <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
                  Job Search
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <ModeToggle />
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {currentUser.avatarUrl && (
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  )}
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <div className="font-medium">{currentUser.name}</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t py-6 bg-background">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} QwiX Career. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

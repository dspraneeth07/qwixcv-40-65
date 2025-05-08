
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import WalletConnect from "@/components/blockchain/WalletConnect";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, FileText, Linkedin, Brain, Code, ChevronDown, Briefcase, Sparkles, Route, BarChart } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center font-bold mr-8">
            <span className="text-2xl font-extrabold mr-1 bg-gradient-to-r from-modern-blue-500 to-soft-purple bg-clip-text text-transparent">
              QwiX
            </span>
            <span className="text-xl font-bold font-sf-pro">CV</span>
          </Link>

          <nav className="flex items-center space-x-4 lg:space-x-6 hidden md:flex">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            
            {/* CV Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-sm font-medium transition-colors hover:text-primary">
                  CV Tools <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/builder" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Resume Builder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/linkedin-optimizer" className="w-full">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn Optimizer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ats-scanner" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    ATS Scanner
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* QwiX Career Guide Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-sm font-medium transition-colors hover:text-primary">
                  QwiX Career Guide <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/career-path-simulator" className="w-full">
                    <Route className="mr-2 h-4 w-4" />
                    Career Path Simulator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/interview-coach" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Interview Coach
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ai-job-switch-planner" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Job Switch Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ai-shadow-career-simulator" className="w-full">
                    <Briefcase className="mr-2 h-4 w-4" />
                    AI Shadow Career Simulator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/skill-gap-analysis" className="w-full">
                    <BarChart className="mr-2 h-4 w-4" />
                    Skill Gap Analysis
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ai-layoff-readiness-toolkit" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Layoff Readiness Toolkit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* QwiX Learn Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-sm font-medium transition-colors hover:text-primary">
                  QwiX Learn <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/mindprint-assessment" className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Mindprint Assessment
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ai-coding-coach" className="w-full">
                    <Code className="mr-2 h-4 w-4" />
                    AI Coding Coach
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link
              to="/job-board"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Job Board
            </Link>
            <Link
              to="/certification-center"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Certifications
            </Link>
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <WalletConnect />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture || ''} alt={user.name || 'User'} />
                      <AvatarFallback>{getInitials(user.name || 'User')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QwiX CV. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              to="/about"
              className="transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

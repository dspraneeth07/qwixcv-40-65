
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FileText, Instagram, Twitter, Linkedin, Globe, Sparkles, Award, Shield, User, MessageSquare, Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PublicNavbar from "./PublicNavbar";
import UserNavbar from "./UserNavbar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();

  const productLinks = [
    { name: "Resume Builder", href: "/builder", icon: FileText },
    { name: "ATS Scanner", href: "/ats-scanner", icon: Sparkles },
    { name: "Compare Resumes", href: "/resume-compare", icon: FileText },
    { name: "QwiXCert", href: "/certification-center", icon: Shield },
    { name: "Job Board", href: "/job-board", icon: Briefcase },
    { name: "Career Simulator", href: "/career-path-simulator", icon: Sparkles },
  ];

  const companyLinks = [
    { name: "Home", href: "/", icon: FileText },
    { name: "About", href: "/about", icon: User },
    { name: "Contact", href: "/contact", icon: MessageSquare },
  ];

  const socialLinks = [
    { icon: Instagram, name: "Instagram", href: "https://instagram.com/qwikzen_india" },
    { icon: Twitter, name: "Twitter", href: "https://twitter.com/dspraneeth07" },
    { icon: Linkedin, name: "LinkedIn", href: "https://www.linkedin.com/company/qwikzen" },
    { icon: Globe, name: "Website", href: "https://qwikzen.netlify.app" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {isAuthenticated ? <UserNavbar /> : <PublicNavbar />}
      
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        {children}
      </main>
      
      <footer className="bg-gradient-to-r from-modern-blue-700 to-modern-blue-900 text-white py-10 md:py-14">
        <div className="container grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company description column */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold font-sf-pro">QwiXEd360°</span>
            </div>
            <p className="text-sm text-gray-300 font-poppins max-w-md">
              AI-powered career platform helping job seekers create professional resumes optimized for ATS systems, 
              gain certifications, and advance their career paths.
            </p>
          </div>
          
          {/* Footer links - balanced layout */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <p className="font-medium font-sf-pro">Product</p>
            <div className="grid grid-cols-2 gap-2">
              {productLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-sm text-gray-300 hover:text-white font-poppins flex items-center gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 flex flex-col gap-3">
            <p className="font-medium font-sf-pro">Company</p>
            <div className="grid grid-cols-2 gap-2">
              {companyLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-sm text-gray-300 hover:text-white font-poppins flex items-center gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Social Media Links - Centered */}
        <div className="container mt-8 text-center">
          <p className="font-medium font-sf-pro mb-4">FOLLOW US</p>
          <div className="flex justify-center gap-6 mb-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a 
                  key={link.name}
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>
        
        <div className="container pt-8 border-t border-white/10">
          <p className="text-center text-sm text-gray-400 font-poppins">
            © {new Date().getFullYear()} QwiXEd360° by QwikZen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

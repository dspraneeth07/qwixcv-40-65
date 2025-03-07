
import React from "react";
import { Instagram, Twitter, Linkedin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">QwiX CV</h3>
            <p className="text-gray-400 mb-4">
              AI-powered resume analysis and optimization tool to help you land your dream job.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/builder" className="hover:text-blue-400 transition-colors">Resume Builder</Link></li>
              <li><Link to="/ats-scanner" className="hover:text-blue-400 transition-colors">ATS Scanner</Link></li>
              <li><Link to="/compare" className="hover:text-blue-400 transition-colors">Resume Compare</Link></li>
              <li><Link to="/job-board" className="hover:text-blue-400 transition-colors">Job Board</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://instagram.com/qwikzen_india" target="_blank" rel="noopener noreferrer" 
                 className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/dspraneeth07" target="_blank" rel="noopener noreferrer"
                 className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/qwikzen" target="_blank" rel="noopener noreferrer"
                 className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://qwikzen.netlify.app" target="_blank" rel="noopener noreferrer"
                 className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 QwikZen Group India. All rights reserved.</p>
          <p className="mt-2">Developed by <strong>QwikZen Team</strong> 🚀 | QwiX CV - AI Resume Analyzer</p>
          <p className="mt-1">Team Members: Dhadi Sai Praneeth Reddy, Kasireddy Manideep Reddy, Pravalika Batchu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

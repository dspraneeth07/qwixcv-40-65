
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';

const NavbarLinks = () => {
  return (
    <div className="hidden md:flex space-x-6">
      <NavLink to="/" className={({ isActive }) => 
        isActive ? "text-modern-blue-600 font-medium" : "text-gray-600 hover:text-modern-blue-600"
      }>
        Home
      </NavLink>
      <NavLink to="/resume-builder" className={({ isActive }) => 
        isActive ? "text-modern-blue-600 font-medium" : "text-gray-600 hover:text-modern-blue-600"
      }>
        Resume Builder
      </NavLink>
      <NavLink to="/ats-scanner" className={({ isActive }) => 
        isActive ? "text-modern-blue-600 font-medium" : "text-gray-600 hover:text-modern-blue-600"
      }>
        ATS Scanner
      </NavLink>
      <NavLink to="/job-board" className={({ isActive }) => 
        isActive ? "text-modern-blue-600 font-medium" : "text-gray-600 hover:text-modern-blue-600"
      }>
        Job Board
      </NavLink>
      <NavLink to="/certification-center" className={({ isActive }) => 
        isActive ? "text-modern-blue-600 font-medium flex items-center" : "text-gray-600 hover:text-modern-blue-600 flex items-center"
      }>
        <Shield className="h-4 w-4 mr-1" />
        Certifications
      </NavLink>
    </div>
  );
};

export default NavbarLinks;

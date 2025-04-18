
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = false; // Always false since we only use light theme
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const gradientStyle = {
    background: isDark 
      ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.15) 0%, rgba(30, 27, 75, 0.1) 50%, rgba(10, 10, 10, 0) 100%)`
      : `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.15) 0%, rgba(224, 231, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)`,
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      style={gradientStyle}
    >
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top header with logo */}
      <header className="mb-8 relative z-10">
        <div className="container flex items-center justify-center">
          <Link to="/" className="flex items-center text-center gap-2 text-2xl font-bold">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-sf-pro text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-modern-blue-600 to-soft-purple">
              QwiXEd360°
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-10 text-center relative z-10">
        <div className="container">
          <div className="flex justify-center mb-4">
            <ThemeToggle />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} QwiXEd360° by QwikZen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;

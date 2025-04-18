
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'student' | 'organization' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: any, role: UserRole) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('qwixed360_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('qwixed360_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual Supabase authentication
      // This is a mock implementation until Supabase is integrated
      if (email && password) {
        // Mock successful login
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role,
        };
        
        setUser(mockUser);
        localStorage.setItem('qwixed360_user', JSON.stringify(mockUser));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual Supabase registration
      // This is a mock implementation until Supabase is integrated
      if (userData.email && userData.password) {
        // Mock successful registration
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email: userData.email,
          name: userData.fullName || userData.email.split('@')[0],
          role,
          profilePicture: userData.profilePicture,
        };
        
        setUser(mockUser);
        localStorage.setItem('qwixed360_user', JSON.stringify(mockUser));
        
        toast({
          title: "Registration successful",
          description: `Welcome to QwiXEd360°, ${mockUser.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: "Please complete all required fields",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user data from state and local storage
    setUser(null);
    localStorage.removeItem('qwixed360_user');
    navigate('/login');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual Supabase password reset
      toast({
        title: "Password reset link sent",
        description: "Please check your email for password reset instructions",
      });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset link",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

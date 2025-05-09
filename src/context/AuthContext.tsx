
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, UserRole } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("qwixUserData");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("qwixUserData");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // This is a mock login - in a real app this would be an API call
      // For demo purposes, we create different users based on the email domain
      let role: UserRole = "student";
      if (email.endsWith("@org.com") || email.includes("organization") || email.includes("employer")) {
        role = "organization";
      } else if (email.endsWith("@admin.com") || email.includes("admin")) {
        role = "admin";
      }
      
      const userData: User = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
        profilePicture: null,
        createdAt: new Date().toISOString(),
      };
      
      // Save to local storage
      localStorage.setItem("qwixUserData", JSON.stringify(userData));
      setUser(userData);
      
      // Show success message
      toast({
        title: "Login successful!",
        description: "Welcome back to QwiX CV",
      });
      
      // Redirect based on role
      const from = location.state?.from?.pathname || 
                  (role === "organization" ? "/organization-home" : "/student-home");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      // This is a mock registration - in a real app this would be an API call
      const userData: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role,
        profilePicture: null,
        createdAt: new Date().toISOString(),
      };
      
      // Save to local storage
      localStorage.setItem("qwixUserData", JSON.stringify(userData));
      setUser(userData);
      
      // Show success message
      toast({
        title: "Registration successful!",
        description: "Welcome to QwiX CV",
      });
      
      // Redirect based on role
      const from = location.state?.from?.pathname || 
                  (role === "organization" ? "/organization-home" : "/student-home");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: "Could not create your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("qwixUserData");
    setUser(null);
    
    // Show success message
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Redirect to login page
    navigate("/login", { replace: true });
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      // This is a mock function - in a real app this would be an API call
      toast({
        title: "Password reset email sent",
        description: `Instructions have been sent to ${email}`,
      });
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast({
        title: "Failed to send reset email",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    try {
      // This is a mock function - in a real app this would be an API call
      toast({
        title: "Password reset successful",
        description: "You can now login with your new password",
      });
      navigate("/login");
    } catch (error) {
      console.error("Reset password failed:", error);
      toast({
        title: "Password reset failed",
        description: "Invalid or expired token",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

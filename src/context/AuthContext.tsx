import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/auth';

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

const getCachedUser = (): User | null => {
  try {
    const cachedUser = localStorage.getItem('cached_user');
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) {
      return JSON.parse(demoUser);
    }
    
    return null;
  } catch (e) {
    console.error('Error retrieving cached user:', e);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCachedUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const cachedUser = getCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              const userData = {
                id: session.user.id,
                email: session.user.email!,
                name: profile.full_name,
                role: profile.role as UserRole,
                profilePicture: profile.profile_picture,
              };
              
              setUser(userData);
              
              localStorage.setItem('cached_user', JSON.stringify(userData));
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
          localStorage.removeItem('cached_user');
          localStorage.removeItem('demo_user');
        }
        setIsLoading(false);
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }
        
        // Intentionally not setting user here to avoid double-setting
        // The onAuthStateChange listener will handle it
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth initialization timeout, using fallback');
        setIsLoading(false);
      }
    }, 3000);

    initializeAuth();

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Default organization login for demo purposes
    if (role === 'organization' && email === 'spreddydhadi@gmail.com' && password === '1234567890') {
      const orgUser = {
        id: `org-demo-${Date.now()}`,
        email: email,
        name: 'QwiX Organization',
        role: 'organization' as UserRole,
        profilePicture: null
      };
      
      setUser(orgUser);
      localStorage.setItem('demo_user', JSON.stringify(orgUser));
      
      toast({
        title: "Organization Login",
        description: "Successfully logged in to organization account",
      });
      
      navigate('/organization/dashboard');
      setIsLoading(false);
      return true;
    }
    
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      
      const demoUser = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        profilePicture: null
      };
      
      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      
      toast({
        title: "Fast Login Mode",
        description: "Logged in using prototype mode for faster demo",
      });
      
      // Different navigation based on user role
      if (role === 'organization') {
        navigate('/organization/dashboard');
      } else {
        navigate('/dashboard');
      }
      return true;
    }, 5000);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

      if (error) {
        setIsLoading(false);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (!data.user) {
        setIsLoading(false);
        toast({
          title: "Login failed",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        setIsLoading(false);
        toast({
          title: "Login failed",
          description: "Error fetching profile: " + profileError.message,
          variant: "destructive",
        });
        return false;
      }

      if (!profile) {
        await supabase.auth.signOut();
        setIsLoading(false);
        toast({
          title: "Access Denied",
          description: "User profile not found",
          variant: "destructive",
        });
        return false;
      }
      
      if (profile.role !== role) {
        await supabase.auth.signOut();
        setIsLoading(false);
        toast({
          title: "Access Denied",
          description: "Invalid role for this login type",
          variant: "destructive",
        });
        return false;
      }

      const userData = {
        id: data.user.id,
        email: data.user.email!,
        name: profile.full_name,
        role: profile.role as UserRole,
        profilePicture: null,
      };
      
      setUser(userData);
      
      localStorage.setItem('cached_user', JSON.stringify(userData));

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Different navigation based on user role
      if (userData.role === 'organization') {
        navigate('/organization/dashboard');
      } else {
        navigate('/dashboard');
      }
      return true;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for password reset instructions",
      });
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to send password reset email",
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

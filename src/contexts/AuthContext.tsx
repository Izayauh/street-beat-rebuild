// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, User, AuthError } from '@supabase/supabase-js';

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  supabaseUrl, 
  supabaseAnonKey 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState<SupabaseClient>(() => 
    createClient(supabaseUrl, supabaseAnonKey)
  );

  useEffect(() => {
    // Check for user on initial load
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });

      // If sign up is successful, send a custom welcome email
      if (!error) {
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({
              templateName: 'welcome',
              email,
              data: {
                username: email.split('@')[0],
                verificationLink: `${window.location.origin}/auth/verify`,
              },
            }),
          });
        } catch (emailError) {
          console.error('Error sending custom welcome email:', emailError);
          // Continue even if custom email fails - Supabase will still send its default email
        }
      }

      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: error as AuthError };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as AuthError };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    try {
      // Use our custom Edge Function for password reset
      const response = await fetch(`${supabaseUrl}/functions/v1/handle-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: { message: errorData.message } as AuthError };
      }

      return { error: null };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { error: { message: 'Failed to send password reset email' } as AuthError };
    }
  };

  // Reset password with new password
  const resetPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      // If password reset is successful, send a confirmation email
      if (!error && user?.email) {
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({
              templateName: 'password-changed',
              email: user.email,
              data: {
                username: user.email.split('@')[0],
                loginLink: `${window.location.origin}/auth/sign-in`,
              },
            }),
          });
        } catch (emailError) {
          console.error('Error sending password changed email:', emailError);
          // Continue even if email fails
        }
      }

      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
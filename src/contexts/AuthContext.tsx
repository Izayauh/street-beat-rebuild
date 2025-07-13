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
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState<SupabaseClient>(() => 
    createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!)
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
        // This tells Supabase where to redirect the user after they click the verification link
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });

    // If the Supabase sign-up was successful, call our email function
    if (!error) {
      console.log('Sign-up successful. Triggering welcome email...');
      try {
        await supabase.functions.invoke('resend-email', { // Use the correct function name
          body: {
            template: 'welcome', // The key from our template map in index.ts
            to: email,
            subject: 'Welcome to 3rd Street Music!',
            data: { // The props for our React component
              name: email.split('@')[0], // A simple username from the email
              actionUrl: `${window.location.origin}/confirm` // The verification link
            }
          }
        });
        console.log('Welcome email function invoked successfully.');
      } catch (emailError) {
          console.error('Error invoking welcome email function:', emailError);
          // We don't throw an error here because the user account was still created.
          // This just means our custom email failed, but Supabase's default might still go out.
      }
    }

    return { error };
  } catch (error) {
    console.error('Error during sign up process:', error);
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) {
        return { error };
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
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
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
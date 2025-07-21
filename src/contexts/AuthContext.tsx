import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client'; // Import the shared client
import { User, SupabaseClient, AuthResponse, Session } from '@supabase/supabase-js';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, options?: { data?: object; emailRedirectTo?: string; }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseClient] = useState(() => supabase);

  useEffect(() => {
    // Check for user on initial load
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabaseClient]); // Dependency array includes supabaseClient

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error };
  };

  const signUp = async (email: string, password: string, options?: { data?: object; emailRedirectTo?: string; }): Promise<AuthResponse> => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options
    });
    if (error) throw error;
    return { data, error };
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    supabase: supabaseClient,
    signIn,
    signUp,
    signOut,
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

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
 user: User | null;
 session: Session | null;
 loading: boolean;
 signUp: (email: string, password: string) => Promise<{
 error: any | null;
 data: any | null;
 }>;
 signIn: (email: string, password: string) => Promise<{
 error: any | null;
 data: any | null;
 }>;
 signOut: () => Promise<void>;
 sendPasswordResetEmail: (email: string) => Promise<{
 error: any | null;
 data: any | null;
 }>;
 resetPassword: (newPassword: string) => Promise<{
 error: any | null;
 data: any | null;
 }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/confirm`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const sendPasswordResetEmail = async (email: string) => {
    console.log('Attempting to send password reset email for:', email);
    
    // Step 1: Call Supabase to generate the token
    const { data, error: generateTokenError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (generateTokenError) {
      console.error("Error generating password reset token:", generateTokenError);
      return { error: generateTokenError };
    }

    // Step 2: Call the Edge Function to send the email with the token
    const { error: sendEmailError } = await supabase.functions.invoke('send-password-reset', {
      body: { email, token: data?.properties?.email_change_token_new },
    });

    // Return the error from the email sending step, or null if successful
    return { error: sendEmailError };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCustomAuth = () => {
  const auth = useAuth();

  const signUpWithVerification = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/confirm`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });

    if (!error && data.user && !data.user.email_confirmed_at) {
      // Send custom verification email
      try {
        await supabase.functions.invoke('send-verification-email', {
          body: {
            email,
            confirmationUrl: redirectUrl,
            fullName
          }
        });
      } catch (emailError) {
        console.warn('Failed to send custom verification email:', emailError);
        // The built-in Supabase email will still be sent
      }
    }

    return { data, error };
  };

  return {
    ...auth,
    signUpWithVerification
  };
};

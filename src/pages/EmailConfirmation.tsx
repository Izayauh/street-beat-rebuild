
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session with the tokens from the URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setStatus('error');
            setMessage('Failed to confirm email. Please try again.');
            console.error('Email confirmation error:', error);
          } else {
            setStatus('success');
            setMessage('Email confirmed successfully! Welcome to 3rd Street Music.');
            
            // Clear the URL hash
            window.history.replaceState(null, '', window.location.pathname);
            
            // Redirect to home after a short delay
            setTimeout(() => {
              navigate('/');
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid confirmation link.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during email confirmation.');
        console.error('Email confirmation error:', error);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
            <span className="text-white font-bold text-xl">3rd Street Music</span>
          </div>

          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <Loader2 className="w-16 h-16 mx-auto text-purple-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </h1>

          {/* Message */}
          <p className="text-gray-300 mb-6">{message}</p>

          {/* Actions */}
          {status === 'success' && (
            <p className="text-sm text-gray-400">
              Redirecting you to the home page in a few seconds...
            </p>
          )}
          
          {status === 'error' && (
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;

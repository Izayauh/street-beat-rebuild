import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'token' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if email was passed from ForgotPassword page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      // Auto-advance to token step if email is provided
      setStep('token');
    }
  }, [location.state]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/password-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'generate',
          email: email
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset code');
      }

      setMessage('Reset code sent to your email!');
      setStep('token');
    } catch (error) {
      setError(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (token.length !== 6) {
      setError('Please enter a 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/password-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'verify',
          email: email,
          token: token,
          newPassword: password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify code');
      }

      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/auth'), 3000);
    } catch (error) {
      setError(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/password-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'verify',
          email: email,
          token: token,
          newPassword: password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/auth'), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'token') {
      setStep('email');
      setToken('');
      setError(null);
      setMessage(null);
    } else if (step === 'password') {
      setStep('token');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setMessage(null);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/password-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'generate',
          email: email
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend code');
      }

      setMessage('New code sent to your email!');
    } catch (error) {
      setError(error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  if (message && step === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => setStep('token')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enter Code
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (message && (step === 'token' || step === 'password')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}

        {step === 'email' && (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </form>
        )}

        {step === 'token' && (
          <form onSubmit={handleVerifyToken}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="token">
                6-Digit Code
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center text-2xl tracking-widest"
                id="token"
                type="text"
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none"
                disabled={loading}
              >
                Back
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
                disabled={loading || token.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={resendCode}
                className="text-blue-500 hover:text-blue-700 text-sm underline"
                disabled={loading}
              >
                Didn't receive code? Resend
              </button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirm-password"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none"
                disabled={loading}
              >
                Back
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

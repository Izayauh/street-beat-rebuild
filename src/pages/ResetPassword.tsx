import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  // Assuming 'supabase' client is imported from your integrations
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = searchParams.get('token');
  const type = searchParams.get('type'); // Supabase often includes a type

  useEffect(() => {
    if (!token || type !== 'recovery') {
      setError('Invalid or missing reset token.');
      // Optionally redirect after a delay
      // setTimeout(() => navigate('/auth'), 3000);
    }
  }, [token, type, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
        setError('Reset token is missing.');
        return;
    }

    // Implement password reset logic using Supabase's updateUser with the access token
    // The 'token' from the URL is the access token for this specific password reset event
    const { error: resetError } = await supabase.auth.updateUser({ password: password }, {
      emailRedirectTo: `${window.location.origin}/auth/login` // Optional: Redirect after password change
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Your password has been reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/auth/login'), 3000); // Redirect to login after 3 seconds
    }
  };

  if (error && error !== 'Invalid or missing reset token.') {
      return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (message) {
      return <div className="text-green-500 text-center mt-8">{message}</div>;
  }
  
  if (!token || type !== 'recovery') {
      return <div className="text-red-500 text-center mt-8">Invalid or missing reset token. Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {/* Form and input fields will go here */}
      </div>
    </div>
  );
};

export default ResetPassword;
typescriptreact
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  // Assuming 'supabase' client is imported from your integrations
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = searchParams.get('token');
  const type = searchParams.get('type'); // Supabase often includes a type

  useEffect(() => {
    if (!token || type !== 'recovery') {
      setError('Invalid or missing reset token.');
      // Optionally redirect after a delay
      // setTimeout(() => navigate('/auth'), 3000);
    }
  }, [token, type, navigate]);

  // Function to send a test email - FOR TESTING PURPOSES ONLY
  const handleSendTestEmail = async () => {
    const testEmailData = {
      to: 'isaiahwashington48@gmail.com', // Your test recipient email
      subject: 'Password Reset Test Email',
      body: '<p>This is a test email for password reset.</p>'
    };

    try {
      const response = await sendEmail(testEmailData);
      console.log('Test email sent successfully:', response);
      alert('Test email sent successfully! Check your inbox.');
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email. Check the console for errors.');
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
        setError('Reset token is missing.');
        return;
    }

    // TODO: Implement password reset logic using your auth library (e.g., Supabase)
    // Example (Supabase):
    // const { error: resetError } = await supabase.auth.api.updateUser(token, {
    //   password: password,
    // });

    // if (resetError) {
    //   setError(resetError.message);
    // } else {
    //   setMessage('Your password has been reset successfully. You can now log in.');
    //   // Optionally redirect to login page after a delay
    //   // setTimeout(() => navigate('/auth'), 3000);
    // }
  };

  if (error && error !== 'Invalid or missing reset token.') {
      return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (message) {
      return <div className="text-green-500 text-center mt-8">{message}</div>;
  }
  
  if (!token || type !== 'recovery') {
      return <div className="text-red-500 text-center mt-8">Invalid or missing reset token. Redirecting...</div>;
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleResetPassword}>
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
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">

              Confirm New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
             {/* Test Button - Remove in production */}
             <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
              type="button" // Use type="button" to prevent form submission
              onClick={handleSendTestEmail}
            >Send Test Email</button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
import { supabase } from '@/integrations/supabase/client'; // Ensure this path is correct
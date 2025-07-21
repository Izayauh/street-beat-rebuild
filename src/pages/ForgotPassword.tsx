import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Simulate sending email (replace with actual API call if needed)
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      setMessage('A 6-digit reset code has been sent to your email address.');
      // Optionally, you could still navigate here after showing the message
      // navigate('/auth/reset-password', { state: { email: email } });

    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center">Forgot Password</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a 6-digit code to reset your password.
        </p>
        {message && <p className={`text-center mb-4 ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        {!message && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none"
                disabled={loading}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
        {message && !message.includes('Failed') && (
             <div className="mt-6 text-center">
             <button
               onClick={() => navigate('/auth/reset-password', { state: { email: email } })}
               className="text-blue-600 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none"
             >
               Go to Reset Password Page
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

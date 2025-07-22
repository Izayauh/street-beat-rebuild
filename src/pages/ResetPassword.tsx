import React, { useState, FormEvent, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';

type ResetPasswordStep = 'email' | 'token' | 'password';

const ResetPassword: React.FC = () => {
 const [step, setStep] = useState<ResetPasswordStep>('email');
 const [email, setEmail] = useState('');
 const [token, setToken] = useState('');
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [error, setError] = useState('');
 const [message, setMessage] = useState('');
 const [loading, setLoading] = useState(false);

 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
   if (location.state?.email) {
     setEmail(location.state.email);
     // Optionally set step to 'email' here if you want them to re-send the code
     // setStep('email'); 
     // Or if they came from forgot password, maybe they should go directly to token input
     // setStep('token'); // Let's keep it at 'email' initially and rely on user action
   }
 }, [location.state]);


 const handleSendCode = async (e: FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setError('');
   setMessage('');

   try {
     const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/password-reset-token`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
         'x-client-info': 'YourAppName'
       },
       body: JSON.stringify({
         action: 'generate',
         email: email
       })
     });

     if (!response.ok) {
       const errorBody = await response.text();
       console.error('Error response from backend (Send Code):', errorBody);
       try {
         const errorData = JSON.parse(errorBody);
         throw new Error(errorData.error || errorData.message || 'Failed to send reset code');
       } catch (parseError) {
         throw new Error(errorBody || 'Failed to send reset code');
       }
     }

     const result = await response.json();

     setMessage(result.message || 'Reset code sent to your email!');
     setStep('token'); // Transition to token input step

   } catch (err: any) {
     console.error('Network or fetch error (Send Code):', err);
     setError(err.message || 'An unexpected error occurred');
   } finally {
     setLoading(false);
   }
 };

 const handleVerifyToken = async (e: FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setError('');
   setMessage('');

   if (token.length !== 6) {
     setError('Please enter a valid 6-digit code.');
     setLoading(false);
     return;
   }

   // Add password confirmation check
   if (newPassword !== confirmPassword) {
     setError('New password and confirm password do not match.');
     setLoading(false);
     return;
   }

   // Add minimum password length check
   if (newPassword.length < 6) {
     setError('Password must be at least 6 characters long.');
     setLoading(false);
     return;
   }


   try {
     const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/password-reset-token`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
         'x-client-info': 'YourAppName'
       },
       body: JSON.stringify({
         action: 'verify',
         email: email,
         token: token,
         newPassword: newPassword
       })
     });

     if (!response.ok) {
       const errorBody = await response.text();
       console.error('Error response from backend (Verify Token):', errorBody);
       try {
         const errorData = JSON.parse(errorBody);
         throw new Error(errorData.error || errorData.message || 'Failed to verify code or reset password');
       } catch (parseError) {
         throw new Error(errorBody || 'Failed to verify code or reset password');
       }
     }

     const result = await response.json();

     setMessage(result.message || 'Password successfully reset');
     setStep('password'); // Transition to success step ONLY on successful response
     // Redirect to login page after successful reset
     setTimeout(() => navigate('/auth'), 3000); // Redirect after 3 seconds

   } catch (err: any) {
     console.error('Network or fetch error (Verify Token):', err);
     setError(err.message || 'An unexpected error occurred');
     // Do NOT change step or redirect on error
   } finally {
     setLoading(false);
   }
 };

 // handlePasswordSubmit is likely not needed if 'verify' action handles reset
 // Keeping it as a placeholder based on previous code structure
 const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // This function might be redundant. The password reset is likely handled in handleVerifyToken.
    console.log('handlePasswordSubmit called - might be redundant.');
 };

 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
     <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
       <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
       
       {loading && <p className="text-blue-500 text-center">Loading...</p>}
       {error && <p className="text-red-500 text-center mb-4">{error}</p>}
       {!loading && message && <p className="text-green-500 text-center mb-4">{message}</p>}

       {step === 'email' && (
         <form onSubmit={handleSendCode} className="space-y-4">
           <Input 
             type="email" 
             placeholder="Enter your email" 
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required 
             disabled={loading}
           />
           <Button type="submit" className="w-full" disabled={loading}>
             Send Verification Code
           </Button>
         </form>
       )}

       {step === 'token' && (
         <form onSubmit={handleVerifyToken} className="space-y-4">
           <Input 
             type="text" 
             placeholder="Enter verification code" 
             value={token}
             onChange={(e) => setToken(e.target.value.replace(/D/g, '').slice(0, 6))}
             maxLength={6}
             required 
             disabled={loading}
           />
           <Input 
             type="password" 
             placeholder="New Password" 
             value={newPassword}
             onChange={(e) => setNewPassword(e.target.value)}
             required 
             disabled={loading}
           />
           <Input 
             type="password" 
             placeholder="Confirm New Password" 
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             required 
             disabled={loading}
           />
           <Button type="submit" className="w-full" disabled={loading || token.length !== 6 || newPassword !== confirmPassword || newPassword.length < 6}>
             Verify Code and Reset Password
           </Button>
         </form>
       )}

       {step === 'password' && (
          <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Password Successfully Reset!</h2>
          <p className="text-gray-600 mb-4">You will be redirected to the login page shortly.</p>
          {/* Optional: Add a manual redirect button */}
          {/* <Button onClick={() => navigate('/auth')}>Go to Login</Button> */}
        </div>
       )}
     </div>
   </div>
 );
};

export default ResetPassword;

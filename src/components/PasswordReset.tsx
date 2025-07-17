import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // This uses Supabase's built-in OTP flow. No custom backend needed.
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`A password reset code has been sent to ${email}`);
      setStep('reset');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // First, verify the OTP code.
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    if (verifyError) {
      setLoading(false);
      toast.error(verifyError.message || 'The code is invalid or has expired.');
      return;
    }

    // If the OTP is valid, the user is temporarily authenticated.
    // We can now update their password.
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);
    if (updateError) {
      toast.error(updateError.message);
    } else {
      toast.success('Your password has been updated successfully!');
      await supabase.auth.signOut();
      navigate('/auth'); // Redirect to login page
    }
  };

  return (
    <Card className="w-full max-w-md">
      {step === 'request' ? (
        <>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a 6-digit password reset code.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordResetRequest} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending Code...' : 'Send Code'}
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Enter Code & New Password</CardTitle>
            <CardDescription>
              A 6-digit code was sent to {email}. Enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium">Reset Code</label>
                <Input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  placeholder="123456"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">New Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
              <Button variant="link" onClick={() => setStep('request')} className="w-full">
                Use a different email
              </Button>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  );
};

// I'm adding a default export to make it easier to import into the page.
export default PasswordReset;

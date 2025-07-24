import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../integrations/firebase/client'; // Make sure this path is correct
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('oobCode');
    
    if (code) {
      verifyPasswordResetCode(auth, code)
        .then(() => {
          setOobCode(code);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Verification Error:", err);
          setError('The password reset link is invalid or has expired.');
          setLoading(false);
        });
    } else {
      setError('Invalid password reset link. No code found in URL.');
      setLoading(false);
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success('Password has been reset successfully!');
      navigate('/auth');
    } catch (err: any) {
      console.error("Reset Error:", err);
      toast.error(err.message || 'Failed to reset password.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Verifying link...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Save New Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
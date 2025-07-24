import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Correct path to the context
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Auth: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Signed in successfully!');
      } else {
        await signUp(email, password, fullName);
        toast.success('Signed up successfully! Please check your email to verify your account.');
      }
      navigate('/'); // Redirect to home page on success
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Sign In' : 'Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          {isLogin && ( // Only show Forgot Password link on the Sign In form
            <div className="mt-4 text-center">
              <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="mt-4 w-full">
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

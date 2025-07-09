
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthFormProps {
  onClose?: () => void;
}

export const AuthForm = ({ onClose }: AuthFormProps) => {;
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Signed in successfully!');
          onClose?.();
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please check your email to confirm.');
          onClose?.();
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    console.log('Attempting password reset...');
    if (!email) {
      toast.info('Please enter your email address to reset your password.');
      return;
    }

    setLoading(true);
    try {
      // Assume sendPasswordResetEmail is available in useAuth
      console.log('Calling useAuth().sendPasswordResetEmail...');
      const { error } = await useAuth().sendPasswordResetEmail(email);
 console.log('After sendPasswordResetEmail call...', error);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent. Please check your inbox.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred while sending reset email.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="card-analog p-6 rounded-lg warm-glow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-amber-200 text-serif">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="glass-effect border-amber-500/40 bg-black/20 text-amber-100 focus:border-amber-400"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <Label htmlFor="password" className="text-amber-200 text-serif">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="glass-effect border-amber-500/40 bg-black/20 text-amber-100 focus:border-amber-400"
            placeholder="Enter your password"
            minLength={6}
          />
        </div>

        {isLogin && (
          <div className="text-right text-sm">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-amber-300 hover:text-amber-400 transition-colors text-serif underline">
              Forgot Password?
            </button>
          </div>
        )}
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full btn-analog text-black transform hover:scale-105 transition-all duration-300"
        >
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </Button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-amber-300 hover:text-amber-400 transition-colors text-serif underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

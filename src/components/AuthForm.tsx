
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthFormProps {
  onClose?: () => void;
}

const AuthForm = ({ onClose }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="card-analog p-6 rounded-lg warm-glow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-amber-200 text-serif">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="glass-effect border-amber-500/40 bg-black/20 text-amber-100 focus:border-amber-400"
          />
        </div>
        
        <div>
          <Label htmlFor="password" className="text-amber-200 text-serif">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="glass-effect border-amber-500/40 bg-black/20 text-amber-100 focus:border-amber-400"
          />
        </div>
        
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
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-300 hover:text-amber-400 transition-colors text-serif underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;

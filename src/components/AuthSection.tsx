
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

interface AuthSectionProps {
  user: User | null;
  onAuthOpen: () => void;
  onSignOut: () => void;
}

export const AuthSection = ({ user, onAuthOpen, onSignOut }: AuthSectionProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-amber-200 text-serif">Welcome, {user.email}</span>
          <Button
            onClick={onSignOut}
            className="glass-effect border border-amber-500/40 text-amber-100 hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-300"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <Button
          onClick={onAuthOpen}
          className="btn-analog text-black transform hover:scale-105 transition-all duration-300"
        >
          Sign In
        </Button>
      )}
    </div>
  );
};

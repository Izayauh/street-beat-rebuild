
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[] | null;
  image_url: string | null;
  available_days: string[] | null;
}

interface InstructorCardProps {
  instructor: Instructor;
  onBookLesson: () => void;
}

const InstructorCard = ({ instructor, onBookLesson }: InstructorCardProps) => {
  return (
    <div className="card-analog rounded-2xl p-8 hover:warm-glow transition-all duration-500 transform hover:-translate-y-2">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-black/40 glass-effect rounded-full flex items-center justify-center mx-auto mb-4 warm-glow">
          {instructor.image_url ? (
            <img 
              src={instructor.image_url} 
              alt={instructor.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-amber-400" />
          )}
        </div>
        <h3 className="text-amber-400 text-xl font-display warm-text-glow">{instructor.name}</h3>
      </div>
      
      <p className="text-amber-200/70 text-sm mb-4 line-clamp-3 text-serif leading-relaxed">
        {instructor.bio || 'Experienced music instructor passionate about teaching with heart and soul.'}
      </p>
      
      {instructor.specialties && instructor.specialties.length > 0 && (
        <div className="mb-4">
          <p className="text-amber-300 text-sm mb-2 font-display">Specialties:</p>
          <div className="flex flex-wrap gap-2">
            {instructor.specialties.map((specialty) => (
              <Badge 
                key={specialty} 
                className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs glass-effect"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {instructor.available_days && instructor.available_days.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-amber-300 text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span className="font-display">Available:</span>
          </div>
          <p className="text-amber-200/80 text-sm text-serif">
            {instructor.available_days.join(', ')}
          </p>
        </div>
      )}
      
      <Button 
        onClick={onBookLesson}
        className="btn-analog text-black w-full mt-4 transform hover:scale-105 transition-all duration-300"
      >
        Book with {instructor.name.split(' ')[0]}
      </Button>
    </div>
  );
};

export default InstructorCard;

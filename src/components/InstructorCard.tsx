
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
    <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-colors">
      <CardHeader className="text-center">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          {instructor.image_url ? (
            <img 
              src={instructor.image_url} 
              alt={instructor.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <CardTitle className="text-white text-xl">{instructor.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {instructor.bio || 'Experienced music instructor passionate about teaching.'}
        </p>
        
        {instructor.specialties && instructor.specialties.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-2">
              {instructor.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {instructor.available_days && instructor.available_days.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>Available:</span>
            </div>
            <p className="text-gray-300 text-sm">
              {instructor.available_days.join(', ')}
            </p>
          </div>
        )}
        
        <Button 
          onClick={onBookLesson}
          className="bg-purple-600 hover:bg-purple-700 w-full mt-4"
        >
          Book with {instructor.name.split(' ')[0]}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InstructorCard;

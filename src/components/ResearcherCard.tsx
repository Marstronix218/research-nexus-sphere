import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Researcher } from "./ResearcherList";
import { ExternalLink, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ResearcherCardProps {
  researcher: Researcher;
  showActions?: boolean;
}

export default function ResearcherCard({ researcher, showActions = true }: ResearcherCardProps) {
  // Profile image URLs for researchers without avatars
  const profileImages = [
    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    "https://images.unsplash.com/photo-1485833077593-4278bba3f11f"
  ];
  
  // Get a consistent image for the same researcher
  const getAvatarImage = (id: string) => {
    const hashCode = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return profileImages[hashCode % profileImages.length];
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="w-12 h-12 border-2 border-gray-100">
          <AvatarImage
            src={researcher.avatar || getAvatarImage(researcher.id)}
            alt={researcher.name}
          />
          <AvatarFallback>{researcher.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">{researcher.name}</h3>
          <p className="text-sm text-gray-500">{researcher.institution}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex gap-1 flex-wrap mb-4">
          {researcher.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="mr-1 mb-1">
              {interest}
            </Badge>
          ))}
          {researcher.interests.length > 3 && (
            <Badge variant="outline" className="mb-1">
              +{researcher.interests.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">{researcher.publications}</p>
            <p className="text-gray-500 text-xs">Publications</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">{researcher.citations}</p>
            <p className="text-gray-500 text-xs">Citations</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">{researcher.hIndex}</p>
            <p className="text-gray-500 text-xs">h-index</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-3">{researcher.bio}</p>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button variant="outline" size="sm" className="text-xs">
            <Users className="mr-1 h-3 w-3" /> Connect
          </Button>
          <Link to={`/researchers/${researcher.id}`}>
            <Button variant="default" size="sm" className="text-xs bg-research-blue hover:bg-research-light-blue">
              View Profile <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

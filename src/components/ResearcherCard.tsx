
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Researcher } from "@/data/mockData";
import { ExternalLink, Users } from "lucide-react";

interface ResearcherCardProps {
  researcher: Researcher;
  showActions?: boolean;
}

export default function ResearcherCard({ researcher, showActions = true }: ResearcherCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <img
          src={researcher.avatar}
          alt={researcher.name}
          className="rounded-full w-12 h-12 object-cover border-2 border-gray-100"
        />
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

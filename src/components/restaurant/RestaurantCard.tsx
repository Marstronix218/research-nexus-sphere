
import { Utensils, Users, Award } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const isFull = restaurant.members.length >= 5;
  const latestDish = restaurant.dishes.length > 0 ? restaurant.dishes[0] : null;

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer" 
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-research-green/20 to-research-purple/20 p-4 relative">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white rounded-full shadow-md">
            <Utensils className="h-6 w-6 text-research-purple" />
          </div>
          {restaurant.badges.length > 0 && (
            <div className="flex gap-1">
              {restaurant.badges.includes("Michelin badge") && (
                <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Michelin
                </div>
              )}
              {restaurant.badges.includes("3-star group") && (
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  ★★★
                </div>
              )}
            </div>
          )}
        </div>
        <h3 className="mt-3 font-bold text-lg text-gray-900">{restaurant.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{restaurant.description}</p>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Users className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {restaurant.members.length}/5 members
            {isFull && <span className="ml-2 text-orange-500">(Full)</span>}
          </span>
        </div>
        
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Menu</h4>
          <div className="flex flex-wrap gap-1">
            {restaurant.menu.slice(0, 3).map((item, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
            {restaurant.menu.length > 3 && (
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                +{restaurant.menu.length - 3} more
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      {latestDish && (
        <CardFooter className="bg-gray-50 p-4 border-t">
          <div>
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Latest Dish</h4>
            <p className="text-sm font-medium">{latestDish.title}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">{latestDish.date}</span>
              <span className="text-xs text-gray-500">❤️ {latestDish.likes}</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default RestaurantCard;


import { useState } from "react";
import { Utensils, Users, Award, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFull = restaurant.members.length >= 5;
  const latestDish = restaurant.dishes.length > 0 ? restaurant.dishes[0] : null;

  // Default store images if none provided
  const defaultImages = [
    "/lovable-uploads/400ab1bc-496a-498b-b85f-5941eff1e0ba.png",
    "/lovable-uploads/0da06b86-73bb-4edb-9242-faf3f3127c0f.png",
    "/lovable-uploads/02a7c074-9fac-4371-b20d-bf3e19320493.png"
  ];
  
  const storeImage = restaurant.storeImage || defaultImages[restaurant.id.charCodeAt(0) % defaultImages.length];

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 cursor-pointer ${isHovered ? 'shadow-xl transform scale-105' : 'shadow-md'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Restaurant Storefront */}
      <div className="relative h-44 overflow-hidden">
        <img 
          src={storeImage} 
          alt={restaurant.name} 
          className="w-full h-full object-contain bg-slate-50"
        />
        
        {/* Restaurant signboard */}
        <div className="absolute top-0 left-0 right-0 bg-white/90 p-2 text-center shadow-md">
          <h3 className="font-bold text-lg text-gray-900">{restaurant.name}</h3>
        </div>
        
        {/* Badges */}
        {restaurant.badges.length > 0 && (
          <div className="absolute top-2 right-2 flex gap-1">
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
      
      {/* Detail information appears on hover */}
      <div className={`transform transition-all duration-300 ${isHovered ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 hidden'}`}>
        <div className="p-4 bg-white">
          <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
          
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
              {restaurant.menu.map((item, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          
          {latestDish && (
            <div className="mt-3 border-t pt-3">
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Latest Dish</h4>
              <p className="text-sm font-medium truncate">{latestDish.title}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Regular card content when not hovered */}
      <div className={`bg-white p-4 transition-all duration-300 ${isHovered ? 'hidden' : 'block'}`}>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Users className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {restaurant.members.length}/5 members
            {isFull && <span className="ml-2 text-orange-500">(Full)</span>}
          </span>
        </div>
        
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {restaurant.menu.slice(0, 2).map((item, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
            {restaurant.menu.length > 2 && (
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                +{restaurant.menu.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Dishes/plates display at bottom */}
      {restaurant.dishes.length > 0 && (
        <div className="bg-gray-50 p-3 border-t flex gap-2 overflow-x-auto">
          {restaurant.dishes.map((dish) => (
            <div key={dish.id} className="min-w-20 w-20 bg-white rounded-full h-20 flex flex-col items-center justify-center shadow-sm border relative">
              <div className="absolute -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full flex items-center">
                <Heart className="h-3 w-3 mr-0.5" fill={dish.likes > 20 ? "currentColor" : "none"} />
                <span>{dish.likes}</span>
              </div>
              <span className="text-[10px] text-center px-1 font-medium" title={dish.title}>
                {dish.title.length > 15 ? dish.title.substring(0, 15) + '...' : dish.title}
              </span>
              <span className="text-[8px] text-gray-500">{dish.date}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RestaurantCard;


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
  
  // Get top 3 dishes
  const topDishes = restaurant.dishes.slice(0, 3);

  // Default store images if none provided
  const defaultImages = [
    "/lovable-uploads/400ab1bc-496a-498b-b85f-5941eff1e0ba.png",
    "/lovable-uploads/0da06b86-73bb-4edb-9242-faf3f3127c0f.png",
    "/lovable-uploads/02a7c074-9fac-4371-b20d-bf3e19320493.png"
  ];
  
  const storeImage = restaurant.storeImage || defaultImages[restaurant.id.charCodeAt(0) % defaultImages.length];
  const plateImage = "/lovable-uploads/1e0b3ec7-caec-4cd6-ae65-81051e3c4e9f.png";

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
          
          {topDishes.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Latest Dishes</h4>
              {topDishes.map(dish => (
                <p key={dish.id} className="text-sm font-medium truncate">{dish.title}</p>
              ))}
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
        <div className="bg-gray-50 p-3 border-t flex gap-2 overflow-x-auto justify-center">
          {topDishes.map((dish) => (
            <div key={dish.id} className="relative">
              <img 
                src={plateImage} 
                alt="Plate" 
                className="w-24 h-24 object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-white/90 rounded-full px-2 py-1 text-xs text-center shadow-sm max-w-[90%]">
                  <div className="font-medium truncate" title={dish.title}>
                    {dish.title.length > 12 ? dish.title.substring(0, 12) + '...' : dish.title}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <Heart className="h-3 w-3 mr-0.5 text-red-500" fill="currentColor" />
                    <span>{dish.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {restaurant.dishes.length > 3 && (
            <div className="flex items-center justify-center text-sm text-gray-500">
              +{restaurant.dishes.length - 3} more
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default RestaurantCard;

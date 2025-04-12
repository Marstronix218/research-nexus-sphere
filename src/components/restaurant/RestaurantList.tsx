
import { useState } from "react";
import { Restaurant } from "@/types/restaurant";
import RestaurantCard from "./RestaurantCard";
import RestaurantDialog from "./RestaurantDialog";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

const RestaurantList = ({ restaurants }: RestaurantListProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            onClick={() => handleRestaurantClick(restaurant)} 
          />
        ))}
      </div>

      {selectedRestaurant && (
        <RestaurantDialog 
          restaurant={selectedRestaurant} 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />
      )}
    </div>
  );
};

export default RestaurantList;

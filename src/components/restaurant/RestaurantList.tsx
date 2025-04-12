
import { useState } from "react";
import { Restaurant, ResearchTopic } from "@/types/restaurant";
import RestaurantCard from "./RestaurantCard";
import RestaurantDialog from "./RestaurantDialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

const TOPICS: ResearchTopic[] = [
  "Deep Learning", 
  "CNNs", 
  "Neuroimaging", 
  "NLP", 
  "LLMs", 
  "Transformers", 
  "Genomics",
  "Systems Biology", 
  "RNA-seq", 
  "Quantum Computing", 
  "Optimization",
  "Bioinformatics"
];

const RestaurantList = ({ restaurants }: RestaurantListProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<ResearchTopic[]>([]);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleTopicToggle = (topic: ResearchTopic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const filteredRestaurants = selectedTopics.length > 0
    ? restaurants.filter(restaurant => 
        restaurant.menu.some(menuItem => 
          selectedTopics.some(topic => 
            menuItem.toLowerCase().includes(topic.toLowerCase())
          )
        )
      )
    : restaurants;

  return (
    <div>
      {/* Topic filters */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2">
          {TOPICS.map((topic) => (
            <Button
              key={topic}
              variant={selectedTopics.includes(topic) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTopicToggle(topic)}
              className={`rounded-full whitespace-nowrap ${
                selectedTopics.includes(topic) 
                  ? "bg-research-purple hover:bg-research-light-purple" 
                  : ""
              }`}
            >
              {selectedTopics.includes(topic) && (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              )}
              {topic}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            onClick={() => handleRestaurantClick(restaurant)} 
          />
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No restaurants match your selected topics.</p>
          {selectedTopics.length > 0 && (
            <Button 
              variant="link" 
              onClick={() => setSelectedTopics([])}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

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

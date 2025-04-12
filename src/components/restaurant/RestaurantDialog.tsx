
import { useState } from "react";
import { Utensils, Heart, Calendar, Award, Users, BookOpen, ChefHat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Restaurant } from "@/types/restaurant";
import JoinRestaurantDialog from "./JoinRestaurantDialog";

interface RestaurantDialogProps {
  restaurant: Restaurant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RestaurantDialog = ({ restaurant, open, onOpenChange }: RestaurantDialogProps) => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [likedDishes, setLikedDishes] = useState<string[]>([]);
  
  const isFull = restaurant.members.length >= 5;

  const handleLikeDish = (dishId: string) => {
    if (likedDishes.includes(dishId)) {
      setLikedDishes(likedDishes.filter(id => id !== dishId));
    } else {
      setLikedDishes([...likedDishes, dishId]);
    }
  };

  const getDishLikes = (dishId: string, baseLikes: number) => {
    return baseLikes + (likedDishes.includes(dishId) ? 1 : 0);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-research-purple" />
              <DialogTitle>{restaurant.name}</DialogTitle>
            </div>
            
            {restaurant.badges.length > 0 && (
              <div className="flex gap-1 mt-2">
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
          </DialogHeader>
          
          <div className="text-sm text-gray-600 mb-4">
            {restaurant.description}
          </div>
          
          <Tabs defaultValue="about">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="dishes">Dishes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4" />
                    Menu (Research Topics)
                  </h3>
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
                
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <ChefHat className="h-4 w-4" />
                    Kitchen Experience (Research Background)
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {restaurant.kitchenExperience.map((exp, index) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                    Requirements to Join
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {restaurant.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setIsJoinDialogOpen(true)}
                  disabled={isFull}
                  className="bg-research-purple hover:bg-research-light-purple"
                >
                  {isFull ? "Restaurant is Full" : "Apply to Join"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="members">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4" />
                  Current Members ({restaurant.members.length}/5)
                </h3>
                
                <div className="grid gap-3">
                  {restaurant.members.map((member) => (
                    <div key={member.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.institution}</p>
                      </div>
                      <div className="text-sm bg-gray-200 px-2 py-1 rounded text-gray-700">
                        {member.role}
                      </div>
                    </div>
                  ))}
                </div>
                
                {!isFull && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => setIsJoinDialogOpen(true)}
                      className="bg-research-purple hover:bg-research-light-purple"
                    >
                      Apply to Join
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="dishes">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4" />
                  Monthly Dishes
                </h3>
                
                {restaurant.dishes.length > 0 ? (
                  <div className="grid gap-4">
                    {restaurant.dishes.map((dish) => (
                      <div key={dish.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{dish.title}</h4>
                          <button 
                            onClick={() => handleLikeDish(dish.id)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                          >
                            <Heart 
                              className={`h-5 w-5 ${likedDishes.includes(dish.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{dish.description}</p>
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <span className="text-gray-500">{dish.date}</span>
                          <span className="text-gray-500">
                            {getDishLikes(dish.id, dish.likes)} likes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">
                    No dishes have been published yet.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <JoinRestaurantDialog 
        restaurant={restaurant}
        open={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
      />
    </>
  );
};

export default RestaurantDialog;

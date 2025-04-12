
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantList from "@/components/restaurant/RestaurantList";
import CreateRestaurantDialog from "@/components/restaurant/CreateRestaurantDialog";
import { Restaurant } from "@/types/restaurant";

const RestaurantPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: "1",
      name: "Neuro-Image Pizza",
      description: "Analyze neuroimaging data (CT, MRI, etc.) to detect diseases using machine learning.",
      menu: ["Deep learning", "CNNs", "RNNs", "Transformers"],
      kitchenExperience: ["Specializes in image analysis", "ML / AI background"],
      requirements: [
        "Basic knowledge of ML/DL",
        "Familiarity with neuroimaging datasets",
        "Collaborative mindset"
      ],
      members: [
        { id: "1", name: "Dr. Jennifer Lee", role: "Chef", institution: "Stanford University" },
        { id: "2", name: "Mike Chen", role: "Sous Chef", institution: "MIT" },
        { id: "3", name: "Sarah Kim", role: "Chef de Partie", institution: "Harvard University" }
      ],
      dishes: [
        {
          id: "1",
          title: "MRI-Based Tumor Detection Using Multi-Stage CNNs",
          description: "We developed a multi-stage CNN architecture for accurate tumor detection in MRI scans.",
          date: "April 2025",
          likes: 27
        }
      ],
      badges: ["3-star group"]
    },
    {
      id: "2",
      name: "Journal Club Bento",
      description: "Weekly discussions on the latest papers in computational biology and genomics.",
      menu: ["Genomics", "Bioinformatics", "Systems Biology"],
      kitchenExperience: ["Background in computational biology", "Experience in genomic data analysis"],
      requirements: [
        "Interest in computational biology",
        "Willingness to present papers",
        "Regular attendance"
      ],
      members: [
        { id: "4", name: "Dr. Alex Wong", role: "Chef", institution: "UCLA" },
        { id: "5", name: "Emily Johnson", role: "Sous Chef", institution: "UC Berkeley" }
      ],
      dishes: [
        {
          id: "2",
          title: "Review: Advances in Single-Cell RNA-seq Analysis",
          description: "A comprehensive review of the latest methods in single-cell RNA sequencing data analysis.",
          date: "March 2025",
          likes: 15
        }
      ],
      badges: []
    },
    {
      id: "3",
      name: "Deep Learning Curry",
      description: "Exploring innovative applications of deep learning in natural language processing.",
      menu: ["NLP", "Transformers", "LLMs", "Knowledge Graphs"],
      kitchenExperience: ["Expertise in NLP", "Experience with transformer architectures"],
      requirements: [
        "Strong programming skills",
        "Understanding of deep learning",
        "Interest in language models"
      ],
      members: [
        { id: "6", name: "Dr. Robert Park", role: "Chef", institution: "University of Washington" },
        { id: "7", name: "Lisa Chen", role: "Sous Chef", institution: "Carnegie Mellon" },
        { id: "8", name: "David Kim", role: "Chef de Partie", institution: "Georgia Tech" },
        { id: "9", name: "Maria Garcia", role: "Commis", institution: "University of Toronto" },
        { id: "10", name: "John Smith", role: "Commis", institution: "University of Michigan" }
      ],
      dishes: [
        {
          id: "3",
          title: "Fine-tuning LLMs for Specialized Scientific Domains",
          description: "We developed techniques to efficiently fine-tune large language models for specialized scientific terminology and reasoning.",
          date: "April 2025",
          likes: 42
        }
      ],
      badges: ["Michelin badge", "3-star group"]
    }
  ]);

  const handleCreateRestaurant = (newRestaurant: Restaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Research Restaurants</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-research-purple hover:bg-research-light-purple">
          <Plus className="h-4 w-4 mr-2" />
          Open a Restaurant
        </Button>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          Join a cozy research community where scholars collaborate like chefs in a kitchen.
          Each restaurant represents a small research group led by a passionate researcher.
        </p>
      </div>

      <RestaurantList restaurants={restaurants} />

      <CreateRestaurantDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRestaurant}
      />
    </div>
  );
};

export default RestaurantPage;

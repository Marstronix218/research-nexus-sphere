
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
      menu: ["Deep Learning", "CNNs", "RNNs", "Transformers", "Neuroimaging"],
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
      badges: ["3-star group"],
      storeImage: "/lovable-uploads/400ab1bc-496a-498b-b85f-5941eff1e0ba.png",
      location: {
        lat: 37.4275,
        lng: -122.1697,
        address: "Stanford, CA, USA"
      }
    },
    {
      id: "2",
      name: "Journal Club Bento",
      description: "Weekly discussions on the latest papers in computational biology and genomics.",
      menu: ["Genomics", "Bioinformatics", "Systems Biology", "RNA-seq"],
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
      badges: [],
      storeImage: "/lovable-uploads/0da06b86-73bb-4edb-9242-faf3f3127c0f.png",
      location: {
        lat: 34.0689,
        lng: -118.4452,
        address: "Los Angeles, CA, USA"
      }
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
      badges: ["Michelin badge", "3-star group"],
      storeImage: "/lovable-uploads/02a7c074-9fac-4371-b20d-bf3e19320493.png",
      location: {
        lat: 47.6553,
        lng: -122.3035,
        address: "Seattle, WA, USA"
      }
    },
    {
      id: "4",
      name: "Quantum Soup Kitchen",
      description: "Exploring quantum computing algorithms for optimization problems in various domains.",
      menu: ["Quantum Computing", "Optimization", "Algorithms"],
      kitchenExperience: ["Background in quantum physics", "Experience with quantum algorithms"],
      requirements: [
        "Basic knowledge of quantum mechanics",
        "Interest in computational optimization",
        "Programming experience"
      ],
      members: [
        { id: "11", name: "Dr. Sophia Chen", role: "Chef", institution: "Caltech" },
        { id: "12", name: "James Wilson", role: "Sous Chef", institution: "Princeton University" }
      ],
      dishes: [
        {
          id: "4",
          title: "QAOA for Supply Chain Optimization",
          description: "Implementation of Quantum Approximate Optimization Algorithm for solving complex supply chain problems.",
          date: "February 2025",
          likes: 31
        }
      ],
      badges: [],
      storeImage: "/lovable-uploads/400ab1bc-496a-498b-b85f-5941eff1e0ba.png",
      location: {
        lat: 34.1377,
        lng: -118.1252,
        address: "Pasadena, CA, USA"
      }
    },
    {
      id: "5",
      name: "Genomics Grill",
      description: "Analyzing genomic data to understand gene expression patterns and disease mechanisms.",
      menu: ["Genomics", "Systems Biology", "RNA-seq", "Bioinformatics"],
      kitchenExperience: ["Expertise in genomic analysis", "Experience with NGS data"],
      requirements: [
        "Background in molecular biology",
        "Basic bioinformatics skills",
        "Teamwork orientation"
      ],
      members: [
        { id: "13", name: "Dr. Emma Roberts", role: "Chef", institution: "Johns Hopkins University" },
        { id: "14", name: "Daniel Lee", role: "Sous Chef", institution: "University of Pennsylvania" },
        { id: "15", name: "Rachel Kim", role: "Chef de Partie", institution: "Yale University" }
      ],
      dishes: [
        {
          id: "5",
          title: "Multi-Omics Approach to Cancer Biomarker Discovery",
          description: "Integration of transcriptomics, proteomics, and metabolomics data for comprehensive cancer biomarker identification.",
          date: "March 2025",
          likes: 24
        }
      ],
      badges: ["3-star group"],
      storeImage: "/lovable-uploads/0da06b86-73bb-4edb-9242-faf3f3127c0f.png",
      location: {
        lat: 39.2976,
        lng: -76.5926,
        address: "Baltimore, MD, USA"
      }
    }
  ]);

  const handleCreateRestaurant = (newRestaurant: Restaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Restaurants</h1>
          <p className="text-gray-600 mt-1">
            Join a cozy research community where scholars collaborate like chefs in a kitchen.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-research-purple hover:bg-research-light-purple">
          <Plus className="h-4 w-4 mr-2" />
          Open a Restaurant
        </Button>
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

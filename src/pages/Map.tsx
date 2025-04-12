
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Info, Filter, Users, Sparkles } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { researchers } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Restaurant, ResearchTopic } from "@/types/restaurant";

// Example restaurant data import from RestaurantPage
import { useState as useRestaurantState } from "react";

const MAPBOX_TOKEN = "pk.eyJ1IjoibWVpNzc3IiwiYSI6ImNtOWVnc3IzeTFlaHAybHM3OHk0eDFtMTcifQ.yimW_QxaLnBt9ZAbrjcMaA";

// Sample topics for filtering
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

export default function Map() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResearchers, setFilteredResearchers] = useState(researchers);
  const [selectedTopics, setSelectedTopics] = useState<ResearchTopic[]>([]);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showResearchers, setShowResearchers] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<Restaurant | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get restaurant data from RestaurantPage
  const getRestaurants = () => {
    return [
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
    ];
  };

  const restaurants = getRestaurants();
  
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredResearchers(researchers);
      return;
    }

    const filtered = researchers.filter(
      (researcher) =>
        researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (researcher.institution &&
          researcher.institution.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (researcher.location &&
          researcher.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredResearchers(filtered);
  }, [searchTerm]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1.5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        setMapInitialized(true);
      });

      // Clean up on unmount
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Could not initialize map. Please check your connection.",
        variant: "destructive"
      });
    }
  }, []);

  // Add markers for restaurants and researchers
  useEffect(() => {
    if (!mapInitialized || !map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add restaurant markers
    if (showRestaurants) {
      restaurants.forEach(restaurant => {
        if (restaurant.location) {
          // Skip if filtered by topic
          if (selectedTopics.length > 0 && 
              !restaurant.menu.some(item => 
                selectedTopics.some(topic => 
                  item.toLowerCase().includes(topic.toLowerCase())
                )
              )) {
            return;
          }

          // Create HTML element for marker
          const el = document.createElement('div');
          el.className = 'restaurant-marker';
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/4183/4183362.png)';
          el.style.backgroundSize = 'cover';
          el.style.cursor = 'pointer';

          // Create popup content
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${restaurant.name}</h3>
              <p style="font-size: 12px; margin-bottom: 5px;">${restaurant.location.address}</p>
              <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-top: 5px;">
                ${restaurant.menu.slice(0, 3).map(topic => 
                  `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 10px; font-size: 10px;">${topic}</span>`
                ).join('')}
                ${restaurant.menu.length > 3 ? 
                  `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 10px; font-size: 10px;">+${restaurant.menu.length - 3}</span>` : 
                  ''
                }
              </div>
              <div style="display: flex; align-items: center; margin-top: 5px; font-size: 12px;">
                <span>Members: ${restaurant.members.length}/5</span>
                ${restaurant.members.length >= 5 ? 
                  '<span style="color: #f97316; margin-left: 5px;">(Full)</span>' : 
                  ''
                }
              </div>
              <div style="text-align: center; margin-top: 8px;">
                <button style="background: #9B59B6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                  View Details
                </button>
              </div>
            </div>
          `);

          // Create and add the marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([restaurant.location.lng, restaurant.location.lat])
            .setPopup(popup)
            .addTo(map.current!);

          // Add click event to navigate to restaurant page
          el.addEventListener('click', () => {
            setHoveredRestaurant(restaurant);
          });

          markers.current[`restaurant-${restaurant.id}`] = marker;
        }
      });
    }

    // Add researcher markers
    if (showResearchers) {
      filteredResearchers.forEach(researcher => {
        if (researcher.location) {
          // Create a random lat/lng if needed
          const [lat, lng] = researcher.location.split(',').map(Number);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            // Create HTML element for marker
            const el = document.createElement('div');
            el.className = 'researcher-marker';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/1077/1077012.png)';
            el.style.backgroundSize = 'cover';
            el.style.cursor = 'pointer';

            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 10px; max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${researcher.name}</h3>
                <p style="font-size: 12px; margin-bottom: 5px;">${researcher.institution}</p>
                <p style="font-size: 12px;">${researcher.location}</p>
              </div>
            `);

            // Create and add the marker
            const marker = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map.current!);

            markers.current[`researcher-${researcher.id}`] = marker;
          }
        }
      });
    }
  }, [mapInitialized, showRestaurants, showResearchers, filteredResearchers, restaurants, selectedTopics]);

  const handleTopicToggle = (topic: ResearchTopic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">
          Research World Map
        </h1>
        <p className="text-gray-600">
          Explore where researchers and research restaurants are located around the world.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Search & Filter</h3>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or location..."
                className="w-full p-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-research-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Display</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-restaurants"
                    checked={showRestaurants}
                    onChange={() => setShowRestaurants(!showRestaurants)}
                    className="mr-2"
                  />
                  <label htmlFor="show-restaurants" className="text-sm">Show Restaurants</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-researchers"
                    checked={showResearchers}
                    onChange={() => setShowResearchers(!showResearchers)}
                    className="mr-2"
                  />
                  <label htmlFor="show-researchers" className="text-sm">Show Researchers</label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Filter by Topic</h4>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {TOPICS.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTopicToggle(topic)}
                    className={`rounded-full whitespace-nowrap text-xs ${
                      selectedTopics.includes(topic) 
                        ? "bg-research-purple hover:bg-research-light-purple" 
                        : ""
                    }`}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>

            {hoveredRestaurant && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg animate-fade-in">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{hoveredRestaurant.name}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => setHoveredRestaurant(null)}
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{hoveredRestaurant.location?.address}</p>
                
                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>
                    {hoveredRestaurant.members.length}/5 members
                    {hoveredRestaurant.members.length >= 5 && <span className="ml-1 text-orange-500">(Full)</span>}
                  </span>
                </div>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {hoveredRestaurant.menu.slice(0, 3).map((item, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                    {hoveredRestaurant.menu.length > 3 && (
                      <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">
                        +{hoveredRestaurant.menu.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <Button
                    size="sm"
                    className="w-full text-xs bg-research-purple hover:bg-research-light-purple"
                    onClick={() => navigate('/restaurants')}
                  >
                    View Restaurant Page
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
              <h4 className="text-sm font-medium">Locations List</h4>
              {showResearchers && filteredResearchers.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs uppercase text-gray-500">Researchers</h5>
                  {filteredResearchers.map((researcher) => (
                    researcher.location ? (
                      <div
                        key={researcher.id}
                        className="p-2 bg-gray-50 rounded-lg flex items-start"
                      >
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-xs">{researcher.name}</p>
                          <p className="text-xs text-gray-500">
                            {researcher.institution || "Unknown institution"}
                          </p>
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              )}
              
              {showRestaurants && (
                <div className="space-y-2">
                  <h5 className="text-xs uppercase text-gray-500">Restaurants</h5>
                  {restaurants
                    .filter(restaurant => 
                      selectedTopics.length === 0 || 
                      restaurant.menu.some(item => 
                        selectedTopics.some(topic => 
                          item.toLowerCase().includes(topic.toLowerCase())
                        )
                      )
                    )
                    .map(restaurant => (
                      restaurant.location ? (
                        <div
                          key={restaurant.id}
                          className="p-2 bg-gray-50 rounded-lg flex items-start cursor-pointer hover:bg-gray-100"
                          onClick={() => setHoveredRestaurant(restaurant)}
                        >
                          <MapPin className="h-4 w-4 text-research-purple mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-xs">{restaurant.name}</p>
                            <p className="text-xs text-gray-500">
                              {restaurant.location.address}
                            </p>
                          </div>
                        </div>
                      ) : null
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-[600px] relative">
              <div ref={mapContainer} className="absolute inset-0" />
              {!mapInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-research-purple mx-auto mb-4 animate-pulse" />
                    <p className="text-lg font-medium text-gray-600">
                      Loading map...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="font-medium">Note:</span> This map shows the
              geographical distribution of researchers and research restaurants around the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

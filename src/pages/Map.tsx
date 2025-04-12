
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Info, Filter, Users, Sparkles, User } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { researchers } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Researcher, ResearchTopic } from "@/types/restaurant";

const MAPBOX_TOKEN = "pk.eyJ1IjoibWVpNzc3IiwiYSI6ImNtOWVnc3IzeTFlaHAybHM3OHk0eDFtMTcifQ.yimW_QxaLnBt9ZAbrjcMaA";

// Additional researcher data with location coordinates
const extendedResearchers: Researcher[] = [
  {
    id: "r1",
    name: "Shinnosuke Uesaka",
    institution: "University of Tokyo",
    location: "Tokyo, Japan",
    interests: ["Deep Learning", "Computer Vision", "Neural Networks"],
    lat: 35.6895,
    lng: 139.6917
  },
  {
    id: "r2",
    name: "Jeongmin Seo",
    institution: "Pusan National University",
    location: "Busan, South Korea",
    interests: ["Computational Biology", "Genomics", "Machine Learning"],
    lat: 35.1796,
    lng: 129.0756
  },
  {
    id: "r3",
    name: "Maria Rodriguez",
    institution: "University of Barcelona",
    location: "Barcelona, Spain",
    interests: ["Neuroscience", "Cognitive Computing", "AI Ethics"],
    lat: 41.3851,
    lng: 2.1734
  },
  {
    id: "r4",
    name: "David Chen",
    institution: "Stanford University",
    location: "Palo Alto, USA",
    interests: ["Natural Language Processing", "Large Language Models", "Knowledge Graphs"],
    lat: 37.4419,
    lng: -122.1430
  },
  {
    id: "r5",
    name: "Sara Ahmed",
    institution: "University of Cairo",
    location: "Cairo, Egypt",
    interests: ["Computer Vision", "Pattern Recognition", "Medical Imaging"],
    lat: 30.0444,
    lng: 31.2357
  },
  {
    id: "r6",
    name: "Lukas Müller",
    institution: "ETH Zurich",
    location: "Zurich, Switzerland",
    interests: ["Quantum Computing", "Quantum Machine Learning", "Optimization"],
    lat: 47.3769,
    lng: 8.5417
  },
  {
    id: "r7",
    name: "Priya Sharma",
    institution: "Indian Institute of Technology",
    location: "Mumbai, India",
    interests: ["Computer Graphics", "AR/VR", "Human-Computer Interaction"],
    lat: 19.0760,
    lng: 72.8777
  },
  {
    id: "r8",
    name: "James Wilson",
    institution: "University of Melbourne",
    location: "Melbourne, Australia",
    interests: ["Cybersecurity", "Network Science", "Blockchain"],
    lat: -37.8136,
    lng: 144.9631
  },
  {
    id: "r9",
    name: "Ana Silva",
    institution: "University of São Paulo",
    location: "São Paulo, Brazil",
    interests: ["Data Mining", "Social Network Analysis", "Computational Social Science"],
    lat: -23.5505,
    lng: -46.6333
  },
  {
    id: "r10",
    name: "Emmanuel Osei",
    institution: "University of Ghana",
    location: "Accra, Ghana",
    interests: ["AI for Development", "Mobile Computing", "Educational Technology"],
    lat: 5.6037,
    lng: -0.1870
  }
];

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
  const [filteredResearchers, setFilteredResearchers] = useState(extendedResearchers);
  const [selectedTopics, setSelectedTopics] = useState<ResearchTopic[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [hoveredResearcher, setHoveredResearcher] = useState<Researcher | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter researchers based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredResearchers(extendedResearchers);
      return;
    }

    const filtered = extendedResearchers.filter(
      (researcher) =>
        researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (researcher.institution &&
          researcher.institution.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (researcher.location &&
          researcher.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        researcher.interests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
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

  // Add markers for researchers
  useEffect(() => {
    if (!mapInitialized || !map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add researcher markers
    filteredResearchers.forEach(researcher => {
      if (researcher.lat && researcher.lng) {
        // Skip if filtered by topic
        if (selectedTopics.length > 0 && 
            !researcher.interests.some(interest => 
              selectedTopics.some(topic => 
                interest.toLowerCase().includes(topic.toLowerCase())
              )
            )) {
          return;
        }

        // Create HTML element for marker
        const el = document.createElement('div');
        el.className = 'researcher-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/1077/1077012.png)';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';

        // Create popup content
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${researcher.name}</h3>
            <p style="font-size: 12px; margin-bottom: 5px;">${researcher.institution || 'No institution'}</p>
            <p style="font-size: 12px; margin-bottom: 8px;">${researcher.location || 'No location'}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-top: 5px;">
              ${researcher.interests.slice(0, 3).map(interest => 
                `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 10px; font-size: 10px;">${interest}</span>`
              ).join('')}
              ${researcher.interests.length > 3 ? 
                `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 10px; font-size: 10px;">+${researcher.interests.length - 3}</span>` : 
                ''
              }
            </div>
            <div style="text-align: center; margin-top: 8px;">
              <button style="background: #9B59B6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                Visit Profile
              </button>
            </div>
          </div>
        `);

        // Create and add the marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([researcher.lng, researcher.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add click event to show researcher details
        el.addEventListener('click', () => {
          setHoveredResearcher(researcher);
        });

        markers.current[`researcher-${researcher.id}`] = marker;
      }
    });
  }, [mapInitialized, filteredResearchers, selectedTopics]);

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
          Global Researcher Map
        </h1>
        <p className="text-gray-600">
          Discover researchers around the world based on location and research interests.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Search & Filter</h3>

            <div className="relative mb-4">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, location or interest..."
                className="w-full p-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-research-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Filter by Research Interest</h4>
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

            {hoveredResearcher && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg animate-fade-in">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{hoveredResearcher.name}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => setHoveredResearcher(null)}
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{hoveredResearcher.institution}</p>
                <p className="text-xs text-gray-500">{hoveredResearcher.location}</p>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {hoveredResearcher.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <Button
                    size="sm"
                    className="w-full text-xs bg-research-purple hover:bg-research-light-purple"
                    onClick={() => navigate(`/researchers/${hoveredResearcher.id}`)}
                  >
                    Visit Profile
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
              <h4 className="text-sm font-medium">Researchers List</h4>
              {filteredResearchers.length === 0 ? (
                <p className="text-gray-500 text-sm py-2">No researchers match your search criteria.</p>
              ) : (
                <div className="space-y-2 mt-2">
                  {filteredResearchers
                    .filter(researcher => 
                      selectedTopics.length === 0 || 
                      researcher.interests.some(interest => 
                        selectedTopics.some(topic => 
                          interest.toLowerCase().includes(topic.toLowerCase())
                        )
                      )
                    )
                    .map(researcher => (
                      <div
                        key={researcher.id}
                        className="p-2 bg-gray-50 rounded-lg flex items-start cursor-pointer hover:bg-gray-100"
                        onClick={() => setHoveredResearcher(researcher)}
                      >
                        <User className="h-4 w-4 text-research-purple mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-xs">{researcher.name}</p>
                          <p className="text-xs text-gray-500">
                            {researcher.location || 'No location'}
                          </p>
                        </div>
                      </div>
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
              geographical distribution of researchers around the world.
              Click on a researcher marker to view their details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

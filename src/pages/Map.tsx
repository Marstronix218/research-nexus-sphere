
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Info } from "lucide-react";
import { researchers } from "@/data/mockData";

export default function Map() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResearchers, setFilteredResearchers] = useState(researchers);
  const [mapApiKey, setMapApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

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

  const handleMapKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapApiKey.trim()) {
      setShowApiKeyInput(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">
          Researcher Map
        </h1>
        <p className="text-gray-600">
          Explore where researchers are located around the world.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Search Locations</h3>

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

            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium">Researcher Locations</h4>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredResearchers.map((researcher) => (
                  <div
                    key={researcher.id}
                    className="p-3 bg-gray-50 rounded-lg flex items-start"
                  >
                    <MapPin className="h-5 w-5 text-research-purple mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{researcher.name}</p>
                      <p className="text-xs text-gray-500">
                        {researcher.institution || "Unknown institution"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {researcher.location || "Unknown location"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {showApiKeyInput ? (
              <div className="flex flex-col items-center justify-center p-10 h-[600px]">
                <div className="max-w-md text-center">
                  <Info className="h-12 w-12 text-research-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Map API Key Required</h3>
                  <p className="text-gray-600 mb-6">
                    To display the interactive map of researchers, please enter a
                    Mapbox API key.
                  </p>
                  <form onSubmit={handleMapKeySubmit} className="space-y-4">
                    <input
                      type="text"
                      value={mapApiKey}
                      onChange={(e) => setMapApiKey(e.target.value)}
                      placeholder="Enter your Mapbox public token"
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-research-purple"
                    />
                    <Button type="submit" className="w-full">
                      Display Map
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-4">
                    You can get a free Mapbox API key by signing up at{" "}
                    <a
                      href="https://mapbox.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-research-purple hover:underline"
                    >
                      mapbox.com
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[600px] bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-600">
                    Map visualization would appear here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Using Mapbox API with key: {mapApiKey.substring(0, 5)}...
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowApiKeyInput(true)}
                  >
                    Change API Key
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="font-medium">Note:</span> This map shows the
              geographical distribution of researchers based on their affiliated
              institutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

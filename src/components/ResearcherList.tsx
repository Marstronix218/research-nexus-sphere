import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ResearcherCard from "./ResearcherCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X } from "lucide-react";

export type Researcher = {
  id: string;
  name: string;
  institution: string;
  department?: string;
  interests: string[];
  publications: number;
  citations: number;
  hIndex: number;
  bio: string;
  photoUrl: string;
  avatar?: string;
  citedBy?: string[];
  cites?: string[];
};

export default function ResearcherList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [minCitations, setMinCitations] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allInterests, setAllInterests] = useState<string[]>([]);

  useEffect(() => {
    const fetchResearchers = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("researchers")
        .select("*");
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setResearchers(data || []);
      // Collect all unique interests
      const interestsSet = new Set<string>();
      (data || []).forEach((r: Researcher) => {
        r.interests.forEach((i) => interestsSet.add(i));
      });
      setAllInterests(Array.from(interestsSet));
      setLoading(false);
    };
    fetchResearchers();
  }, []);

  // Filter researchers based on search and filters
  const filteredResearchers = researchers.filter((researcher) => {
    // Search by name or institution
    const matchesSearch =
      searchTerm === "" ||
      researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      researcher.institution.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by selected interests
    const matchesInterests =
      selectedInterests.length === 0 ||
      selectedInterests.some((interest) => researcher.interests.includes(interest));

    // Filter by citation count
    const matchesCitations = researcher.citations >= minCitations;

    return matchesSearch && matchesInterests && matchesCitations;
  });

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const clearFilters = () => {
    setSelectedInterests([]);
    setMinCitations(0);
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-research-blue">Find Researchers</h1>

          <div className="flex gap-2 items-center">
            <div className="relative flex-grow max-w-md">
              <Input
                type="text"
                placeholder="Search by name or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-gray-100" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                Clear all
              </Button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Research Interests</h4>
              <div className="flex flex-wrap gap-2">
                {allInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedInterests.includes(interest)
                        ? "bg-research-purple hover:bg-research-light-purple"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Minimum Citations</h4>
                <span className="text-sm font-medium">{minCitations}+</span>
              </div>
              <Slider
                defaultValue={[minCitations]}
                max={7000}
                step={500}
                onValueChange={(values) => setMinCitations(values[0])}
              />
            </div>
          </div>
        )}

        {(selectedInterests.length > 0 || minCitations > 0) && (
          <div className="flex items-center gap-2 text-sm text-gray-500 animate-fade-in">
            <span>Filters:</span>
            {selectedInterests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1">
                {interest}
                <button onClick={() => toggleInterest(interest)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {minCitations > 0 && (
              <Badge variant="secondary" className="gap-1">
                {minCitations}+ citations
                <button onClick={() => setMinCitations(0)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">Loading researchers...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600 mb-2">Error loading researchers</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : filteredResearchers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResearchers.map((researcher) => (
            <ResearcherCard key={researcher.id} researcher={researcher} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No researchers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find more researchers.</p>
        </div>
      )}
    </div>
  );
}

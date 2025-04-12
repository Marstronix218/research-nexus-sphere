
import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Tag, 
  Users, 
  Filter,
  ChevronRight, 
  ChevronDown, 
  ExternalLink 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock event data
const events = [
  {
    id: "1",
    title: "International Conference on Machine Learning (ICML)",
    description: "ICML is one of the premier gatherings in machine learning, bringing together researchers from academia and industry to present and discuss the latest advances in the field.",
    dateStart: "2024-07-21",
    dateEnd: "2024-07-27",
    location: "Vienna, Austria",
    type: "Conference",
    website: "https://icml.cc/",
    topics: ["Machine Learning", "Deep Learning", "Reinforcement Learning"],
    isFeatured: true,
    isVirtual: false
  },
  {
    id: "2",
    title: "Virtual Workshop on NLP Advances",
    description: "A three-day virtual workshop exploring the latest breakthroughs in natural language processing and their applications in various domains.",
    dateStart: "2024-05-15",
    dateEnd: "2024-05-17",
    location: "Online",
    type: "Workshop",
    website: "https://example.com/nlp-workshop",
    topics: ["Natural Language Processing", "Transformer Models", "Text Mining"],
    isFeatured: false,
    isVirtual: true
  },
  {
    id: "3",
    title: "Research Methods in Computational Biology Symposium",
    description: "This symposium focuses on innovative research methods in computational biology and bioinformatics, with hands-on sessions and distinguished speakers.",
    dateStart: "2024-06-10",
    dateEnd: "2024-06-12",
    location: "Boston, MA, USA",
    type: "Symposium",
    website: "https://example.com/compbio-symposium",
    topics: ["Computational Biology", "Bioinformatics", "Genomics"],
    isFeatured: true,
    isVirtual: false
  },
  {
    id: "4",
    title: "Annual Quantum Computing Forum",
    description: "Join leading quantum computing researchers and industry experts to discuss the latest advancements and challenges in quantum algorithms and hardware.",
    dateStart: "2024-09-05",
    dateEnd: "2024-09-07",
    location: "Zurich, Switzerland",
    type: "Forum",
    website: "https://example.com/quantum-forum",
    topics: ["Quantum Computing", "Quantum Algorithms", "Quantum Hardware"],
    isFeatured: false,
    isVirtual: false
  },
  {
    id: "5",
    title: "Ethical AI Research Webinar Series",
    description: "A monthly webinar series addressing ethical considerations in AI research and development, featuring panel discussions with experts from diverse backgrounds.",
    dateStart: "2024-04-01",
    dateEnd: "2024-12-31",
    location: "Online",
    type: "Webinar",
    website: "https://example.com/ethical-ai-webinars",
    topics: ["AI Ethics", "Responsible AI", "Fairness in ML"],
    isFeatured: false,
    isVirtual: true
  }
];

// Get upcoming events (those that end after today)
const today = new Date();
const upcomingEvents = events.filter(
  event => new Date(event.dateEnd) >= today
).sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());

// Get past events (those that ended before today)
const pastEvents = events.filter(
  event => new Date(event.dateEnd) < today
).sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());

// Extract all unique event types and topics
const eventTypes = Array.from(new Set(events.map(event => event.type))).sort();
const eventTopics = Array.from(new Set(events.flatMap(event => event.topics))).sort();

export default function Events() {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showVirtual, setShowVirtual] = useState<boolean | undefined>(undefined);
  const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([]);
  
  const filterEvents = (eventList: typeof events) => {
    return eventList.filter(event => {
      const matchesType = selectedEventTypes.length === 0 || 
        selectedEventTypes.includes(event.type);
        
      const matchesTopic = selectedTopics.length === 0 || 
        event.topics.some(topic => selectedTopics.includes(topic));
        
      const matchesVirtual = showVirtual === undefined ||
        (showVirtual === true && event.isVirtual) ||
        (showVirtual === false && !event.isVirtual);
        
      return matchesType && matchesTopic && matchesVirtual;
    });
  };
  
  const filteredUpcomingEvents = filterEvents(upcomingEvents);
  const filteredPastEvents = filterEvents(pastEvents);
  
  const toggleDescription = (eventId: string) => {
    setExpandedDescriptions(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };
  
  const toggleEventType = (type: string) => {
    setSelectedEventTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };
  
  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedTopics([]);
    setShowVirtual(undefined);
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Same day event
    if (start === end) {
      return startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    // Same month event
    if (startDate.getMonth() === endDate.getMonth() && 
        startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${endDate.toLocaleDateString('en-US', {day: 'numeric', year: 'numeric'})}`;
    }
    
    // Different month event
    return `${startDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${endDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">Research Events</h1>
        <p className="text-gray-600">
          Discover conferences, workshops, and other events in your research area.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Event Type
              </h4>
              
              <div className="space-y-2 pl-1">
                {eventTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <Checkbox 
                      id={`type-${type}`}
                      checked={selectedEventTypes.includes(type)}
                      onCheckedChange={() => toggleEventType(type)}
                    />
                    <label 
                      htmlFor={`type-${type}`}
                      className="ml-2 text-sm cursor-pointer hover:text-research-purple"
                    >
                      {type} ({events.filter(e => e.type === type).length})
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Research Topics
              </h4>
              
              <div className="max-h-40 overflow-y-auto space-y-2 pl-1">
                {eventTopics.map(topic => (
                  <div key={topic} className="flex items-center">
                    <Checkbox 
                      id={`topic-${topic}`}
                      checked={selectedTopics.includes(topic)}
                      onCheckedChange={() => toggleTopic(topic)}
                    />
                    <label 
                      htmlFor={`topic-${topic}`}
                      className="ml-2 text-sm cursor-pointer hover:text-research-purple"
                    >
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Event Format</h4>
              
              <div className="flex space-x-2">
                <Button
                  variant={showVirtual === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowVirtual(prev => prev === false ? undefined : false)}
                  className="flex-1 text-xs"
                >
                  In-Person
                </Button>
                <Button
                  variant={showVirtual === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowVirtual(prev => prev === true ? undefined : true)}
                  className="flex-1 text-xs"
                >
                  Virtual
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="w-full"
              disabled={selectedEventTypes.length === 0 && selectedTopics.length === 0 && showVirtual === undefined}
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        <div className="md:w-3/4">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Events ({filteredUpcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Past Events ({filteredPastEvents.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6">
              {filteredUpcomingEvents.length > 0 ? (
                filteredUpcomingEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`bg-white rounded-lg shadow overflow-hidden ${event.isFeatured ? 'border border-research-purple' : ''}`}
                  >
                    {event.isFeatured && (
                      <div className="bg-research-purple text-white px-4 py-1 text-sm font-medium">
                        Featured Event
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="sm:flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {event.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateRange(event.dateStart, event.dateEnd)}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </Badge>
                            <Badge variant="secondary">
                              {event.type}
                            </Badge>
                            {event.isVirtual && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Virtual
                              </Badge>
                            )}
                          </div>
                          
                          <div className={expandedDescriptions.includes(event.id) ? "" : "line-clamp-2"}>
                            <p className="text-gray-600">{event.description}</p>
                          </div>
                          
                          {expandedDescriptions.includes(event.id) && (
                            <div className="mt-3 space-y-2">
                              <div>
                                <h4 className="text-sm font-medium">Topics:</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {event.topics.map(topic => (
                                    <Badge key={topic} variant="secondary" className="text-xs">
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-research-blue text-white hover:bg-research-blue/90 h-10 px-4 py-2"
                          >
                            Visit Website <ExternalLink className="ml-1 h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDescription(event.id)}
                        className="mt-2 text-research-purple hover:text-research-purple/80"
                      >
                        {expandedDescriptions.includes(event.id) ? (
                          <>Less Details <ChevronDown className="ml-1 h-4 w-4" /></>
                        ) : (
                          <>More Details <ChevronRight className="ml-1 h-4 w-4" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Upcoming Events Found</h3>
                  <p className="text-gray-500">
                    There are no upcoming events matching your filter criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6">
              {filteredPastEvents.length > 0 ? (
                filteredPastEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-lg shadow overflow-hidden opacity-80"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateRange(event.dateStart, event.dateEnd)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </Badge>
                        <Badge variant="secondary">
                          {event.type}
                        </Badge>
                      </div>
                      
                      <div className={expandedDescriptions.includes(event.id) ? "" : "line-clamp-2"}>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDescription(event.id)}
                          className="text-research-purple hover:text-research-purple/80"
                        >
                          {expandedDescriptions.includes(event.id) ? (
                            <>Less <ChevronDown className="ml-1 h-4 w-4" /></>
                          ) : (
                            <>More <ChevronRight className="ml-1 h-4 w-4" /></>
                          )}
                        </Button>
                        
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-research-blue hover:text-research-purple flex items-center"
                        >
                          View Archives <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Past Events Found</h3>
                  <p className="text-gray-500">
                    There are no past events matching your filter criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

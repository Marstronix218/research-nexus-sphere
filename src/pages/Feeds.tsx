
import { useState } from "react";
import { 
  Bell, 
  RefreshCw, 
  Bookmark, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  User, 
  Calendar, 
  Tag, 
  Search, 
  Filter,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// Mock feed data
const feedItems = [
  {
    id: "1",
    type: "publication",
    title: "New Research Paper Published: Deep Learning for Climate Prediction",
    author: {
      id: "auth1",
      name: "Dr. Son Heung-min Jr.",
      avatar: "/placeholder.svg",
      institution: "Stanford University",
      isFollowing: true
    },
    date: "2024-04-10T14:30:00Z",
    content: "I'm excited to announce the publication of our latest research on applying deep learning methods to improve climate prediction models. This work represents a collaboration across multiple institutions.",
    link: "https://example.com/paper/123",
    tags: ["Machine Learning", "Climate Science", "Neural Networks"],
    likes: 42,
    comments: 7,
    isBookmarked: true
  },
  {
    id: "2",
    type: "announcement",
    title: "Call for Papers: International Conference on AI Ethics",
    author: {
      id: "auth2",
      name: "Dr. Jung Min",
      avatar: "/placeholder.svg",
      institution: "MIT",
      isFollowing: false
    },
    date: "2024-04-09T10:15:00Z",
    content: "The 2024 International Conference on AI Ethics is now accepting submissions. We're looking for papers addressing responsible AI development, fairness in machine learning, and policy recommendations.",
    link: "https://example.com/conference/ai-ethics",
    tags: ["AI Ethics", "Conference", "Call for Papers"],
    likes: 28,
    comments: 3,
    isBookmarked: false
  },
  {
    id: "3",
    type: "collaboration",
    title: "Seeking Collaborators for Quantum Computing Project",
    author: {
      id: "auth3",
      name: "Dr. Uesaka Shinnosuke",
      avatar: "/placeholder.svg",
      institution: "Caltech",
      isFollowing: true
    },
    date: "2024-04-08T16:45:00Z",
    content: "Our lab is initiating a new project on quantum algorithms for optimization problems. We're looking for collaborators with expertise in quantum computing theory or implementation. If interested, please reach out!",
    link: null,
    tags: ["Quantum Computing", "Collaboration", "Algorithms"],
    likes: 19,
    comments: 12,
    isBookmarked: false
  },
  {
    id: "4",
    type: "event",
    title: "Upcoming Workshop: Advanced Research Methods in Bioinformatics",
    author: {
      id: "auth4",
      name: "Dr. Hyunwoo Lee",
      avatar: "/placeholder.svg",
      institution: "Harvard Medical School",
      isFollowing: true
    },
    date: "2024-04-07T09:20:00Z",
    content: "I'll be hosting a virtual workshop on advanced research methods in bioinformatics next month. Topics will include next-generation sequencing analysis, protein structure prediction, and network biology approaches.",
    link: "https://example.com/workshop/bioinformatics",
    tags: ["Bioinformatics", "Workshop", "Genomics"],
    likes: 34,
    comments: 5,
    isBookmarked: true
  },
  {
    id: "5",
    type: "achievement",
    title: "Research Team Receives Major Grant for Sustainable Energy Research",
    author: {
      id: "auth5",
      name: "Dr. Moonsup Kip",
      avatar: "/placeholder.svg",
      institution: "University of California, Berkeley",
      isFollowing: false
    },
    date: "2024-04-06T11:10:00Z",
    content: "Thrilled to announce that our research team has been awarded a $3.5 million grant to advance our work on novel materials for sustainable energy storage. We're looking forward to making significant progress in this critical area.",
    link: "https://example.com/grant/energy-research",
    tags: ["Sustainable Energy", "Grant", "Materials Science"],
    likes: 76,
    comments: 15,
    isBookmarked: false
  }
];

// Extract all unique feed item types and tags
const feedTypes = Array.from(new Set(feedItems.map(item => item.type))).sort();
const feedTags = Array.from(new Set(feedItems.flatMap(item => item.tags))).sort();

export default function Feeds() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeedTypes, setSelectedFeedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyFollowing, setShowOnlyFollowing] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(
    feedItems.filter(item => item.isBookmarked).map(item => item.id)
  );
  
  const toggleFeedType = (type: string) => {
    setSelectedFeedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const resetFilters = () => {
    setSelectedFeedTypes([]);
    setSelectedTags([]);
    setSearchTerm("");
    setShowOnlyFollowing(false);
  };
  
  const filterFeedItems = (items: typeof feedItems) => {
    return items.filter(item => {
      const matchesType = selectedFeedTypes.length === 0 || 
        selectedFeedTypes.includes(item.type);
        
      const matchesTags = selectedTags.length === 0 || 
        item.tags.some(tag => selectedTags.includes(tag));
        
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFollowing = !showOnlyFollowing || item.author.isFollowing;
        
      return matchesType && matchesTags && matchesSearch && matchesFollowing;
    });
  };
  
  const filteredFeedItems = filterFeedItems(feedItems);
  const filteredBookmarkedItems = filteredFeedItems.filter(item => 
    bookmarkedItems.includes(item.id)
  );

  const refreshFeed = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">Research Feeds</h1>
        <p className="text-gray-600">
          Stay updated with the latest research activities, publications, and announcements from your network.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            
            <div className="relative mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search feeds..."
                className="w-full p-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-research-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Checkbox 
                  id="following-only"
                  checked={showOnlyFollowing}
                  onCheckedChange={() => setShowOnlyFollowing(!showOnlyFollowing)}
                />
                <label 
                  htmlFor="following-only"
                  className="ml-2 text-sm cursor-pointer hover:text-research-purple flex items-center"
                >
                  <UserCheck className="h-4 w-4 mr-1 text-research-purple" />
                  Show only accounts I follow
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Content Type
              </h4>
              
              <div className="space-y-2 pl-1">
                {feedTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <Checkbox 
                      id={`type-${type}`}
                      checked={selectedFeedTypes.includes(type)}
                      onCheckedChange={() => toggleFeedType(type)}
                    />
                    <label 
                      htmlFor={`type-${type}`}
                      className="ml-2 text-sm capitalize cursor-pointer hover:text-research-purple"
                    >
                      {type} ({feedItems.filter(item => item.type === type).length})
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Topics
              </h4>
              
              <div className="max-h-40 overflow-y-auto space-y-2 pl-1">
                {feedTags.map(tag => (
                  <div key={tag} className="flex items-center">
                    <Checkbox 
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <label 
                      htmlFor={`tag-${tag}`}
                      className="ml-2 text-sm cursor-pointer hover:text-research-purple"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="w-full"
              disabled={selectedFeedTypes.length === 0 && selectedTags.length === 0 && searchTerm === "" && !showOnlyFollowing}
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        <div className="md:w-3/4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-research-blue">Latest Updates</h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshFeed}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                All Updates ({filteredFeedItems.length})
              </TabsTrigger>
              <TabsTrigger value="bookmarked" className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmarked ({filteredBookmarkedItems.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredFeedItems.length > 0 ? (
                filteredFeedItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.author.avatar} alt={item.author.name} />
                          <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 flex items-center">
                                {item.author.name}
                                {item.author.isFollowing && (
                                  <UserCheck className="h-4 w-4 ml-1 text-research-purple" title="You follow this account" />
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.author.institution} · {formatDate(item.date)}
                              </p>
                            </div>
                            
                            <Badge className="capitalize">{item.type}</Badge>
                          </div>
                          
                          <h4 className="font-medium text-lg mt-2">{item.title}</h4>
                          
                          <p className="mt-2 text-gray-700">{item.content}</p>
                          
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 text-research-blue hover:text-research-purple text-sm"
                            >
                              View more details →
                            </a>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-research-purple text-sm">
                              <ThumbsUp className="h-4 w-4" />
                              {item.likes}
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-research-purple text-sm">
                              <MessageSquare className="h-4 w-4" />
                              {item.comments}
                            </button>
                            <button 
                              className={`flex items-center gap-1 text-sm ${
                                bookmarkedItems.includes(item.id) 
                                  ? 'text-research-purple' 
                                  : 'text-gray-500 hover:text-research-purple'
                              }`}
                              onClick={() => toggleBookmark(item.id)}
                            >
                              <Bookmark className="h-4 w-4" />
                              {bookmarkedItems.includes(item.id) ? 'Saved' : 'Save'}
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-research-purple text-sm ml-auto">
                              <Share2 className="h-4 w-4" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Updates Found</h3>
                  <p className="text-gray-500">
                    There are no feed items matching your filter criteria.
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
            
            <TabsContent value="bookmarked" className="space-y-4">
              {filteredBookmarkedItems.length > 0 ? (
                filteredBookmarkedItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.author.avatar} alt={item.author.name} />
                          <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 flex items-center">
                                {item.author.name}
                                {item.author.isFollowing && (
                                  <UserCheck className="h-4 w-4 ml-1 text-research-purple" title="You follow this account" />
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.author.institution} · {formatDate(item.date)}
                              </p>
                            </div>
                            
                            <Badge className="capitalize">{item.type}</Badge>
                          </div>
                          
                          <h4 className="font-medium text-lg mt-2">{item.title}</h4>
                          
                          <p className="mt-2 text-gray-700">{item.content}</p>
                          
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 text-research-blue hover:text-research-purple text-sm"
                            >
                              View more details →
                            </a>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-research-purple text-sm">
                              <ThumbsUp className="h-4 w-4" />
                              {item.likes}
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-research-purple text-sm">
                              <MessageSquare className="h-4 w-4" />
                              {item.comments}
                            </button>
                            <button 
                              className="flex items-center gap-1 text-research-purple text-sm"
                              onClick={() => toggleBookmark(item.id)}
                            >
                              <Bookmark className="h-4 w-4" />
                              Saved
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-research-purple text-sm ml-auto">
                              <Share2 className="h-4 w-4" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Bookmark className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Bookmarked Items</h3>
                  <p className="text-gray-500">
                    You haven't bookmarked any feed items yet, or they don't match your current filters.
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

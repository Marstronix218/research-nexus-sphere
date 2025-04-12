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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock feed data
const feedItems = [
  {
    id: "1",
    type: "publication",
    title: "New Research Paper Published: Deep Learning for Climate Prediction",
    author: {
      id: "auth1",
      name: "Dr. Son Heung-min Jr.",
      avatar: "https://randomuser.me/api/portraits/men/26.jpg",
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
      avatar: "https://randomuser.me/api/portraits/men/27.jpg",
      institution: "MIT",
      isFollowing: true
    },
    date: "2024-04-09T09:15:00Z",
    content: "The International Conference on AI Ethics is now accepting paper submissions. This year's theme focuses on 'Responsible AI in Healthcare and Education'. Submission deadline: June 15, 2024.",
    link: "https://example.com/conference/ai-ethics",
    tags: ["AI Ethics", "Conference", "Call for Papers"],
    likes: 28,
    comments: 5,
    isBookmarked: false
  },
  {
    id: "3",
    type: "event",
    title: "Workshop: Advanced Techniques in Quantum Computing",
    author: {
      id: "auth3",
      name: "Prof. Elena Martinez",
      avatar: "https://randomuser.me/api/portraits/women/26.jpg",
      institution: "MIT",
      isFollowing: false
    },
    date: "2024-04-08T16:45:00Z",
    content: "Join us for a two-day workshop on advanced quantum computing techniques. The workshop will cover quantum algorithms, error correction, and practical implementation challenges.",
    link: "https://example.com/workshop/quantum",
    tags: ["Quantum Computing", "Workshop", "Research"],
    likes: 35,
    comments: 12,
    isBookmarked: true
  },
  {
    id: "4",
    type: "publication",
    title: "New Findings in Neuroplasticity Research",
    author: {
      id: "auth4",
      name: "Dr. Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/27.jpg",
      institution: "UC Berkeley",
      isFollowing: true
    },
    date: "2024-04-07T11:20:00Z",
    content: "Our team has discovered new insights into adult neuroplasticity, challenging previous assumptions about the brain's ability to reorganize itself. The findings have significant implications for rehabilitation therapies.",
    link: "https://example.com/paper/124",
    tags: ["Neuroscience", "Neuroplasticity", "Research"],
    likes: 56,
    comments: 9,
    isBookmarked: true
  },
  {
    id: "5",
    type: "announcement",
    title: "Research Grant Opportunity: Sustainable Energy Solutions",
    author: {
      id: "auth5",
      name: "Dr. David Kim",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      institution: "Columbia University",
      isFollowing: false
    },
    date: "2024-04-06T13:10:00Z",
    content: "The National Science Foundation is offering grants for research projects focused on sustainable energy solutions. Applications are due by August 1, 2024.",
    link: "https://example.com/grants/sustainable-energy",
    tags: ["Grants", "Sustainable Energy", "Funding"],
    likes: 31,
    comments: 4,
    isBookmarked: false
  },
  {
    id: "6",
    type: "event",
    title: "Seminar Series: Advances in Bioinformatics",
    author: {
      id: "auth6",
      name: "Dr. Lisa Wong",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      institution: "Oxford University",
      isFollowing: true
    },
    date: "2024-04-05T15:30:00Z",
    content: "Join our weekly seminar series exploring the latest advances in bioinformatics. This week's topic: 'Machine Learning Approaches to Genomic Data Analysis'.",
    link: "https://example.com/seminars/bioinformatics",
    tags: ["Bioinformatics", "Seminar", "Machine Learning"],
    likes: 27,
    comments: 6,
    isBookmarked: true
  },
  {
    id: "7",
    type: "publication",
    title: "Breakthrough in Robotics: New Humanoid Robot Design",
    author: {
      id: "auth7",
      name: "Prof. Robert Williams",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg",
      institution: "Carnegie Mellon University",
      isFollowing: false
    },
    date: "2024-04-04T10:05:00Z",
    content: "Our team has developed a new humanoid robot design that significantly improves balance and mobility. The design incorporates novel materials and control algorithms.",
    link: "https://example.com/paper/125",
    tags: ["Robotics", "Engineering", "Research"],
    likes: 48,
    comments: 11,
    isBookmarked: false
  },
  {
    id: "8",
    type: "announcement",
    title: "New Research Collaboration Opportunity",
    author: {
      id: "auth8",
      name: "Dr. Alexandra Novak",
      avatar: "https://randomuser.me/api/portraits/women/29.jpg",
      institution: "DeepMind",
      isFollowing: true
    },
    date: "2024-04-03T14:20:00Z",
    content: "We're seeking collaborators for a new research project on AI safety and alignment. The project will focus on developing robust methods for ensuring AI systems behave as intended.",
    link: "https://example.com/collaboration/ai-safety",
    tags: ["AI Safety", "Collaboration", "Research"],
    likes: 39,
    comments: 8,
    isBookmarked: true
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
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <UserCheck className="h-4 w-4 ml-1 text-research-purple" aria-label="You follow this account" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>You follow this account</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
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
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <UserCheck className="h-4 w-4 ml-1 text-research-purple" aria-label="You follow this account" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>You follow this account</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
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

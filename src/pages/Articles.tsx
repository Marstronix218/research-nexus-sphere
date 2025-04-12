
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Calendar, 
  User, 
  ArrowUpRight, 
  ChevronDown,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox";

// Mock article data
const articles = [
  {
    id: "1",
    title: "Advances in Neural Network Applications for Climate Model Prediction",
    authors: ["Lim Nayeon", "Kim Chaeyoung", "Park Jihyo"],
    journal: "Nature Climate Change",
    publicationDate: "2024-03-15",
    abstract: "This paper explores the application of deep neural networks to improve climate model predictions, achieving a 23% improvement in accuracy over traditional methods.",
    doi: "10.1038/s41558-024-01845-8",
    tags: ["Machine Learning", "Climate Science", "Neural Networks"],
    citationCount: 42
  },
  {
    id: "2",
    title: "Quantum Computing Approaches to Protein Folding Problems",
    authors: ["An Yujin", "Kwon Eunbi", "Nazym Zhiyengalieva"],
    journal: "Science",
    publicationDate: "2024-02-22",
    abstract: "We present a novel quantum algorithm that significantly reduces the computational time required for protein folding simulations.",
    doi: "10.1126/science.abc1234",
    tags: ["Quantum Computing", "Bioinformatics", "Protein Structure"],
    citationCount: 27
  },
  {
    id: "3",
    title: "Understanding Social Network Dynamics Through Graph Neural Networks",
    authors: ["Lee Kangeun", "Cristiano Ronaldo", "Amanda Rodriguez"],
    journal: "Proceedings of the ACM on Human-Computer Interaction",
    publicationDate: "2024-01-10",
    abstract: "This study applies graph neural networks to model information diffusion in social networks, providing insights into virality patterns.",
    doi: "10.1145/3479556",
    tags: ["Social Computing", "Graph Neural Networks", "Network Science"],
    citationCount: 18
  },
  {
    id: "4",
    title: "Sustainable Materials for Next-Generation Battery Technology",
    authors: ["Kevin Lee", "Darren Watkins Jr.", "Park Jisung"],
    journal: "Advanced Energy Materials",
    publicationDate: "2023-12-05",
    abstract: "We review recent advances in sustainable materials for high-capacity batteries, with a focus on reducing environmental impact while maintaining performance.",
    doi: "10.1002/aenm.202300123",
    tags: ["Battery Technology", "Sustainable Materials", "Energy Storage"],
    citationCount: 56
  },
  {
    id: "5",
    title: "Ethical Considerations in Generative AI for Healthcare Applications",
    authors: ["Rebecca Martinez", "Steven Yang", "Sophia Kim"],
    journal: "Journal of Medical Ethics",
    publicationDate: "2023-11-18",
    abstract: "This paper discusses the ethical implications of deploying generative AI systems in clinical decision support and patient care contexts.",
    doi: "10.1136/medethics-2023-108901",
    tags: ["Medical Ethics", "Artificial Intelligence", "Healthcare"],
    citationCount: 31
  }
];

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedAbstracts, setExpandedAbstracts] = useState<string[]>([]);
  
  // Extract all unique tags from articles
  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags))
  ).sort();
  
  // Filter articles based on search term and selected tags
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      article.abstract.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => article.tags.includes(tag));
      
    return matchesSearch && matchesTags;
  });
  
  const toggleAbstract = (articleId: string) => {
    setExpandedAbstracts(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">Research Articles</h1>
        <p className="text-gray-600">
          Discover and explore the latest research publications in your field of interest.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Search & Filter</h3>
            
            <div className="relative mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full p-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-research-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter by Research Topic
              </h4>
              
              <div className="max-h-48 overflow-y-auto space-y-2 pl-1">
                {allTags.map(tag => (
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
                      {tag} ({articles.filter(a => a.tags.includes(tag)).length})
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedTags([])}
                disabled={selectedTags.length === 0}
              >
                Clear Filters
              </Button>
              
              <Button variant="default" size="sm">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:w-3/4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredArticles.length} of {articles.length} articles
            </p>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort by: Most Cited <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">Most Cited</Button>
                  <Button variant="ghost" className="w-full justify-start">Recently Published</Button>
                  <Button variant="ghost" className="w-full justify-start">Alphabetical</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 flex-1">
                        {article.title}
                      </h3>
                      <Badge className="ml-2 flex-shrink-0">
                        {article.citationCount} citations
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.authors.join(", ")}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {article.journal}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(article.publicationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    <div className={expandedAbstracts.includes(article.id) ? "" : "line-clamp-2"}>
                      <p className="text-gray-600">{article.abstract}</p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAbstract(article.id)}
                        className="text-research-purple hover:text-research-purple/80"
                      >
                        {expandedAbstracts.includes(article.id) ? (
                          <>Less <ChevronDown className="ml-1 h-4 w-4" /></>
                        ) : (
                          <>More <ChevronRight className="ml-1 h-4 w-4" /></>
                        )}
                      </Button>
                      
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-research-blue hover:text-research-purple"
                      >
                        View Full Paper <ArrowUpRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Articles Found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters to find relevant research articles.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTags([]);
                  }}
                >
                  Reset Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

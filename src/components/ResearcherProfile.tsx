
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ResearcherCard from "./ResearcherCard";
import { Researcher, getResearcherById, findSimilarResearchers } from "@/data/mockData";
import { BookOpen, Mail, Building, Users, Globe, Share2, Award, ArrowLeft } from "lucide-react";

export default function ResearcherProfile() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get researcher data
  const researcher = getResearcherById(id || "");
  const similarResearchers = researcher ? findSimilarResearchers(researcher.id) : [];
  
  if (!researcher) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Researcher not found</h1>
        <p className="mb-8">The researcher you're looking for doesn't exist or has been removed.</p>
        <Link to="/researchers">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Researchers
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Link to="/researchers" className="inline-flex items-center text-sm text-gray-500 hover:text-research-blue mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Researchers
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={researcher.avatar}
                alt={researcher.name}
                className="rounded-full w-32 h-32 object-cover border-4 border-gray-100 mb-4"
              />
              <h1 className="text-2xl font-bold">{researcher.name}</h1>
              <p className="text-gray-500">{researcher.department}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-2 text-gray-400" />
                <span>{researcher.institution}</span>
              </div>
              
              {researcher.contact && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{researcher.contact}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                <span>{researcher.publications} publications</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Award className="h-4 w-4 mr-2 text-gray-400" />
                <span>{researcher.citations} citations (h-index: {researcher.hIndex})</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {researcher.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <Button className="w-full bg-research-purple hover:bg-research-light-purple">
                <Users className="mr-2 h-4 w-4" /> Connect
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Share Profile
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Similar Researchers</h3>
            <div className="space-y-4">
              {similarResearchers.map((similar) => (
                <Link key={similar.id} to={`/researchers/${similar.id}`} className="block">
                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <img
                      src={similar.avatar}
                      alt={similar.name}
                      className="rounded-full w-10 h-10 object-cover border border-gray-100 mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{similar.name}</h4>
                      <p className="text-xs text-gray-500">{similar.institution}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="publications" className="flex-1">Publications</TabsTrigger>
              <TabsTrigger value="network" className="flex-1">Citation Network</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Biography</h2>
                  <p className="text-gray-700 mb-6">{researcher.bio}</p>
                  
                  <h2 className="text-xl font-semibold mb-4">Research Summary</h2>
                  <p className="text-gray-700">
                    {researcher.name} is a researcher at {researcher.institution} with interests in 
                    {researcher.interests.map((interest, index) => (
                      <span key={interest}>
                        {index === 0 ? ' ' : index === researcher.interests.length - 1 ? ', and ' : ', '}
                        <span className="font-medium">{interest}</span>
                      </span>
                    ))}.
                    With {researcher.publications} publications and {researcher.citations} citations,
                    they have established a significant presence in their field.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="publications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Publications</h2>
                  <p className="text-gray-500 italic">
                    Publication details will be available when the researcher creates an account.
                  </p>
                  
                  <div className="mt-8 text-center">
                    <Button>
                      <BookOpen className="mr-2 h-4 w-4" /> View All Publications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="network" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Citation Network</h2>
                  <p className="text-gray-700 mb-6">
                    Visualize how {researcher.name}'s research connects with others through citations.
                  </p>
                  
                  <div className="mt-4 text-center">
                    <Link to="/network">
                      <Button>
                        <Globe className="mr-2 h-4 w-4" /> Explore Full Network
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

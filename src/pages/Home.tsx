
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ResearcherCard from "@/components/ResearcherCard";
import { researchers, researchInterests } from "@/data/mockData";
import { ArrowRight, Users, BookOpen, Globe, Search, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  // Show a subset of researchers on the homepage
  const featuredResearchers = researchers.slice(0, 4);
  // Show a subset of research interests
  const featuredInterests = researchInterests.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-research-blue to-research-purple py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto">
            Connect with researchers who share your academic interests
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Research Nexus helps you discover collaborators, explore citation networks, and build meaningful research connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/researchers">
              <Button size="lg" className="bg-white text-research-blue hover:bg-gray-100">
                <Users className="mr-2 h-5 w-5" /> Find Researchers
              </Button>
            </Link>
            <Link to="/network">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Globe className="mr-2 h-5 w-5" /> Explore Network
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-research-blue">Discover the Power of Research Networking</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-research-blue/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-research-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Similar Researchers</h3>
              <p className="text-gray-600">
                Discover researchers who share your interests and work in related fields to foster new collaborations.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-research-purple/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-research-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3D Citation Networks</h3>
              <p className="text-gray-600">
                Visualize academic connections through interactive 3D citation networks to understand scholarly influence.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-research-light-blue/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-research-light-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Research Impact</h3>
              <p className="text-gray-600">
                Monitor your academic impact through citation metrics and discover who's building on your research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Researchers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-research-blue">Featured Researchers</h2>
            <Link to="/researchers" className="text-research-purple hover:text-research-light-purple flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredResearchers.map((researcher) => (
              <ResearcherCard key={researcher.id} researcher={researcher} />
            ))}
          </div>
        </div>
      </section>

      {/* Research Interests */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-research-blue mb-8">Popular Research Interests</h2>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {featuredInterests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-base py-2 px-4">
                {interest}
              </Badge>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/researchers">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" /> Explore All Research Areas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-research-light-blue to-research-purple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to connect with fellow researchers?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join Research Nexus today to discover potential collaborators, explore citation networks, and take your research to the next level.
          </p>
          <Button size="lg" className="bg-white text-research-purple hover:bg-gray-100">
            <Zap className="mr-2 h-5 w-5" /> Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

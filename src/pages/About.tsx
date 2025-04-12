
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Globe, Lightbulb, Zap, Mail } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold text-research-blue mb-6 text-center">About Research Nexus</h1>
      
      <div className="mb-16">
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto text-center">
          Research Nexus is a platform dedicated to connecting researchers globally, facilitating
          collaborations, and visualizing academic relationships through innovative network technology.
        </p>
        
        <div className="flex justify-center">
          <div className="flex space-x-4">
            <Link to="/researchers">
              <Button variant="default" className="bg-research-blue hover:bg-research-light-blue">
                <Users className="mr-2 h-4 w-4" /> Find Researchers
              </Button>
            </Link>
            <Link to="/network">
              <Button variant="outline">
                <Globe className="mr-2 h-4 w-4" /> Explore Network
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-research-blue">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At Research Nexus, we believe that great scientific breakthroughs happen when researchers
            connect across disciplines and institutions. Our mission is to break down the barriers
            between academic silos and create a global community of researchers.
          </p>
          <p className="text-gray-700">
            Through our platform, we aim to make it easier for researchers to find potential collaborators
            with similar interests, track the impact of their work through citation networks, and
            build meaningful professional connections.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-research-purple">Platform Features</h2>
          <ul className="space-y-4">
            <li className="flex">
              <div className="mr-4 mt-1">
                <Users className="h-5 w-5 text-research-purple" />
              </div>
              <div>
                <h3 className="font-medium">Researcher Profiles</h3>
                <p className="text-gray-600">
                  Detailed profiles showcasing research interests, publications, and citation metrics.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="mr-4 mt-1">
                <Globe className="h-5 w-5 text-research-purple" />
              </div>
              <div>
                <h3 className="font-medium">3D Citation Networks</h3>
                <p className="text-gray-600">
                  Interactive visualization of citation relationships between researchers.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="mr-4 mt-1">
                <Lightbulb className="h-5 w-5 text-research-purple" />
              </div>
              <div>
                <h3 className="font-medium">Interest-Based Matching</h3>
                <p className="text-gray-600">
                  Algorithm to connect researchers with similar interests and complementary skills.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center text-research-blue">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-research-blue">1</span>
            </div>
            <h3 className="font-semibold mb-2">Create Your Profile</h3>
            <p className="text-gray-600">
              Sign up and create a detailed profile with your research interests, publications, and academic background.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-research-blue">2</span>
            </div>
            <h3 className="font-semibold mb-2">Discover Connections</h3>
            <p className="text-gray-600">
              Find researchers with similar interests or explore the citation network to discover new connections.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-research-blue">3</span>
            </div>
            <h3 className="font-semibold mb-2">Collaborate</h3>
            <p className="text-gray-600">
              Reach out to potential collaborators, share ideas, and build meaningful research partnerships.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-research-blue to-research-purple rounded-xl p-8 text-white mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-6">
            Research Nexus is currently in development. Sign up to be notified when we launch and get early access to our platform.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-md text-gray-900 flex-grow"
            />
            <Button className="bg-white text-research-purple hover:bg-gray-100">
              <Zap className="mr-2 h-4 w-4" /> Get Early Access
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-research-blue">Contact Us</h2>
        <p className="text-gray-700 mb-6">
          Have questions or suggestions? We'd love to hear from you!
        </p>
        <a href="mailto:contact@researchnexus.example" className="inline-flex items-center text-research-purple hover:text-research-light-purple">
          <Mail className="mr-2 h-5 w-5" /> contact@researchnexus.example
        </a>
      </div>
    </div>
  );
}

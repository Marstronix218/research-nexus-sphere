
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Map, Network, Newspaper, Calendar, Users, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-20 h-8 rounded-full bg-gradient-to-br from-research-green to-research-black flex items-center justify-center">
                <span className="text-black font-bold text-lg">K-BIOX</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium flex items-center gap-1 ${isActive('/') ? 'text-research-purple' : 'text-gray-700 hover:text-research-purple'} transition-colors`}
            >
              <Map className="h-4 w-4" />
              Map
            </Link>
            <Link 
              to="/researchers" 
              className={`text-sm font-medium flex items-center gap-1 ${isActive('/researchers') ? 'text-research-purple' : 'text-gray-700 hover:text-research-purple'} transition-colors`}
            >
              <Users className="h-4 w-4" />
              Researchers
            </Link>
            <Link 
              to="/network" 
              className={`text-sm font-medium flex items-center gap-1 ${isActive('/network') ? 'text-research-purple' : 'text-gray-700 hover:text-research-purple'} transition-colors`}
            >
              <Network className="h-4 w-4" />
              Network
            </Link>
            <Link 
              to="/articles" 
              className={`text-sm font-medium flex items-center gap-1 ${isActive('/articles') ? 'text-research-purple' : 'text-gray-700 hover:text-research-purple'} transition-colors`}
            >
              <Newspaper className="h-4 w-4" />
              Articles
            </Link>
            <Link 
              to="/events" 
              className={`text-sm font-medium flex items-center gap-1 ${isActive('/events') ? 'text-research-purple' : 'text-gray-700 hover:text-research-purple'} transition-colors`}
            >
              <Calendar className="h-4 w-4" />
              Events
            </Link>
            <Link 
              to="/feeds" 
              className={`text-sm font-medium flex items-center gap-1 ${isActive('/feeds') ? 'text-research-purple' : 'text-gray-700 hover:text-research-purple'} transition-colors`}
            >
              <Rss className="h-4 w-4" />
              Feeds
            </Link>
            <Link 
              to="/mentors" 
              className={`text-sm font-medium flex items-center gap-1 ${isActive('/mentors') ? 'text-research-purple' : 'text-gray-700 hover:text-research-purple'} transition-colors`}
            >
              <Users className="h-4 w-4" />
              Mentors
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-64">
              <Input 
                type="text" 
                placeholder="Search researchers..." 
                className="pl-10 pr-4 py-2 w-full" 
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Button variant="default" className="bg-research-purple hover:bg-research-light-purple">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search researchers..." 
                className="pl-10 pr-4 py-2 w-full" 
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Map className="h-4 w-4" />
                Map
              </Link>
              <Link 
                to="/researchers" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/researchers') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                Researchers
              </Link>
              <Link 
                to="/network" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/network') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Network className="h-4 w-4" />
                Network
              </Link>
              <Link 
                to="/articles" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/articles') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Newspaper className="h-4 w-4" />
                Articles
              </Link>
              <Link 
                to="/events" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/events') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                Events
              </Link>
              <Link 
                to="/feeds" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/feeds') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Rss className="h-4 w-4" />
                Feeds
              </Link>
              <Link 
                to="/mentors" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/mentors') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                Mentors
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium flex items-center gap-2 ${isActive('/about') ? 'text-research-purple' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            
            <Button className="w-full bg-research-purple hover:bg-research-light-purple">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

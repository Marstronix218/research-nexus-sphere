
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-research-blue to-research-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">RN</span>
              </div>
              <span className="text-lg font-semibold text-research-blue">Research Nexus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/researchers" className="text-sm font-medium text-gray-700 hover:text-research-purple transition-colors">
              Researchers
            </Link>
            <Link to="/network" className="text-sm font-medium text-gray-700 hover:text-research-purple transition-colors">
              Network
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-research-purple transition-colors">
              About
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
                to="/researchers" 
                className="text-sm font-medium text-gray-700 hover:text-research-purple transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Researchers
              </Link>
              <Link 
                to="/network" 
                className="text-sm font-medium text-gray-700 hover:text-research-purple transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Network
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-gray-700 hover:text-research-purple transition-colors"
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

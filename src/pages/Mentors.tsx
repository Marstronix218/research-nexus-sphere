import { useState } from "react";
import { 
  User, 
  Search, 
  Filter, 
  BookOpen, 
  Mail, 
  Calendar, 
  MessageSquare,
  GraduationCap, 
  Award, 
  ChevronDown, 
  ChevronRight,
  FileText,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock mentors data
const mentors = [
  {
    id: "1",
    name: "Prof. Sulyoon",
    title: "Professor of Computer Science",
    institution: "Stanford University",
    location: "Palo Alto, CA, USA",
    avatar: "/placeholder.svg",
    expertise: ["Machine Learning", "Computer Vision", "Neural Networks"],
    bio: "Professor Sulyoon leads the Machine Learning Research Group at Stanford University. With over 15 years of experience in the field, she has supervised numerous PhD students and postdoctoral researchers who have gone on to successful careers in academia and industry.",
    publications: 78,
    hIndex: 42,
    availability: "Limited (1-2 mentees)",
    mentoringSince: "2008",
    mentorshipAreas: ["PhD Application Advice", "Research Direction", "Career Guidance"],
    acceptingStudents: true,
    fields: ["Computer Science", "Artificial Intelligence"],
  },
  {
    id: "2",
    name: "Dr. Maruaki Kishida",
    title: "Associate Professor of Genomics",
    institution: "Harvard Medical School",
    location: "Boston, MA, USA",
    avatar: "/placeholder.svg",
    expertise: ["Genomics", "Bioinformatics", "Computational Biology"],
    bio: "Dr. Kishida's research focuses on developing computational methods for analyzing large-scale genomic data. He is passionate about mentoring early-career researchers and helping them navigate the interdisciplinary challenges of modern bioinformatics.",
    publications: 45,
    hIndex: 28,
    availability: "Open (multiple mentees)",
    mentoringSince: "2012",
    mentorshipAreas: ["Research Methods", "Publication Strategy", "Interdisciplinary Collaboration"],
    acceptingStudents: true,
    fields: ["Biology", "Computational Science", "Medicine"],
  },
  {
    id: "3",
    name: "Prof. Lee Jieun",
    title: "Professor of Quantum Physics",
    institution: "MIT",
    location: "Cambridge, MA, USA",
    avatar: "/placeholder.svg",
    expertise: ["Quantum Computing", "Quantum Mechanics", "Theoretical Physics"],
    bio: "Professor Jieun is a leading researcher in quantum computing theory. She has received numerous awards for her contributions to the field and is dedicated to increasing diversity in physics through her mentorship programs.",
    publications: 92,
    hIndex: 50,
    availability: "Limited (1-2 mentees)",
    mentoringSince: "2005",
    mentorshipAreas: ["Academic Career Planning", "Grant Writing", "Advanced Research Techniques"],
    acceptingStudents: false,
    fields: ["Physics", "Computer Science", "Mathematics"],
  },
  {
    id: "4",
    name: "Dr. Kim Minjae",
    title: "Professor of Environmental Science",
    institution: "University of California, Berkeley",
    location: "Berkeley, CA, USA",
    avatar: "/placeholder.svg",
    expertise: ["Climate Modeling", "Sustainable Energy", "Environmental Policy"],
    bio: "Dr. Kim combines research in climate science with policy engagement. His mentoring approach emphasizes the importance of communicating scientific findings to policymakers and the public.",
    publications: 63,
    hIndex: 35,
    availability: "Open (multiple mentees)",
    mentoringSince: "2010",
    mentorshipAreas: ["Science Communication", "Policy Engagement", "Interdisciplinary Research"],
    acceptingStudents: true,
    fields: ["Environmental Science", "Climate Science", "Public Policy"],
  },
  {
    id: "5",
    name: "Dr. Huh Yunjin",
    title: "Associate Professor of Psychology",
    institution: "Columbia University",
    location: "New York, NY, USA",
    avatar: "/placeholder.svg",
    expertise: ["Cognitive Neuroscience", "Behavioral Psychology", "Research Methods"],
    bio: "Dr. Yunjin's research examines the neural basis of decision-making and learning. She is particularly interested in mentoring researchers who wish to combine psychological theory with advanced quantitative methods.",
    publications: 37,
    hIndex: 22,
    availability: "Limited (1-2 mentees)",
    mentoringSince: "2015",
    mentorshipAreas: ["Experimental Design", "Statistical Analysis", "Publication Strategy"],
    acceptingStudents: true,
    fields: ["Psychology", "Neuroscience", "Statistics"],
  }
];

// Extract all unique fields and expertise areas
const allFields = Array.from(new Set(mentors.flatMap(mentor => mentor.fields))).sort();
const allExpertiseAreas = Array.from(new Set(mentors.flatMap(mentor => mentor.expertise))).sort();
const allMentorshipAreas = Array.from(new Set(mentors.flatMap(mentor => mentor.mentorshipAreas))).sort();

export default function Mentors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedMentorshipAreas, setSelectedMentorshipAreas] = useState<string[]>([]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [expandedBios, setExpandedBios] = useState<string[]>([]);
  
  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };
  
  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev => 
      prev.includes(expertise)
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    );
  };
  
  const toggleMentorshipArea = (area: string) => {
    setSelectedMentorshipAreas(prev => 
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };
  
  const toggleBio = (mentorId: string) => {
    setExpandedBios(prev => 
      prev.includes(mentorId) 
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    );
  };
  
  const resetFilters = () => {
    setSelectedFields([]);
    setSelectedExpertise([]);
    setSelectedMentorshipAreas([]);
    setShowOnlyAvailable(false);
    setSearchTerm("");
  };
  
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchTerm === "" || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFields = selectedFields.length === 0 || 
      mentor.fields.some(field => selectedFields.includes(field));
      
    const matchesExpertise = selectedExpertise.length === 0 || 
      mentor.expertise.some(exp => selectedExpertise.includes(exp));
      
    const matchesMentorshipAreas = selectedMentorshipAreas.length === 0 || 
      mentor.mentorshipAreas.some(area => selectedMentorshipAreas.includes(area));
      
    const matchesAvailability = !showOnlyAvailable || mentor.acceptingStudents;
      
    return matchesSearch && matchesFields && matchesExpertise && matchesMentorshipAreas && matchesAvailability;
  });
  
  const availableMentors = filteredMentors.filter(mentor => mentor.acceptingStudents);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">Research Mentors</h1>
        <p className="text-gray-600">
          Connect with experienced researchers who can provide guidance, feedback, and support for your academic journey.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Find Mentors</h3>
            
            <div className="relative mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search mentors..."
                className="w-full p-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-research-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Checkbox 
                  id="available-only"
                  checked={showOnlyAvailable}
                  onCheckedChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
                />
                <label 
                  htmlFor="available-only"
                  className="ml-2 text-sm cursor-pointer hover:text-research-purple"
                >
                  Show only mentors accepting students
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Research Field
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-2">Filter by field</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {allFields.map(field => (
                        <div key={field} className="flex items-center">
                          <Checkbox 
                            id={`field-${field}`}
                            checked={selectedFields.includes(field)}
                            onCheckedChange={() => toggleField(field)}
                          />
                          <label 
                            htmlFor={`field-${field}`}
                            className="ml-2 text-sm cursor-pointer hover:text-research-purple"
                          >
                            {field} ({mentors.filter(m => m.fields.includes(field)).length})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      Expertise
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-2">Filter by expertise</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {allExpertiseAreas.map(expertise => (
                        <div key={expertise} className="flex items-center">
                          <Checkbox 
                            id={`expertise-${expertise}`}
                            checked={selectedExpertise.includes(expertise)}
                            onCheckedChange={() => toggleExpertise(expertise)}
                          />
                          <label 
                            htmlFor={`expertise-${expertise}`}
                            className="ml-2 text-sm cursor-pointer hover:text-research-purple"
                          >
                            {expertise}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Mentorship Type
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-2">Filter by mentorship area</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {allMentorshipAreas.map(area => (
                        <div key={area} className="flex items-center">
                          <Checkbox 
                            id={`area-${area}`}
                            checked={selectedMentorshipAreas.includes(area)}
                            onCheckedChange={() => toggleMentorshipArea(area)}
                          />
                          <label 
                            htmlFor={`area-${area}`}
                            className="ml-2 text-sm cursor-pointer hover:text-research-purple"
                          >
                            {area}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="w-full"
              disabled={
                selectedFields.length === 0 && 
                selectedExpertise.length === 0 && 
                selectedMentorshipAreas.length === 0 && 
                !showOnlyAvailable && 
                searchTerm === ""
              }
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        <div className="md:w-3/4">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                All Mentors ({filteredMentors.length})
              </TabsTrigger>
              <TabsTrigger value="available" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Currently Available ({availableMentors.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {filteredMentors.length > 0 ? (
                filteredMentors.map(mentor => (
                  <div 
                    key={mentor.id} 
                    className={`bg-white rounded-lg shadow overflow-hidden ${mentor.acceptingStudents ? 'border-l-4 border-green-500' : ''}`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex flex-col items-center space-y-2">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={mentor.avatar} alt={mentor.name} />
                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <Badge variant={mentor.acceptingStudents ? "default" : "secondary"} className="mt-2">
                            {mentor.acceptingStudents ? "Accepting Students" : "Not Available"}
                          </Badge>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                {mentor.name}
                              </h3>
                              <p className="text-gray-600">{mentor.title}</p>
                              <p className="text-gray-600 flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {mentor.institution}, {mentor.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {mentor.expertise.map(exp => (
                              <Badge key={exp} variant="secondary">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className={`mt-4 text-gray-700 ${expandedBios.includes(mentor.id) ? '' : 'line-clamp-2'}`}>
                            {mentor.bio}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBio(mentor.id)}
                            className="mt-1 text-research-purple hover:text-research-purple/80 p-0 h-auto"
                          >
                            {expandedBios.includes(mentor.id) ? (
                              <>Less <ChevronDown className="ml-1 h-4 w-4" /></>
                            ) : (
                              <>More <ChevronRight className="ml-1 h-4 w-4" /></>
                            )}
                          </Button>
                          
                          {expandedBios.includes(mentor.id) && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">Publications:</span>
                                <span className="ml-1">{mentor.publications}</span>
                              </div>
                              <div className="flex items-center">
                                <Award className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">h-index:</span>
                                <span className="ml-1">{mentor.hIndex}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">Mentoring since:</span>
                                <span className="ml-1">{mentor.mentoringSince}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">Availability:</span>
                                <span className="ml-1">{mentor.availability}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Mentorship Areas:</h4>
                            <div className="flex flex-wrap gap-1">
                              {mentor.mentorshipAreas.map(area => (
                                <Badge key={area} variant="outline" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button className="bg-research-purple hover:bg-research-light-purple">
                              <Mail className="mr-2 h-4 w-4" />
                              Contact for Mentorship
                            </Button>
                            <Button variant="outline">
                              View Full Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Mentors Found</h3>
                  <p className="text-gray-500">
                    There are no mentors matching your filter criteria.
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
            
            <TabsContent value="available" className="space-y-6">
              {availableMentors.length > 0 ? (
                availableMentors.map(mentor => (
                  <div 
                    key={mentor.id} 
                    className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-green-500"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex flex-col items-center space-y-2">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={mentor.avatar} alt={mentor.name} />
                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <Badge className="mt-2">
                            Accepting Students
                          </Badge>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                {mentor.name}
                              </h3>
                              <p className="text-gray-600">{mentor.title}</p>
                              <p className="text-gray-600 flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {mentor.institution}, {mentor.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {mentor.expertise.map(exp => (
                              <Badge key={exp} variant="secondary">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className={`mt-4 text-gray-700 ${expandedBios.includes(mentor.id) ? '' : 'line-clamp-2'}`}>
                            {mentor.bio}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBio(mentor.id)}
                            className="mt-1 text-research-purple hover:text-research-purple/80 p-0 h-auto"
                          >
                            {expandedBios.includes(mentor.id) ? (
                              <>Less <ChevronDown className="ml-1 h-4 w-4" /></>
                            ) : (
                              <>More <ChevronRight className="ml-1 h-4 w-4" /></>
                            )}
                          </Button>
                          
                          {expandedBios.includes(mentor.id) && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">Publications:</span>
                                <span className="ml-1">{mentor.publications}</span>
                              </div>
                              <div className="flex items-center">
                                <Award className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">h-index:</span>
                                <span className="ml-1">{mentor.hIndex}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">Mentoring since:</span>
                                <span className="ml-1">{mentor.mentoringSince}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">Availability:</span>
                                <span className="ml-1">{mentor.availability}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Mentorship Areas:</h4>
                            <div className="flex flex-wrap gap-1">
                              {mentor.mentorshipAreas.map(area => (
                                <Badge key={area} variant="outline" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button className="bg-research-purple hover:bg-research-light-purple">
                              <Mail className="mr-2 h-4 w-4" />
                              Contact for Mentorship
                            </Button>
                            <Button variant="outline">
                              View Full Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Available Mentors Found</h3>
                  <p className="text-gray-500">
                    There are no mentors currently accepting students that match your filter criteria.
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

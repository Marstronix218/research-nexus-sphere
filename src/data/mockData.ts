export interface Researcher {
  id: string;
  name: string;
  avatar: string;
  institution: string;
  department: string;
  location?: string; // Add the location property
  interests: string[];
  publications: number;
  citations: number;
  hIndex: number;
  bio: string;
  contact?: string;
  citedBy: string[];
  cites: string[];
}

export const researchInterests = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Neuroscience",
  "Quantum Computing",
  "Bioinformatics",
  "Climate Science",
  "Renewable Energy",
  "Blockchain",
  "Cybersecurity",
  "Human-Computer Interaction",
  "Ethics in AI",
  "Genetics",
  "Astronomy",
  "Material Science",
  "Cognitive Science",
  "Psychology"
];

export const researchers: Researcher[] = [
  {
    id: "1",
    name: "Jeongmin Seo",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    institution: "Stanford University",
    department: "Neurocience",
    location: "Stanford, California, USA", // Add location data
    interests: ["Artificial Intelligence", "Machine Learning", "Ethics in AI"],
    publications: 78,
    citations: 4250,
    hIndex: 26,
    bio: "Leading researcher in AI ethics and responsible machine learning with over 15 years of experience.",
    citedBy: ["2", "3", "5", "7", "9"],
    cites: ["4", "8", "10"]
  },
  {
    id: "2",
    name: "Kim Minsoo",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    institution: "MIT",
    department: "Electrical Engineering",
    location: "Cambridge, Massachusetts, USA",
    interests: ["Quantum Computing", "Data Science", "Machine Learning"],
    publications: 112,
    citations: 6300,
    hIndex: 32,
    bio: "Pioneering researcher in quantum computing applications with multiple breakthrough papers.",
    citedBy: ["3", "5", "8", "9"],
    cites: ["1", "4", "7"]
  },
  {
    id: "3",
    name: "Jang Wonyoung",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    institution: "UC Berkeley",
    department: "Computational Biology",
    location: "Berkeley, California, USA",
    interests: ["Bioinformatics", "Genetics", "Machine Learning"],
    publications: 64,
    citations: 3100,
    hIndex: 24,
    bio: "Bridging the gap between computational methods and genetic research.",
    citedBy: ["1", "4", "6", "10"],
    cites: ["2", "5", "8"]
  },
  {
    id: "4",
    name: "Prof. David Kang",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    institution: "Oxford University",
    department: "Physics",
    location: "Oxford, UK",
    interests: ["Quantum Computing", "Material Science", "Data Science"],
    publications: 95,
    citations: 5400,
    hIndex: 29,
    bio: "Exploring the frontiers of quantum information theory and its applications.",
    citedBy: ["1", "2", "8"],
    cites: ["3", "6", "9"]
  },
  {
    id: "5",
    name: "Dr. Kim Chaewon",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    institution: "Carnegie Mellon University",
    department: "Robotics",
    location: "Pittsburgh, Pennsylvania, USA",
    interests: ["Robotics", "Computer Vision", "Human-Computer Interaction"],
    publications: 72,
    citations: 3800,
    hIndex: 25,
    bio: "Developing next-generation robotic systems with advanced perception capabilities.",
    citedBy: ["2", "4", "7"],
    cites: ["3", "6", "10"]
  },
  {
    id: "6",
    name: "Prof. Kim Taehyung",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    institution: "ETH Zurich",
    department: "Computer Science",
    location: "Zurich, Switzerland",
    interests: ["Natural Language Processing", "Artificial Intelligence", "Ethics in AI"],
    publications: 83,
    citations: 4900,
    hIndex: 28,
    bio: "Working on language models that understand and generate human-like text.",
    citedBy: ["3", "5", "8", "10"],
    cites: ["1", "4", "7"]
  },
  {
    id: "7",
    name: "Dr. Kim Minjeong",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    institution: "California Institute of Technology",
    department: "Neuroscience",
    location: "Pasadena, California, USA",
    interests: ["Neuroscience", "Cognitive Science", "Artificial Intelligence"],
    publications: 59,
    citations: 2900,
    hIndex: 23,
    bio: "Investigating the neural mechanisms of learning and decision-making.",
    citedBy: ["2", "6", "9"],
    cites: ["1", "5", "8"]
  },
  {
    id: "8",
    name: "Prof. Shinnosuke Uesaka",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    institution: "University of Tokyo",
    department: "Climate Science",
    location: "Tokyo, Japan",
    interests: ["Climate Science", "Data Science", "Renewable Energy"],
    publications: 105,
    citations: 5800,
    hIndex: 31,
    bio: "Leading efforts to model climate change impacts using advanced data science techniques.",
    citedBy: ["2", "4", "6"],
    cites: ["3", "5", "9"]
  },
  {
    id: "9",
    name: "Dr. Sujin Lee",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    institution: "Georgia Tech",
    department: "Cybersecurity",
    location: "Atlanta, Georgia, USA",
    interests: ["Cybersecurity", "Blockchain", "Ethics in AI"],
    publications: 67,
    citations: 3300,
    hIndex: 24,
    bio: "Developing novel approaches to enhance security in distributed systems.",
    citedBy: ["1", "6", "10"],
    cites: ["2", "4", "8"]
  },
  {
    id: "10",
    name: "Prof. Son Heung-min",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    institution: "Harvard University",
    department: "Astronomy",
    location: "Cambridge, Massachusetts, USA",
    interests: ["Astronomy", "Data Science", "Machine Learning"],
    publications: 88,
    citations: 4600,
    hIndex: 27,
    bio: "Applying machine learning techniques to analyze astronomical data and discover new phenomena.",
    citedBy: ["1", "3", "8"],
    cites: ["2", "5", "9"]
  }
];

export const getResearcherById = (id: string): Researcher | undefined => {
  return researchers.find(researcher => researcher.id === id);
};

export const findSimilarResearchers = (researcherId: string, count: number = 3): Researcher[] => {
  const researcher = getResearcherById(researcherId);
  if (!researcher) return [];

  return researchers
    .filter(r => r.id !== researcherId)
    .map(r => {
      const commonInterests = r.interests.filter(interest => 
        researcher.interests.includes(interest)
      ).length;
      return { researcher: r, commonInterests };
    })
    .sort((a, b) => b.commonInterests - a.commonInterests)
    .slice(0, count)
    .map(item => item.researcher);
};

// For 3D network visualization
export interface Node {
  id: string;
  name: string;
  val: number; // Size based on citations
  color?: string;
}

export interface Link {
  source: string;
  target: string;
  value: number;
}

export const createNetworkData = () => {
  const nodes: Node[] = researchers.map(r => ({
    id: r.id,
    name: r.name,
    val: Math.sqrt(r.citations) / 3, // Increased from /5 to /3 to make nodes bigger
  }));

  const links: Link[] = [];
  
  // Create links based on citation relationships
  researchers.forEach(researcher => {
    researcher.cites.forEach(citedId => {
      links.push({
        source: researcher.id,
        target: citedId,
        value: 1
      });
    });
  });

  return { nodes, links };
};

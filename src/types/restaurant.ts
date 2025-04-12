
export interface Member {
  id: string;
  name: string;
  role: string;
  institution: string;
}

export interface Dish {
  id: string;
  title: string;
  description: string;
  date: string;
  likes: number;
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  menu: string[];
  kitchenExperience: string[];
  requirements: string[];
  members: Member[];
  dishes: Dish[];
  badges: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  storeImage: string;
}

export interface ApplicationForm {
  name: string;
  institution: string;
  major: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Master";
  reason: string;
}

export type ResearchTopic = 
  | "Deep Learning" 
  | "CNNs" 
  | "Neuroimaging" 
  | "NLP" 
  | "LLMs" 
  | "Transformers" 
  | "Genomics"
  | "Systems Biology" 
  | "RNA-seq" 
  | "Quantum Computing" 
  | "Optimization"
  | "Bioinformatics";

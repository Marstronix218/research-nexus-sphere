
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
}

export interface ApplicationForm {
  name: string;
  institution: string;
  major: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Master";
  reason: string;
}

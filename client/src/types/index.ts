// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  canCreateNews?: boolean;
  canViewContacts?: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// News types
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category: string;
  imageUrl: string;
  date: string;
  author?: string;
}

export interface CreateNewsInput {
  title: string;
  content: string;
  summary?: string;
  category: string;
  imageUrl: string;
}

// Contact types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Team member types
export interface TeamMember {
  id: number;
  name: string;
  position: string;
  expertise: string;
  bio: string;
  imageUrl?: string;
}

// Service types
export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: string[];
}

// Project types
export interface Project {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
}

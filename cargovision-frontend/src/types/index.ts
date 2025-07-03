import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  subItems?: SubNavigationItem[];
}

export interface SubNavigationItem {
  name: string;
  href: string;
  description?: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface Feature {
  icon: LucideIcon; // Lucide icon component
  title: string;
  description: string;
  badge: string;
  color: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  stats: string;
}

export interface CTAOption {
  icon: LucideIcon; // Lucide icon component
  title: string;
  description: string;
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  popular: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface Container {
  id: string;
  number: string;
  status: 'pending' | 'inspecting' | 'completed' | 'failed';
  location: string;
  inspectionDate: Date;
  inspector?: string;
  findings?: ContainerFinding[];
}

export interface ContainerFinding {
  id: string;
  type: 'damage' | 'security' | 'compliance' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  images?: string[];
  resolvedAt?: Date;
}

export interface InspectionReport {
  id: string;
  containerId: string;
  inspectorId: string;
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'failed';
  findings: ContainerFinding[];
  aiConfidenceScore: number;
  manualReview: boolean;
} 
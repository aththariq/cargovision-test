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
  containerId: string;
  status: 'pending' | 'inspecting' | 'completed' | 'failed' | 'flagged' | 'clean' | 'in-progress';
  location: string;
  inspectionDate?: Date;
  inspector?: string;
  findings?: ContainerFinding[];
  scanTime?: string;
  vessel?: string;
  origin?: string;
  destination?: string;
  weight?: string;
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

// Container List Table Types
export interface ContainerTableRow {
  id: string;
  containerId: string;
  status: 'flagged' | 'clean' | 'pending' | 'in-progress';
  inspectionTime: string;
  location: string;
  inspector: string;
  aiConfidence: number;
  anomalyCount?: number;
  priority?: 'high' | 'medium' | 'low';
}

export interface ContainerListFilters {
  status?: 'all' | 'flagged' | 'clean' | 'pending' | 'in-progress';
  search?: string;
  location?: string;
  inspector?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// AI Detection Types (extended)
export interface AIDetectionSummary {
  totalAnomalies: number;
  highRiskCount: number;
  confidenceScore: number;
  scanDuration: number;
  processingComplete: boolean;
}

export interface InspectionHistoryEntry {
  date: string;
  inspector: string;
  status: string;
  anomalies: number;
} 
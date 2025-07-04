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

// Updated Container interface to match backend data
export interface Container {
  id: string;
  containerId?: string; // From backend containerID
  status: 'pending' | 'inspecting' | 'completed' | 'failed' | 'flagged' | 'clean' | 'in-progress';
  location?: string;
  inspectionDate?: Date;
  inspector?: string;
  findings?: ContainerFinding[];
  scanTime?: string;
  lastScanTime?: string; // From backend createdTime
  vessel?: string;
  origin?: string;
  destination?: string;
  weight?: string;
  // Backend specific fields
  scanTypes?: ('ocr' | 'illegal' | 'category')[];
  illegalDetections?: number;
  categoryDetections?: number;
  confidence?: number;
  images?: {
    scanImage?: string;
    visualizationImage?: string;
  };
}

export interface ContainerFinding {
  id: string;
  type: 'damage' | 'security' | 'compliance' | 'anomaly' | 'illegal' | 'category';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  images?: string[];
  resolvedAt?: Date;
  confidence?: number;
  bbox?: number[]; // Bounding box coordinates
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
  scanType?: 'ocr' | 'illegal' | 'category';
  scanImage?: string;
  visualizationImage?: string;
}

// Container List Table Types (Updated)
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
  // Backend specific fields
  illegalDetections?: number;
  categoryDetections?: number;
  scanTypes?: string[];
  lastScanTime?: string;
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
  scanType?: 'all' | 'ocr' | 'illegal' | 'category';
}

// AI Detection Types (Updated for backend compatibility)
export interface AIDetectionSummary {
  totalAnomalies: number;
  highRiskCount: number;
  confidenceScore: number;
  scanDuration: number;
  processingComplete: boolean;
  illegalDetections?: number;
  categoryDetections?: number;
  ocrDetections?: number;
}

export interface InspectionHistoryEntry {
  date: string;
  inspector: string;
  status: string;
  anomalies: number;
  scanType?: string;
  confidence?: number;
}

// Dashboard Statistics (New)
export interface DashboardStats {
  totalContainers: number;
  flaggedContainers: number;
  cleanContainers: number;
  pendingContainers: number;
  averageConfidence: number;
  totalDetections: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  containerId: string;
  action: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
}

// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

// Scan Detection Types
export interface Detection {
  id?: string;
  confidence: number;
  bbox: number[];
  // For illegal detection
  label?: string;
  // For category detection  
  category?: string;
  // For OCR detection
  text?: string;
}

export interface ScanResult {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: Detection[];
  createdTime?: string;
  containerID?: string;
} 
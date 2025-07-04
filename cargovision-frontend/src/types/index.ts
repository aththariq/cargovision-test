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
  containerID: string;
  status: "flagged" | "clean" | "pending";
  lastScan: string;
  flaggedItems?: number;
  detections?: number;
  scanType?: "ocr" | "illegal" | "category";
  totalScans?: number;
  illegalDetections?: number;
  categoryDetections?: number;
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
  containerID: string;
  status: "flagged" | "clean" | "pending";
  lastScan: string;
  totalScans: number;
  illegalDetections: number;
  categoryDetections: number;
  scanTypes: string[];
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
  totalScans: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: "illegal" | "category" | "ocr";
  containerID?: string;
  timestamp: string;
  status: "flagged" | "clean";
  detectionCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

// Updated Detection Types for new API structure
export interface OcrDetection {
  class_name: string;
  confidence: number;
  ocr_text: string | null;
}

export interface IllegalDetection {
  class_name: string;
  confidence: number;
}

export interface CategoryDetection {
  class_name: string;
  confidence: number;
}

// Updated Scan Types
export interface OcrScan {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: OcrDetection[];
  createdTime: string;
}

export interface IllegalScan {
  id: string;
  containerID?: string | null;
  scanImage: string;
  visualizationImage: string;
  detections: IllegalDetection[];
  createdTime: string;
}

export interface CategoryScan {
  id: string;
  containerID?: string | null;
  scanImage: string;
  visualizationImage: string;
  detections: CategoryDetection[];
  createdTime: string;
}

// API Response Types
export interface OcrHistoryResponse {
  ocrScans: OcrScan[];
}

export interface IllegalHistoryResponse {
  illegalScans: IllegalScan[];
}

export interface CategoryHistoryResponse {
  categoryScans: CategoryScan[];
}

// Container Data Types
export interface ContainerData {
  containerID: string;
  illegalScans: IllegalScan[];
  categoryScans: CategoryScan[];
  status: "flagged" | "clean" | "pending";
  totalDetections: number;
  lastScanTime: string;
  scanTypes: string[];
}

// Filter Types
export type ScanTypeFilter = "all" | "ocr" | "illegal" | "category";
export type StatusFilter = "all" | "flagged" | "clean" | "pending"; 
import { apiService, ApiResponse } from './api';

// OCR History Types
export interface OcrScan {
  id: string;
  scanImage: string;
  visualizationImage: string;
  createdTime: string;
  detections?: Array<{
    text: string;
    confidence: number;
    bbox: number[];
  }>;
}

export interface OcrHistoryResponse {
  ocrScans: OcrScan[];
}

// Illegal Detection History Types
export interface IllegalScan {
  id: string;
  containerID?: string;
  scanImage: string;
  visualizationImage: string;
  detections: number;
  createdTime: string;
  detectionDetails?: Array<{
    label: string;
    confidence: number;
    bbox: number[];
  }>;
}

export interface IllegalHistoryResponse {
  illegalScans: IllegalScan[];
}

// Category History Types
export interface CategoryScan {
  id: string;
  containerID?: string;
  scanImage: string;
  visualizationImage: string;
  detections: number;
  createdTime: string;
  detectionDetails?: Array<{
    category: string;
    confidence: number;
    bbox: number[];
  }>;
}

export interface CategoryHistoryResponse {
  categoryScans: CategoryScan[];
}

// Combined Container Data
export interface ContainerData {
  id: string;
  containerID?: string;
  status: 'flagged' | 'clean' | 'pending' | 'in-progress';
  lastScanTime: string;
  scanTypes: ('ocr' | 'illegal' | 'category')[];
  illegalDetections?: number;
  categoryDetections?: number;
  confidence?: number;
  images: {
    scanImage?: string;
    visualizationImage?: string;
  };
}

class HistoryService {
  // Get OCR scan history
  async getOcrHistory(): Promise<ApiResponse<OcrHistoryResponse>> {
    return apiService.get<OcrHistoryResponse>('/service/history/ocr');
  }

  // Get illegal detection scan history
  async getIllegalHistory(): Promise<ApiResponse<IllegalHistoryResponse>> {
    return apiService.get<IllegalHistoryResponse>('/service/history/illegal');
  }

  // Get illegal detection scan history for specific container
  async getIllegalHistoryByContainer(containerID: string): Promise<ApiResponse<IllegalHistoryResponse>> {
    return apiService.get<IllegalHistoryResponse>(`/service/history/illegal?containerID=${containerID}`);
  }

  // Get categorization scan history
  async getCategoryHistory(): Promise<ApiResponse<CategoryHistoryResponse>> {
    return apiService.get<CategoryHistoryResponse>('/service/history/category');
  }

  // Get combined container data for dashboard
  async getContainersData(): Promise<ContainerData[]> {
    try {
      const [illegalResponse, categoryResponse] = await Promise.all([
        this.getIllegalHistory(),
        this.getCategoryHistory(),
      ]);

      const containers = new Map<string, ContainerData>();

      // Process illegal scans
      illegalResponse.data.illegalScans.forEach(scan => {
        const containerId = scan.containerID || scan.id;
        const existing = containers.get(containerId) || {
          id: containerId,
          containerID: scan.containerID,
          status: scan.detections > 0 ? 'flagged' : 'clean',
          lastScanTime: scan.createdTime,
          scanTypes: [],
          images: {}
        };

        existing.scanTypes.push('illegal');
        existing.illegalDetections = scan.detections;
        existing.images.scanImage = scan.scanImage;
        existing.images.visualizationImage = scan.visualizationImage;
        
        // Update status based on detections
        if (scan.detections > 0) {
          existing.status = 'flagged';
        }

        // Update last scan time if this scan is more recent
        if (new Date(scan.createdTime) > new Date(existing.lastScanTime)) {
          existing.lastScanTime = scan.createdTime;
        }

        containers.set(containerId, existing);
      });

      // Process category scans
      categoryResponse.data.categoryScans.forEach(scan => {
        const containerId = scan.containerID || scan.id;
        const existing = containers.get(containerId) || {
          id: containerId,
          containerID: scan.containerID,
          status: 'clean',
          lastScanTime: scan.createdTime,
          scanTypes: [],
          images: {}
        };

        existing.scanTypes.push('category');
        existing.categoryDetections = scan.detections;
        
        // If no other images, use from category scan
        if (!existing.images.scanImage) {
          existing.images.scanImage = scan.scanImage;
          existing.images.visualizationImage = scan.visualizationImage;
        }

        // Update last scan time if this scan is more recent
        if (new Date(scan.createdTime) > new Date(existing.lastScanTime)) {
          existing.lastScanTime = scan.createdTime;
        }

        containers.set(containerId, existing);
      });

      return Array.from(containers.values()).sort(
        (a, b) => new Date(b.lastScanTime).getTime() - new Date(a.lastScanTime).getTime()
      );

    } catch (error) {
      console.error('Error fetching containers data:', error);
      return [];
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const containers = await this.getContainersData();
      
      const stats = {
        totalContainers: containers.length,
        flaggedContainers: containers.filter(c => c.status === 'flagged').length,
        cleanContainers: containers.filter(c => c.status === 'clean').length,
        pendingContainers: containers.filter(c => c.status === 'pending').length,
        averageConfidence: 0,
        totalDetections: containers.reduce((sum, c) => 
          sum + (c.illegalDetections || 0) + (c.categoryDetections || 0), 0
        ),
        recentActivity: containers.slice(0, 10).map(container => ({
          id: container.id,
          containerId: container.containerID || container.id,
          action: container.status === 'flagged' ? 'Flagged for review' : 'Scan completed',
          timestamp: new Date(container.lastScanTime).toLocaleString(),
          severity: container.status === 'flagged' ? 'high' : 'low',
          confidence: container.confidence || 95
        }))
      };

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

export const historyService = new HistoryService(); 
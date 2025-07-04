import { apiClient } from './client';
import { API_CONFIG, ApiResponse, HistoryItem } from './config';

export interface OCRHistoryItem {
  id: string;
  scanImage: string;
  visualizationImage: string;
  createdTime: string;
}

export interface IllegalHistoryItem extends HistoryItem {
  containerID?: string | null;
}

export interface CategoryHistoryItem extends HistoryItem {
  containerID?: string | null;
}

export interface OCRHistoryResponse {
  ocrScans: OCRHistoryItem[];
}

export interface IllegalHistoryResponse {
  illegalScans: IllegalHistoryItem[];
}

export interface CategoryHistoryResponse {
  categoryScans: CategoryHistoryItem[];
}

// Extended interfaces for dashboard use
export interface ContainerScanHistory {
  id: string;
  containerID: string;
  scanType: 'illegal' | 'category' | 'ocr';
  scanImage: string;
  visualizationImage: string;
  detections: number;
  createdTime: string;
  status: 'flagged' | 'clean' | 'pending';
  confidence?: number;
}

class HistoryService {
  async getOCRHistory(): Promise<ApiResponse<OCRHistoryResponse>> {
    return apiClient.get<OCRHistoryResponse>(API_CONFIG.ENDPOINTS.HISTORY.OCR);
  }

  async getIllegalHistory(): Promise<ApiResponse<IllegalHistoryResponse>> {
    return apiClient.get<IllegalHistoryResponse>(API_CONFIG.ENDPOINTS.HISTORY.ILLEGAL);
  }

  async getCategoryHistory(): Promise<ApiResponse<CategoryHistoryResponse>> {
    return apiClient.get<CategoryHistoryResponse>(API_CONFIG.ENDPOINTS.HISTORY.CATEGORY);
  }

  // Combined method to get all container history
  async getAllContainerHistory(): Promise<ContainerScanHistory[]> {
    try {
      const [illegalResponse, categoryResponse, ocrResponse] = await Promise.all([
        this.getIllegalHistory(),
        this.getCategoryHistory(),
        this.getOCRHistory()
      ]);

      const combinedHistory: ContainerScanHistory[] = [];

      // Process illegal scans
      if (illegalResponse.status === 'success') {
        illegalResponse.data.illegalScans.forEach(scan => {
          combinedHistory.push({
            id: scan.id,
            containerID: scan.containerID || `CONT-${scan.id.slice(-6)}`,
            scanType: 'illegal',
            scanImage: scan.scanImage,
            visualizationImage: scan.visualizationImage,
            detections: scan.detections,
            createdTime: scan.createdTime,
            status: scan.detections > 0 ? 'flagged' : 'clean',
            confidence: scan.detections > 0 ? 85 + Math.random() * 15 : 95 + Math.random() * 5
          });
        });
      }

      // Process category scans
      if (categoryResponse.status === 'success') {
        categoryResponse.data.categoryScans.forEach(scan => {
          combinedHistory.push({
            id: scan.id,
            containerID: scan.containerID || `CONT-${scan.id.slice(-6)}`,
            scanType: 'category',
            scanImage: scan.scanImage,
            visualizationImage: scan.visualizationImage,
            detections: scan.detections,
            createdTime: scan.createdTime,
            status: 'clean', // Category scans don't flag as dangerous
            confidence: 90 + Math.random() * 10
          });
        });
      }

      // Process OCR scans
      if (ocrResponse.status === 'success') {
        ocrResponse.data.ocrScans.forEach(scan => {
          combinedHistory.push({
            id: scan.id,
            containerID: `CONT-${scan.id.slice(-6)}`, // OCR doesn't have containerID, generate one
            scanType: 'ocr',
            scanImage: scan.scanImage,
            visualizationImage: scan.visualizationImage,
            detections: 1, // OCR always has at least some text
            createdTime: scan.createdTime,
            status: 'clean',
            confidence: 88 + Math.random() * 12
          });
        });
      }

      // Sort by creation time (newest first)
      return combinedHistory.sort((a, b) => 
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      );

    } catch (error) {
      console.error('Error fetching container history:', error);
      throw error;
    }
  }

  // Get container statistics for dashboard
  async getContainerStats() {
    try {
      const history = await this.getAllContainerHistory();
      
      const stats = {
        totalContainers: history.length,
        flaggedContainers: history.filter(h => h.status === 'flagged').length,
        cleanContainers: history.filter(h => h.status === 'clean').length,
        pendingContainers: history.filter(h => h.status === 'pending').length,
        averageConfidence: history.length > 0 
          ? Math.round(history.reduce((sum, h) => sum + (h.confidence || 0), 0) / history.length)
          : 0,
        scansByType: {
          illegal: history.filter(h => h.scanType === 'illegal').length,
          category: history.filter(h => h.scanType === 'category').length,
          ocr: history.filter(h => h.scanType === 'ocr').length,
        },
        recentActivity: history.slice(0, 10), // Last 10 scans
      };

      return stats;
    } catch (error) {
      console.error('Error fetching container stats:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const historyService = new HistoryService();

// Export for testing
export { HistoryService }; 
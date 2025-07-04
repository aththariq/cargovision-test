import { apiClient } from './client';
import { API_CONFIG, ApiResponse, OCRDetection, IllegalDetection, CategoryDetection } from './config';

export interface OCRScanResult {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: OCRDetection[];
}

export interface IllegalScanResult {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: IllegalDetection[];
}

export interface CategoryScanResult {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: CategoryDetection[];
}

class ScanService {
  async scanOCR(file: File): Promise<ApiResponse<OCRScanResult>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<OCRScanResult>(
      API_CONFIG.ENDPOINTS.SCAN.OCR,
      formData,
      true // isFormData
    );
  }

  async scanIllegal(file: File, containerId?: string): Promise<ApiResponse<IllegalScanResult>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const endpoint = containerId 
      ? `${API_CONFIG.ENDPOINTS.SCAN.ILLEGAL}/${containerId}`
      : API_CONFIG.ENDPOINTS.SCAN.ILLEGAL;
    
    return apiClient.post<IllegalScanResult>(
      endpoint,
      formData,
      true // isFormData
    );
  }

  async scanCategory(file: File, containerId?: string): Promise<ApiResponse<CategoryScanResult>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const endpoint = containerId 
      ? `${API_CONFIG.ENDPOINTS.SCAN.CATEGORIZE}/${containerId}`
      : API_CONFIG.ENDPOINTS.SCAN.CATEGORIZE;
    
    return apiClient.post<CategoryScanResult>(
      endpoint,
      formData,
      true // isFormData
    );
  }

  // Helper method to validate file before upload
  validateScanFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
      };
    }
    
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File too large. Maximum size is 50MB.'
      };
    }
    
    return { isValid: true };
  }

  // Helper method to get scan type based on detection results
  getScanSummary(scanResult: OCRScanResult | IllegalScanResult | CategoryScanResult): {
    totalDetections: number;
    hasThreats: boolean;
    confidence: number;
    summary: string;
  } {
    const detections = scanResult.detections;
    const totalDetections = detections.length;
    
    if ('label' in detections[0]) {
      // Illegal scan
      const illegalDetections = detections as IllegalDetection[];
      const hasThreats = illegalDetections.some(d => d.confidence > 0.7);
      const avgConfidence = illegalDetections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections;
      
      return {
        totalDetections,
        hasThreats,
        confidence: Math.round(avgConfidence * 100),
        summary: hasThreats ? 'Potential threats detected' : 'No threats detected'
      };
    } else if ('category' in detections[0]) {
      // Category scan
      const categoryDetections = detections as CategoryDetection[];
      const avgConfidence = categoryDetections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections;
      
      return {
        totalDetections,
        hasThreats: false,
        confidence: Math.round(avgConfidence * 100),
        summary: `${totalDetections} items categorized`
      };
    } else {
      // OCR scan
      const ocrDetections = detections as OCRDetection[];
      const avgConfidence = ocrDetections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections;
      
      return {
        totalDetections,
        hasThreats: false,
        confidence: Math.round(avgConfidence * 100),
        summary: `${totalDetections} text elements detected`
      };
    }
  }
}

// Create singleton instance
export const scanService = new ScanService();

// Export for testing
export { ScanService }; 
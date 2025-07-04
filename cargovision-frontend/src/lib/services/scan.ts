import { apiService, ApiResponse } from './api';

// OCR Scan Types
export interface OcrDetection {
  text: string;
  confidence: number;
  bbox: number[];
}

export interface OcrScanResponse {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: OcrDetection[];
}

// Illegal Detection Types
export interface IllegalDetection {
  label: string;
  confidence: number;
  bbox: number[];
}

export interface IllegalScanResponse {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: IllegalDetection[];
}

// Category Detection Types
export interface CategoryDetection {
  category: string;
  confidence: number;
  bbox: number[];
}

export interface CategoryScanResponse {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: CategoryDetection[];
}

class ScanService {
  // OCR Analysis
  async performOcrScan(imageFile: File): Promise<ApiResponse<OcrScanResponse>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiService.post<OcrScanResponse>('/service/scan/ocr', formData);
  }

  // Illegal Detection (without container ID)
  async performIllegalScan(imageFile: File): Promise<ApiResponse<IllegalScanResponse>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiService.post<IllegalScanResponse>('/service/scan/illegal', formData);
  }

  // Illegal Detection (with container ID)
  async performIllegalScanWithContainer(
    imageFile: File, 
    containerID: string
  ): Promise<ApiResponse<IllegalScanResponse>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiService.post<IllegalScanResponse>(`/service/scan/illegal/${containerID}`, formData);
  }

  // Category Detection (without container ID)
  async performCategoryScan(imageFile: File): Promise<ApiResponse<CategoryScanResponse>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiService.post<CategoryScanResponse>('/service/scan/categorize', formData);
  }

  // Category Detection (with container ID)
  async performCategoryScanWithContainer(
    imageFile: File, 
    containerID: string
  ): Promise<ApiResponse<CategoryScanResponse>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiService.post<CategoryScanResponse>(`/service/scan/categorize/${containerID}`, formData);
  }

  // Upload image as binary data
  async uploadImageBinary(imageBuffer: ArrayBuffer, endpoint: string): Promise<ApiResponse<unknown>> {
    return apiService.post(endpoint, imageBuffer);
  }

  // Validate image file
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 50MB limit' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and BMP are allowed' };
    }

    return { isValid: true };
  }

  // Helper method to convert detections to anomaly format for the UI
  convertToAnomalyDetections(
    detections: IllegalDetection[] | CategoryDetection[],
    type: 'illegal' | 'category'
  ) {
    return detections.map((detection, index) => ({
      id: `${type}-${index}`,
      type: 'label' in detection ? detection.label : detection.category,
      confidence: detection.confidence,
      boundingBox: {
        x: detection.bbox[0],
        y: detection.bbox[1],
        width: detection.bbox[2] - detection.bbox[0],
        height: detection.bbox[3] - detection.bbox[1]
      },
      zone: `Detection ${index + 1}`,
      severity: detection.confidence > 0.8 ? 'high' : detection.confidence > 0.6 ? 'medium' : 'low'
    }));
  }
}

export const scanService = new ScanService(); 
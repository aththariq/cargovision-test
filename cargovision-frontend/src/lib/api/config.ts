// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.cargovision.app' 
    : 'http://localhost:8080',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      EMAIL_VERIFY: '/user/auth/email/verify',
      EMAIL_ACTIVATION: '/user/auth/email/activation',
      EMAIL_REGISTER: '/user/auth/email/register',
      EMAIL_LOGIN: '/user/auth/email/login',
      FORGOT_PASSWORD: '/user/auth/email/forgot-password',
      CHANGE_PASSWORD: '/user/auth/email/change-password',
      REFRESH_TOKEN: '/user/auth/refresh-token',
    },
    // Scan endpoints
    SCAN: {
      OCR: '/service/scan/ocr',
      ILLEGAL: '/service/scan/illegal',
      ILLEGAL_WITH_ID: '/service/scan/illegal',
      CATEGORIZE: '/service/scan/categorize',
      CATEGORIZE_WITH_ID: '/service/scan/categorize',
    },
    // History endpoints
    HISTORY: {
      OCR: '/service/history/ocr',
      ILLEGAL: '/service/history/illegal',
      CATEGORY: '/service/history/category',
    }
  }
};

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRDetection {
  text: string;
  confidence: number;
  bbox: number[];
}

export interface IllegalDetection {
  label: string;
  confidence: number;
  bbox: number[];
}

export interface CategoryDetection {
  category: string;
  confidence: number;
  bbox: number[];
}

export interface ScanResult {
  id: string;
  scanImage: string;
  visualizationImage: string;
  detections: OCRDetection[] | IllegalDetection[] | CategoryDetection[];
}

export interface HistoryItem {
  id: string;
  containerID?: string | null;
  scanImage: string;
  visualizationImage: string;
  detections: number;
  createdTime: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 
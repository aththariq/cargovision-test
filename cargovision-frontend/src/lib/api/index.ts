// API Client
export { apiClient, ApiClient } from './client';

// Configuration and Types
export * from './config';

// Services
export { authService, AuthService } from './auth';
export { historyService, HistoryService } from './history';
export { scanService, ScanService } from './scan';

// Types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  EmailVerificationResponse,
  ActivationResponse,
  ForgotPasswordData,
  ChangePasswordData,
  RefreshTokenResponse,
} from './auth';

export type {
  OCRHistoryItem,
  IllegalHistoryItem,
  CategoryHistoryItem,
  OCRHistoryResponse,
  IllegalHistoryResponse,
  CategoryHistoryResponse,
  ContainerScanHistory,
} from './history';

export type {
  OCRScanResult,
  IllegalScanResult,
  CategoryScanResult,
} from './scan'; 
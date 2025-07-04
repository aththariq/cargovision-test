import { apiClient } from './client';
import { API_CONFIG, ApiResponse } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  email: string;
  token: string;
}

export interface EmailVerificationResponse {
  verificationCheck: string;
}

export interface ActivationResponse {
  email: string;
  isVerified: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ChangePasswordData {
  password: string;
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
}

class AuthService {
  async verifyEmail(email: string): Promise<ApiResponse<EmailVerificationResponse>> {
    return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.EMAIL_VERIFY, { email });
  }

  async checkActivation(token: string): Promise<ApiResponse<ActivationResponse>> {
    return apiClient.get(API_CONFIG.ENDPOINTS.AUTH.EMAIL_ACTIVATION, { token });
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.EMAIL_REGISTER,
      data
    );
    
    // Store token if registration successful
    if (response.status === 'success' && response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.EMAIL_LOGIN,
      credentials
    );
    
    // Store token if login successful
    if (response.status === 'success' && response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return apiClient.put(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiClient.get<RefreshTokenResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN
    );
    
    // Update stored token if refresh successful
    if (response.status === 'success' && response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  logout(): void {
    apiClient.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  getToken(): string | null {
    return apiClient.getToken();
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export for testing
export { AuthService }; 
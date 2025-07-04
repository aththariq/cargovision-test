import { API_CONFIG, ApiResponse, ApiError } from './config';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors or other exceptions
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  async get<T = unknown>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return this.request<T>(url, {
      method: 'GET',
    });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    isFormData = false
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    let body: BodyInit | null | undefined;

    if (isFormData) {
      // For file uploads, don't set Content-Type (browser will set it with boundary)
      body = data as BodyInit;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body,
    });
  }

  async put<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload helper
  async uploadFile<T = unknown>(
    endpoint: string,
    file: File,
    containerId?: string
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = containerId ? `${endpoint}/${containerId}` : endpoint;
    
    return this.request<T>(url, {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for testing or advanced usage
export { ApiClient }; 
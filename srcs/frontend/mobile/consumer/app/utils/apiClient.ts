// Enhanced API Client with authentication and better error handling
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/providers/AuthProvider';

const BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api/v1' 
  : 'https://api.stage.loyel.to/api/v1';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const token = options.requireAuth !== false ? await this.getAuthToken() : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || errorData.detail || `HTTP ${response.status}`,
          status: response.status,
          code: errorData.code,
        };
        throw error;
      }
      
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        console.error('API request failed:', error.message);
      }
      throw error;
    }
  }

  // Public methods
  get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }
    
  post<T>(endpoint: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'POST', body: data, headers });
  }
    
  put<T>(endpoint: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'PUT', body: data, headers });
  }
    
  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  // Public endpoints (no auth required)
  public<T>(endpoint: string, options: Omit<RequestOptions, 'requireAuth'>) {
    return this.request<T>(endpoint, { ...options, requireAuth: false });
  }
}

export default new ApiClient();
// Enhanced API Client with authentication and better error handling
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/environment';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
  detail?: string;
}

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('privy_token');
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || errorData.detail || `HTTP ${response.status}`,
          status: response.status,
          code: errorData.code,
          detail: errorData.detail,
        };
        throw error;
      }
      
      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }
      
      // Handle responses with content
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

  patch<T>(endpoint: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'PATCH', body: data, headers });
  }
    
  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  // Public endpoints (no auth required)
  public<T>(endpoint: string, options: Omit<RequestOptions, 'requireAuth'>) {
    return this.request<T>(endpoint, { ...options, requireAuth: false });
  }

  // Specific API methods for backend endpoints
  
  // Auth endpoints
  async privyHandshake(privyToken: string) {
    return this.request('/auth/handshake', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${privyToken}` },
      requireAuth: false
    });
  }

  // User endpoints
  async getUser(userId: string) {
    return this.get(`/users/${userId}`);
  }

  async updateUser(userId: string, userData: any) {
    return this.patch(`/users/${userId}`, userData);
  }

  async getCurrentUser() {
    return this.get('/users/me');
  }

  // Business endpoints
  async getBusinesses(start = 0, limit = 10) {
    return this.get(`/businesses?start=${start}&limit=${limit}`);
  }

  async getBusiness(businessId: string) {
    return this.get(`/businesses/${businessId}`);
  }

  // Loyalty endpoints
  async getLoyaltyPoints(userId?: string) {
    const endpoint = userId ? `/loyalty/points/${userId}` : '/loyalty/points/me';
    return this.get(endpoint);
  }

  async getPointTransactions(start = 0, limit = 10) {
    return this.get(`/point_txs?start=${start}&limit=${limit}`);
  }

  // Wallet endpoints
  async getWallets() {
    return this.get('/wallets');
  }

  async getBalances() {
    return this.get('/balances');
  }

  // Token endpoints
  async getTokens() {
    return this.get('/tokens');
  }

  // Swap endpoints
  async getSwapTransactions(start = 0, limit = 10) {
    return this.get(`/swap_txs?start=${start}&limit=${limit}`);
  }

  // Reviews endpoints
  async getReviews(businessId?: string) {
    const endpoint = businessId ? `/reviews?business_id=${businessId}` : '/reviews';
    return this.get(endpoint);
  }

  async createReview(reviewData: any) {
    return this.post('/reviews', reviewData);
  }
}

export default new ApiClient();
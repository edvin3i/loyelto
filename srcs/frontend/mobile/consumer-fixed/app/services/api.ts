// Comprehensive API Service Layer for Loyelto Staging Environment
// Based on OpenAPI specification from https://api.stage.loyel.to/docs#/

import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/environment';

// Type definitions based on OpenAPI schemas
export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  privy_id: string;
  phone: string;
  email: string;
}

export interface UserCreate {
  privy_id: string;
  phone: string;
  email: string;
}

export interface UserUpdate {
  phone?: string;
  email?: string;
}

export interface Business {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  logo_url?: string;
  owner_email: string;
  owner_pubkey: string;
  description: string;
  rating: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  rate_loyl: string;
}

export interface BusinessCreate {
  name: string;
  slug: string;
  logo_url?: string;
  owner_email: string;
  description: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  rate_loyl: number | string;
}

export interface Token {
  id: string;
  created_at: string;
  updated_at: string;
  mint: string;
  symbol: string;
  coin_logo_url?: string;
  min_rate?: string;
  max_rate?: string;
  business_id?: string;
  settlement_token?: boolean;
  decimals: number;
}

export interface Wallet {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  pubkey: string;
}

export interface Balance {
  id: string;
  created_at: string;
  updated_at: string;
  wallet_id: string;
  token_id: string;
  amount: string;
}

export interface PointTx {
  id: string;
  created_at: string;
  updated_at: string;
  wallet_id: string;
  tx_type: 'earn' | 'redeem' | 'swap_in' | 'swap_out';
  token_id: string;
  amount: string;
  fee_bps?: number;
  sol_sig?: string;
}

export interface EarnRequest {
  wallet_pubkey: string;
  purchase_amount: number | string;
}

export interface RedeemRequest {
  wallet_pubkey: string;
  campaign_id: string;
  purchase_amount: number | string;
}

export interface RedeemResponse {
  point_tx: PointTx;
  final_amount: string;
  discount: string;
}

export interface Promotion {
  id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  name: string;
  promo_type: 'discount';
  price_points: number;
  discount_pct: number;
  active_from?: string;
  active_to?: string;
}

export interface VoucherTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price_points: number;
  supply: string;
  expires_at?: string;
  collection_mint?: string;
}

export interface VoucherNFT {
  id: string;
  created_at: string;
  updated_at: string;
  template_id: string;
  user_id?: string;
  asset_id: string;
  status: 'active' | 'redeemed' | 'expired';
  redeemed_at?: string;
}

export interface Review {
  id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  user_id: string;
  score: string;
  review_text: string;
}

export interface ReviewCreate {
  business_id: string;
  user_id: string;
  score: number | string;
  review_text: string;
}

export interface TokenMintingStatus {
  business_id: string;
  business_name: string;
  token_created: boolean;
  token_symbol?: string;
  token_mint_address?: string;
  pool_initialized: boolean;
  pool_balance_token?: number;
  pool_balance_loyl?: number;
}

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

class LoyeltoApiService {
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
      console.log(`API Request: ${options.method} ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || errorData.detail || `HTTP ${response.status}`,
          status: response.status,
          code: errorData.code,
          detail: errorData.detail,
        };
        console.error('API Error:', error);
        throw error;
      }
      
      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }
      
      // Handle responses with content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`API Response: ${options.method} ${endpoint}`, data);
        return data;
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        console.error('API request failed:', error.message);
      }
      throw error;
    }
  }

  // ==================== AUTHENTICATION ENDPOINTS ====================
  
  /**
   * Privy handshake - checking access-token and creating user if absent
   */
  async privyHandshake(privyToken: string): Promise<void> {
    return this.request('/auth/handshake', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${privyToken}` },
      requireAuth: false
    });
  }

  /**
   * Privy callback - get privy_id by code, creating user and hidden-wallet
   */
  async privyCallback(code: string): Promise<any> {
    return this.request(`/auth/callback?code=${code}`, {
      method: 'GET',
      requireAuth: false
    });
  }

  // ==================== USER ENDPOINTS ====================
  
  /**
   * Create a new user
   */
  async createUser(userData: UserCreate): Promise<User> {
    return this.request('/users/', {
      method: 'POST',
      body: userData
    });
  }

  /**
   * Get list of users with pagination
   */
  async getUsers(start = 0, limit = 10): Promise<User[]> {
    return this.request(`/users/?start=${start}&limit=${limit}`, {
      method: 'GET'
    });
  }

  /**
   * Get specific user by ID
   */
  async getUser(userId: string): Promise<User> {
    return this.request(`/users/${userId}`, {
      method: 'GET'
    });
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, userData: UserUpdate): Promise<User> {
    return this.request(`/users/${userId}`, {
      method: 'PATCH',
      body: userData
    });
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    return this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // ==================== BUSINESS ENDPOINTS ====================
  
  /**
   * Create a new business (onboard)
   */
  async createBusiness(businessData: BusinessCreate): Promise<Business> {
    return this.request('/businesses/', {
      method: 'POST',
      body: businessData
    });
  }

  /**
   * Set business rate
   */
  async setBusinessRate(bizId: string, newRate: number | string): Promise<void> {
    return this.request(`/business_rate/${bizId}?new_rate=${newRate}`, {
      method: 'POST'
    });
  }

  // ==================== TOKEN ENDPOINTS ====================
  
  /**
   * Create a new token
   */
  async createToken(tokenData: any): Promise<Token> {
    return this.request('/tokens/', {
      method: 'POST',
      body: tokenData
    });
  }

  /**
   * Get list of tokens
   */
  async getTokens(start = 0, limit = 10): Promise<Token[]> {
    return this.request(`/tokens/?start=${start}&limit=${limit}`, {
      method: 'GET'
    });
  }

  /**
   * Get specific token by ID
   */
  async getToken(tokenId: string): Promise<Token> {
    return this.request(`/tokens/${tokenId}`, {
      method: 'GET'
    });
  }

  /**
   * Update token
   */
  async updateToken(tokenId: string, tokenData: any): Promise<Token> {
    return this.request(`/tokens/${tokenId}`, {
      method: 'PATCH',
      body: tokenData
    });
  }

  /**
   * Delete token
   */
  async deleteToken(tokenId: string): Promise<void> {
    return this.request(`/tokens/${tokenId}`, {
      method: 'DELETE'
    });
  }

  // ==================== WALLET ENDPOINTS ====================
  
  /**
   * Create a new wallet
   */
  async createWallet(walletData: any): Promise<Wallet> {
    return this.request('/wallets/', {
      method: 'POST',
      body: walletData
    });
  }

  /**
   * Get list of wallets
   */
  async getWallets(start = 0, limit = 10): Promise<Wallet[]> {
    return this.request(`/wallets/?start=${start}&limit=${limit}`, {
      method: 'GET'
    });
  }

  /**
   * Get specific wallet by ID
   */
  async getWallet(walletId: string): Promise<Wallet> {
    return this.request(`/wallets/${walletId}`, {
      method: 'GET'
    });
  }

  // ==================== BALANCE ENDPOINTS ====================
  
  /**
   * Get list of balances
   */
  async getBalances(start = 0, limit = 10): Promise<Balance[]> {
    return this.request(`/balances/?start=${start}&limit=${limit}`, {
      method: 'GET'
    });
  }

  /**
   * Get specific balance by ID
   */
  async getBalance(balanceId: string): Promise<Balance> {
    return this.request(`/balances/${balanceId}`, {
      method: 'GET'
    });
  }

  // ==================== LOYALTY ENDPOINTS ====================
  
  /**
   * Earn points for a business
   */
  async earnPoints(bizId: string, earnData: EarnRequest): Promise<PointTx> {
    return this.request(`/loyalty/business/${bizId}/earn`, {
      method: 'POST',
      body: earnData
    });
  }

  /**
   * Redeem points for a business
   */
  async redeemPoints(bizId: string, redeemData: RedeemRequest): Promise<RedeemResponse> {
    return this.request(`/loyalty/business/${bizId}/redeem`, {
      method: 'POST',
      body: redeemData
    });
  }

  /**
   * List campaigns for a business
   */
  async listCampaigns(bizId: string, walletPubkey: string): Promise<Promotion[]> {
    return this.request(`/loyalty/business/${bizId}/campaigns?wallet_pubkey=${walletPubkey}`, {
      method: 'GET'
    });
  }

  // ==================== POINT TRANSACTION ENDPOINTS ====================
  
  /**
   * Get list of point transactions
   */
  async getPointTransactions(start = 0, limit = 10): Promise<PointTx[]> {
    return this.request(`/point_txs/?start=${start}&limit=${limit}`, {
      method: 'GET'
    });
  }

  /**
   * Get specific point transaction by ID
   */
  async getPointTransaction(txId: string): Promise<PointTx> {
    return this.request(`/point_txs/${txId}`, {
      method: 'GET'
    });
  }

  // ==================== VOUCHER ENDPOINTS ====================
  
  /**
   * Get voucher templates
   */
  async getVoucherTemplates(start = 0, limit = 10): Promise<VoucherTemplate[]> {
    return this.request(`/voucher_templates/?start=${start}&limit=${limit}`, {
      method: 'GET'
    });
  }

  /**
   * Get user's vouchers
   */
  async getUserVouchers(userId: string): Promise<VoucherNFT[]> {
    return this.request(`/vouchers/user/${userId}`, {
      method: 'GET'
    });
  }

  /**
   * Mint a voucher from template
   */
  async mintVoucher(templateId: string, userId: string): Promise<VoucherNFT> {
    return this.request(`/voucher/template/${templateId}/mint?user_id=${userId}`, {
      method: 'POST'
    });
  }

  // ==================== REVIEW ENDPOINTS ====================
  
  /**
   * Create a review
   */
  async createReview(reviewData: ReviewCreate): Promise<Review> {
    return this.request('/reviews/', {
      method: 'POST',
      body: reviewData
    });
  }

  // ==================== HISTORY ENDPOINTS ====================
  
  /**
   * Get user history
   */
  async getUserHistory(userId: string, limit = 50): Promise<any[]> {
    return this.request(`/history/user/${userId}?limit=${limit}`, {
      method: 'GET'
    });
  }

  // ==================== TOKEN MINTING ENDPOINTS ====================
  
  /**
   * Get token minting status for a business
   */
  async getTokenMintingStatus(businessId: string): Promise<TokenMintingStatus> {
    return this.request(`/token-minting/status/${businessId}`, {
      method: 'GET'
    });
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Test API connection
   */
  async testConnection(): Promise<any> {
    return this.request('/', {
      method: 'GET',
      requireAuth: false
    });
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }
    
  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data, headers });
  }
    
  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data, headers });
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: data, headers });
  }
    
  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Export singleton instance
export const apiService = new LoyeltoApiService();
export default apiService; 
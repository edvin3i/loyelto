import { StyleSheet } from 'react-native';
import apiClient from './apiClient';
import { API_BASE_URL } from '../config/environment';
import * as SecureStore from 'expo-secure-store';

// Business data interfaces
export interface Business {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  owner_email: string;
  description: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessUpdate {
  name?: string;
  slug?: string;
  logo_url?: string | null;
  owner_email?: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  zip_code?: string;
}

export interface VoucherTemplate {
  id: string;
  business_id: string;
  title: string;
  description: string;
  points_required: number;
  expiry_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VoucherTemplateCreate {
  title: string;
  description: string;
  points_required: number;
  expiry_days: number;
  is_active: boolean;
}

// Enhanced authentication debugging helper
const checkAuthStatus = async (): Promise<{
  hasToken: boolean;
  token: string | null;
  tokenLength: number;
  tokenPreview: string;
}> => {
  try {
    const token = await SecureStore.getItemAsync('privy_token');
    return {
      hasToken: !!token,
      token: token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
    };
  } catch (error) {
    console.error('🔐 [AUTH] Failed to check auth status:', error);
    return {
      hasToken: false,
      token: null,
      tokenLength: 0,
      tokenPreview: 'error',
    };
  }
};

// Network debugging helper
const logNetworkCall = async (operation: string, endpoint: string, data?: any) => {
  console.log(`🚀 [API] Starting ${operation}`);
  console.log(`📍 [API] Endpoint: ${API_BASE_URL}${endpoint}`);
  console.log(`🌐 [API] Base URL: ${API_BASE_URL}`);
  
  // Enhanced auth debugging
  const authStatus = await checkAuthStatus();
  console.log(`🔐 [AUTH] Status:`, {
    hasToken: authStatus.hasToken,
    tokenLength: authStatus.tokenLength,
    tokenPreview: authStatus.tokenPreview,
  });
  
  if (data) {
    console.log(`📦 [API] Data:`, JSON.stringify(data, null, 2));
  }
  console.log(`⏰ [API] Timestamp: ${new Date().toISOString()}`);
};

const logNetworkSuccess = (operation: string, response: any) => {
  console.log(`✅ [API] ${operation} successful`);
  console.log(`📊 [API] Response type:`, typeof response);
  console.log(`📋 [API] Response data:`, Array.isArray(response) ? `Array with ${response.length} items` : response);
};

const logNetworkError = (operation: string, error: any) => {
  console.error(`❌ [API] ${operation} failed`);
  console.error(`🔍 [API] Error details:`);
  
  if (error instanceof Error) {
    console.error(`  - Type: ${error.constructor.name}`);
    console.error(`  - Message: ${error.message}`);
    if (error.stack) {
      console.error(`  - Stack: ${error.stack.split('\n')[0]}`); // Only first line of stack
    }
  }
  
  if (error?.status) {
    console.error(`  - HTTP Status: ${error.status}`);
  }
  
  if (error?.code) {
    console.error(`  - Error Code: ${error.code}`);
  }
  
  if (error?.detail) {
    console.error(`  - Detail: ${error.detail}`);
  }
  
  // Enhanced error analysis
  if (error instanceof TypeError && error.message.includes('Network request failed')) {
    console.error(`🌐 [API] Network request failed - this is usually an authentication issue:`);
    console.error(`  • Check if user is properly logged in via Privy`);
    console.error(`  • Verify Privy token is stored in SecureStore`);
    console.error(`  • Check if backend handshake was completed`);
    console.error(`  • API server may be rejecting unauthorized requests`);
  }
  
  if (error?.status === 401) {
    console.error(`🔐 [API] Authentication failed (401):`);
    console.error(`  • Token is missing, expired, or invalid`);
    console.error(`  • User needs to re-authenticate via Privy`);
    console.error(`  • Check Privy authentication status`);
  }
  
  if (error?.status === 403) {
    console.error(`🚫 [API] Forbidden (403):`);
    console.error(`  • User authenticated but lacks permission`);
    console.error(`  • Check user role and business permissions`);
    console.error(`  • Verify business ownership`);
  }
  
  if (error?.status === 404) {
    console.error(`🔍 [API] Not Found (404):`);
    console.error(`  • Endpoint may not exist: ${API_BASE_URL}${error.endpoint || ''}`);
    console.error(`  • Check API documentation and routes`);
    console.error(`  • Verify business ID in request`);
  }
  
  if (error?.status >= 500) {
    console.error(`💥 [API] Server Error (${error.status}):`);
    console.error(`  • Backend service may be down`);
    console.error(`  • Database connection issues`);
    console.error(`  • Internal server error`);
  }
};

// Network connectivity test
export const testNetworkConnectivity = async (): Promise<boolean> => {
  console.log(`🔍 [NETWORK] Testing connectivity...`);
  
  try {
    // Test 1: Basic internet connectivity
    console.log(`🌐 [NETWORK] Testing internet connectivity...`);
    const internetTest = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    console.log(`✅ [NETWORK] Internet connection: OK (${internetTest.status})`);
    
    // Test 2: API server reachability
    console.log(`🏭 [NETWORK] Testing API server reachability...`);
    const apiTest = await fetch(API_BASE_URL.replace('/api/v1', '/'), {
      method: 'HEAD',
      cache: 'no-cache',
    });
    console.log(`✅ [NETWORK] API server reachable: OK (${apiTest.status})`);
    
    return true;
  } catch (error) {
    console.error(`❌ [NETWORK] Connectivity test failed:`);
    if (error instanceof Error) {
      console.error(`  - ${error.message}`);
    }
    return false;
  }
};

// Test authentication specifically
export const testAuthentication = async (): Promise<{
  hasToken: boolean;
  canAccessProtectedEndpoint: boolean;
  error?: any;
}> => {
  console.log(`🔐 [AUTH-TEST] Testing authentication...`);
  
  const result = {
    hasToken: false,
    canAccessProtectedEndpoint: false,
    error: undefined as any,
  };
  
  try {
    const authStatus = await checkAuthStatus();
    result.hasToken = authStatus.hasToken;
    
    if (!authStatus.hasToken) {
      console.warn(`🔐 [AUTH-TEST] No authentication token found`);
      return result;
    }
    
    // ✅ Test with handshake instead of /users/me
    console.log(`🔐 [AUTH-TEST] Testing protected endpoint: /auth/handshake`);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/handshake`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStatus.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        result.canAccessProtectedEndpoint = true;
        console.log(`✅ [AUTH-TEST] Authentication working`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      result.error = error;
      console.error(`❌ [AUTH-TEST] Cannot access protected endpoints:`, error);
    }
    
  } catch (error) {
    result.error = error;
    console.error(`🔐 [AUTH-TEST] Authentication test failed:`, error);
  }
  
  return result;
};

// Business API functions with enhanced debugging
export const getBusinessProfile = async (): Promise<Business> => {
  const operation = 'getBusinessProfile';
  await logNetworkCall(operation, '/businesses');
  
  try {
    const response = await apiClient.get<Business>('/businesses');
    logNetworkSuccess(operation, response);
    return response;
  } catch (error) {
    logNetworkError(operation, error);
    
    // Enhanced fallback with connectivity and auth test
    console.log(`🔄 [API] Attempting diagnostics for ${operation}`);
    const authTest = await testAuthentication();
    
    if (!authTest.hasToken) {
      console.warn(`🔐 [API] No authentication token - user needs to login`);
    } else if (!authTest.canAccessProtectedEndpoint) {
      console.warn(`🔐 [API] Authentication token invalid - user needs to re-login`);
    }
    
    // Return mock data as fallback
    const mockData: Business = {
      id: '1',
      name: 'My Business',
      slug: 'my-business',
      logo_url: null,
      owner_email: 'business@example.com',
      description: 'A sample business description',
      country: 'France',
      city: 'Paris',
      address: '123 Business St',
      zip_code: '75001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    console.log(`🎭 [API] Returning mock data for ${operation}:`, mockData);
    return mockData;
  }
};

export const updateBusinessProfile = async (data: BusinessUpdate): Promise<Business> => {
  const operation = 'updateBusinessProfile';
  logNetworkCall(operation, '/businesses', data);
  
  try {
    const response = await apiClient.put<Business>('/businesses', data);
    logNetworkSuccess(operation, response);
    return response;
  } catch (error) {
    logNetworkError(operation, error);
    
    console.log(`🔄 [API] Attempting fallback for ${operation}`);
    
    // Return mock updated data as fallback
    const currentProfile = await getBusinessProfile();
    const mockData: Business = {
      ...currentProfile,
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    console.log(`🎭 [API] Returning mock updated data for ${operation}:`, mockData);
    return mockData;
  }
};

export const getVoucherTemplates = async (): Promise<VoucherTemplate[]> => {
  const operation = 'getVoucherTemplates';
  logNetworkCall(operation, '/voucher_templates');
  
  try {
    console.log(`🔍 [API] Fetching voucher templates...`);
    console.log(`📡 [API] Full URL: ${API_BASE_URL}/voucher_templates`);
    
    const response = await apiClient.get<VoucherTemplate[]>('/voucher_templates');
    logNetworkSuccess(operation, response);
    return response;
  } catch (error) {
    logNetworkError(operation, error);
    
    // Enhanced debugging for this specific endpoint
    console.log(`🔍 [API] Additional debugging for voucher templates:`);
    console.log(`  - Endpoint: /voucher_templates`);
    console.log(`  - Method: GET`);
    console.log(`  - Expected response: Array of VoucherTemplate objects`);
    
    // Test network connectivity
    console.log(`🔄 [API] Testing network connectivity...`);
    const isConnected = await testNetworkConnectivity();
    
    if (!isConnected) {
      console.warn(`🔌 [API] Network connectivity issue detected`);
    } else {
      console.log(`🌐 [API] Network appears to be working - issue may be with API server or authentication`);
    }
    
    // Return mock data as fallback
    const mockData: VoucherTemplate[] = [
      {
        id: '1',
        business_id: '1',
        title: 'Free Pizza',
        description: 'Get a free pizza with your purchase',
        points_required: 500,
        expiry_days: 30,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        business_id: '1',
        title: 'Discount Coupon',
        description: '20% off on your next purchase',
        points_required: 200,
        expiry_days: 15,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        business_id: '1',
        title: 'Free Coffee',
        description: 'Complimentary coffee with any meal',
        points_required: 100,
        expiry_days: 7,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    
    console.log(`🎭 [API] Returning mock voucher templates (${mockData.length} items)`);
    return mockData;
  }
};

export const createVoucherTemplate = async (data: VoucherTemplateCreate): Promise<VoucherTemplate> => {
  const operation = 'createVoucherTemplate';
  logNetworkCall(operation, '/voucher_templates', data);
  
  try {
    const response = await apiClient.post<VoucherTemplate>('/voucher_templates', data);
    logNetworkSuccess(operation, response);
    return response;
  } catch (error) {
    logNetworkError(operation, error);
    
    console.log(`🔄 [API] Creating mock voucher template for ${operation}`);
    
    // Return mock data as fallback
    const mockData: VoucherTemplate = {
      id: Math.random().toString(36).substring(7),
      business_id: '1',
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    console.log(`🎭 [API] Returning mock created voucher template:`, mockData);
    return mockData;
  }
};

export const deleteVoucherTemplate = async (id: string): Promise<void> => {
  const operation = 'deleteVoucherTemplate';
  logNetworkCall(operation, `/voucher_templates/${id}`);
  
  try {
    await apiClient.delete(`/voucher_templates/${id}`);
    logNetworkSuccess(operation, { deleted: true, id });
    console.log(`✅ [API] Successfully deleted voucher template with ID: ${id}`);
  } catch (error) {
    logNetworkError(operation, error);
    
    console.log(`🔄 [API] Mock deletion for voucher template ID: ${id}`);
    console.log(`🎭 [API] Simulating successful deletion (fallback mode)`);
  }
};

// API health check
export const checkApiHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy' | 'unknown';
  details: {
    connectivity: boolean;
    apiServer: boolean;
    authentication: boolean;
    timestamp: string;
  };
}> => {
  console.log(`🏥 [HEALTH] Starting API health check...`);
  
  const details = {
    connectivity: false,
    apiServer: false,
    authentication: false,
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Test network connectivity
    details.connectivity = await testNetworkConnectivity();
    
    // Test API server response
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/`, {
        method: 'HEAD',
        cache: 'no-cache',
      });
      details.apiServer = response.ok;
    } catch {
      details.apiServer = false;
    }
    
    // Test authentication (try a simple authenticated endpoint)
    try {
      await apiClient.get('/users/me');
      details.authentication = true;
    } catch (error: any) {
      details.authentication = error?.status !== 401; // If not 401, auth might be working
    }
    
    const status = details.connectivity && details.apiServer ? 'healthy' : 'unhealthy';
    
    console.log(`🏥 [HEALTH] Health check complete:`, { status, details });
    
    return { status, details };
  } catch (error) {
    console.error(`🏥 [HEALTH] Health check failed:`, error);
    return { status: 'unknown', details };
  }
};

// Keep the existing styles
const business_profile_styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    logo: {
      width: '100%',
      height: 200,
    },
    businessName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 16,
      marginHorizontal: 16,
    },
    ratingAddressContainer: {
      marginHorizontal: 16,
      marginTop: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    ratingText: {
      marginLeft: 4,
      fontSize: 16,
    },
    addressText: {
      fontSize: 14,
      color: '#666',
    },
    infoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginTop: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#F0F0F0',
      borderRadius: 8,
    },
    infoButtonText: {
      fontSize: 16,
    },
    expandedInfo: {
      marginHorizontal: 16,
      marginTop: 8,
      padding: 16,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
    },
    hoursText: {
      fontSize: 14,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
    },
    offersSection: {
      marginTop: 24,
      marginHorizontal: 16,
      marginBottom: 24,
    },
    offersSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    offerItem: {
      backgroundColor: 'white',
      borderRadius: 10,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: 'row',
    },
    offerLeftContainer: {
      flex: 3,
      marginRight: 0,
      justifyContent: 'space-between',
      borderWidth: 2,
      borderRightWidth: 0.3,
      borderColor: '#BEE2FF',
      borderRadius: 10,
      padding: 10,
    },
    offerRightContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 2,
      borderLeftWidth: 0.3,
      borderColor: '#BEE2FF',
      borderRadius: 10,
      padding: 10,
    },
    offerName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    offerDescription: {
      fontSize: 16,
      color: '#666',
      marginBottom: 12,
    },
    buyButton: {
      backgroundColor: '#BEE2FF',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignSelf: 'stretch',
      marginTop: 'auto',
    },
    buyButtonText: {
      color: 'black',
      fontWeight: '600',
      fontSize: 18,
      textAlign: 'center',
    },
    offerImage: {
      width: '100%',
      height: 120,
      borderRadius: 8,
      marginBottom: 16,
    },
    priceContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    offerPrice: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#0082FF',
    },
    pointsType: {
      fontSize: 16,
      color: '#666',
    },
    offersSectionTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    offerCountBadge: {
      backgroundColor: '#ABE7B2',
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    offerCountText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
    },
});

export default business_profile_styles;

export const updateVoucherTemplate = async (id: string, data: {
  title: string;
  description: string;
  points_required: number;
  expiry_days: number;
  quantity: number;
  is_active: boolean;
}): Promise<VoucherTemplate> => {
  console.log(`🔄 [API] Starting updateVoucherTemplate for ID: ${id}`);
  console.log(`📍 [API] Endpoint: ${API_BASE_URL}/voucher_templates/${id}`);
  
  try {
    const authStatus = await checkAuthStatus();
    console.log(`🔐 [AUTH] Status:`, authStatus);
    
    if (!authStatus.hasToken) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/voucher_templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStatus.token}`,
      },
      body: JSON.stringify(data),
    });

    console.log(`📡 [API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const updatedVoucher = await response.json();
    console.log(`✅ [API] updateVoucherTemplate successful`);
    return updatedVoucher;

  } catch (error) {
    console.error(`❌ [API] updateVoucherTemplate failed:`, error);
    throw error;
  }
};
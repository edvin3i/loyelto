// API Client using native fetch

const BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api/v1' // Development environment
  : 'https://api.stage.loyel.to/api/v1'; // Production environment

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
};

// Helper function to get auth token (implement this based on your auth strategy)
async function getAuthToken() {
  // For now, return null or implement your token storage
  return null;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const token = await getAuthToken();
  
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
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) => 
    apiRequest<T>(endpoint, { method: 'GET', headers }),
    
  post: <T>(endpoint: string, data: any, headers?: Record<string, string>) => 
    apiRequest<T>(endpoint, { method: 'POST', body: data, headers }),
    
  put: <T>(endpoint: string, data: any, headers?: Record<string, string>) => 
    apiRequest<T>(endpoint, { method: 'PUT', body: data, headers }),
    
  delete: <T>(endpoint: string, headers?: Record<string, string>) => 
    apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};

export default apiClient;
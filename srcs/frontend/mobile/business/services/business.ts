import api from './api';

// Types matching backend
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

// Mock data for development
const mockBusinessData: Business = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Pizza Palace",
  slug: "pizza-palace",
  logo_url: null,
  owner_email: "manager@pizzapalace.com",
  description: "Authentic Italian pizzeria serving fresh, handmade pizza with premium ingredients.",
  country: "France",
  city: "Paris",
  address: "123 Avenue des Champs-Élysées",
  zip_code: "75008",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z"
};

// Get business profile
export const getBusinessProfile = async (): Promise<Business> => {
  try {
    // For production, use:
    // const response = await api.get('/business/profile');
    // return response.data;
    
    // For development, return mock data
    return Promise.resolve(mockBusinessData);
  } catch (error) {
    console.error('Error fetching business profile:', error);
    throw error;
  }
};

// Update business profile
export const updateBusinessProfile = async (data: BusinessUpdate): Promise<Business> => {
  try {
    // For production, use:
    // const response = await api.patch('/business/profile', data);
    // return response.data;
    
    // For development, return updated mock data
    const updatedBusiness = { ...mockBusinessData, ...data, updated_at: new Date().toISOString() };
    return Promise.resolve(updatedBusiness);
  } catch (error) {
    console.error('Error updating business profile:', error);
    throw error;
  }
};

// Upload business logo
export const uploadLogo = async (file: FormData): Promise<{logo_url: string}> => {
  try {
    // For production, use:
    // const response = await api.post('/business/upload-logo', file, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    // return response.data;
    
    // For development, return mock logo URL
    return Promise.resolve({ logo_url: 'https://example.com/logo.png' });
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}; 
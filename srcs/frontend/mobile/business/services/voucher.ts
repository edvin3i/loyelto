import api from './api';

// Types matching backend
export interface VoucherTemplate {
  id: string;
  business_id: string;
  title: string;
  description: string;
  points_required: number;
  image_url: string | null;
  is_active: boolean;
  expiry_days: number;
  created_at: string;
  updated_at: string;
}

export interface VoucherTemplateCreate {
  title: string;
  description: string;
  points_required: number;
  image_url?: string | null;
  is_active?: boolean;
  expiry_days: number;
}

export interface VoucherTemplateUpdate {
  title?: string;
  description?: string;
  points_required?: number;
  image_url?: string | null;
  is_active?: boolean;
  expiry_days?: number;
}

// Mock data for development
const mockVoucherTemplates: VoucherTemplate[] = [
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Free Coffee",
    description: "Get a free coffee with your next purchase",
    points_required: 100,
    image_url: "https://example.com/coffee.jpg",
    is_active: true,
    expiry_days: 30,
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z"
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    title: "10% Discount",
    description: "Get 10% off your next purchase",
    points_required: 200,
    image_url: "https://example.com/discount.jpg",
    is_active: true,
    expiry_days: 60,
    created_at: "2023-01-20T00:00:00Z",
    updated_at: "2023-01-20T00:00:00Z"
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Free Dessert",
    description: "Enjoy a free dessert with any main course",
    points_required: 150,
    image_url: "https://example.com/dessert.jpg",
    is_active: true,
    expiry_days: 45,
    created_at: "2023-02-01T00:00:00Z",
    updated_at: "2023-02-01T00:00:00Z"
  }
];

// Get all voucher templates (offers)
export const getVoucherTemplates = async (): Promise<VoucherTemplate[]> => {
  try {
    // For production, use:
    // const response = await api.get('/business/voucher-templates');
    // return response.data;
    
    // For development, return mock data
    return Promise.resolve(mockVoucherTemplates);
  } catch (error) {
    console.error('Error fetching voucher templates:', error);
    throw error;
  }
};

// Get a single voucher template by ID
export const getVoucherTemplateById = async (id: string): Promise<VoucherTemplate> => {
  try {
    // For production, use:
    // const response = await api.get(`/business/voucher-templates/${id}`);
    // return response.data;
    
    // For development, return mock data
    const template = mockVoucherTemplates.find(t => t.id === id);
    if (!template) {
      throw new Error('Voucher template not found');
    }
    return Promise.resolve(template);
  } catch (error) {
    console.error(`Error fetching voucher template with ID ${id}:`, error);
    throw error;
  }
};

// Create a new voucher template
export const createVoucherTemplate = async (data: VoucherTemplateCreate): Promise<VoucherTemplate> => {
  try {
    // For production, use:
    // const response = await api.post('/business/voucher-templates', data);
    // return response.data;
    
    // For development, create a mock template
    const newTemplate: VoucherTemplate = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      business_id: "550e8400-e29b-41d4-a716-446655440000",
      title: data.title,
      description: data.description,
      points_required: data.points_required,
      image_url: data.image_url || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
      expiry_days: data.expiry_days,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to mock data for this session
    mockVoucherTemplates.push(newTemplate);
    
    return Promise.resolve(newTemplate);
  } catch (error) {
    console.error('Error creating voucher template:', error);
    throw error;
  }
};

// Update a voucher template
export const updateVoucherTemplate = async (id: string, data: VoucherTemplateUpdate): Promise<VoucherTemplate> => {
  try {
    // For production, use:
    // const response = await api.patch(`/business/voucher-templates/${id}`, data);
    // return response.data;
    
    // For development, update mock data
    const templateIndex = mockVoucherTemplates.findIndex(t => t.id === id);
    if (templateIndex === -1) {
      throw new Error('Voucher template not found');
    }
    
    const updatedTemplate = {
      ...mockVoucherTemplates[templateIndex],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    mockVoucherTemplates[templateIndex] = updatedTemplate;
    
    return Promise.resolve(updatedTemplate);
  } catch (error) {
    console.error(`Error updating voucher template with ID ${id}:`, error);
    throw error;
  }
};

// Delete a voucher template
export const deleteVoucherTemplate = async (id: string): Promise<void> => {
  try {
    // For production, use:
    // await api.delete(`/business/voucher-templates/${id}`);
    
    // For development, remove from mock data
    const templateIndex = mockVoucherTemplates.findIndex(t => t.id === id);
    if (templateIndex === -1) {
      throw new Error('Voucher template not found');
    }
    
    mockVoucherTemplates.splice(templateIndex, 1);
    
    return Promise.resolve();
  } catch (error) {
    console.error(`Error deleting voucher template with ID ${id}:`, error);
    throw error;
  }
}; 
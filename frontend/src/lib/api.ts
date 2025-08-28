import axios from 'axios';

const API_BASE = '/api';

export interface Site {
  id: string;
  name: string;
  slug: string;
  cover_image_path?: string;
  created_at: string;
}

export interface ContentSchema {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FieldDefinition[];
  max_instances?: number;
}

export interface FieldDefinition {
  name: string;
  field_type: FieldType;
  required: boolean;
  description?: string;
}

export interface FieldType {
  type: 'Text' | 'RichText' | 'Image' | 'Link' | 'Number' | 'Date' | 'Boolean' | 'ContentReference';
  config?: any;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  site: Site;
}

export const api = {
  async getSites(): Promise<Site[]> {
    const response = await axios.get(`${API_BASE}/sites`);
    return response.data.sites;
  },

  async getSite(slug: string): Promise<Site> {
    const response = await axios.get(`${API_BASE}/sites/${slug}`);
    return response.data;
  },

  async authenticate(slug: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE}/sites/${slug}/auth`, {
      password,
    });
    return response.data;
  },

  async getSchemas(slug: string): Promise<ContentSchema[]> {
    const response = await axios.get(`${API_BASE}/sites/${slug}/schemas`);
    return response.data.schemas;
  },
};
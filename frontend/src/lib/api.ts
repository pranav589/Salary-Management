import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SystemConfig {
  countries: { code: string; name: string; currency: string }[];
  departments: string[];
}

export async function getSystemConfig(): Promise<SystemConfig> {
  const { data } = await api.get('/configs');
  return data.data;
}

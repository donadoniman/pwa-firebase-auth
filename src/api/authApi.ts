import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';

export const loginUser = async (email: string, password: string): Promise<AxiosResponse> => {
  return apiClient.post('/auth/login', { email, password });
};
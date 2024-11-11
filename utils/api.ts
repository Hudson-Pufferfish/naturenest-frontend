import axios from "axios";
import { getAuthToken } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getCurrentUser = async () => {
  const response = await api.get<ApiResponse<User>>("/users/me");
  return response.data.data;
};

export default api;

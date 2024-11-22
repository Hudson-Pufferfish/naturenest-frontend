import axiosInstance from "./axiosInstance";
import { SignInCredentials, RegisterCredentials, AuthResponse } from "@/types/auth";

export const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/sign-in", credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/register", credentials);
  return response.data;
};

export const setAuthToken = (token: string) => {
  document.cookie = `jwt=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
};

export const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

  return cookies["jwt"] || null;
};

export const removeAuthToken = () => {
  document.cookie = "jwt=; path=/; max-age=0; SameSite=Lax";
};

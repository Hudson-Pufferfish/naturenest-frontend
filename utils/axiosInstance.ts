import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4400/api",
});

// Add a request interceptor to include JWT token
axiosInstance.interceptors.request.use((config) => {
  // Get JWT token from cookies
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

  const token = cookies["jwt"];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;

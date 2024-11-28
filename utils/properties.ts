import { Property, PropertyWithDetails } from "@/types/property";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface FetchPropertiesParams {
  categoryName?: string;
  propertyName?: string;
  skip?: number;
  take?: number;
}

interface ApiError {
  statusCode: number;
  message: string | { constraints: Record<string, string> }[];
  error: string;
}

// Fetch properties with filters
const fetchProperties = async (params: FetchPropertiesParams = {}): Promise<Property[]> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.categoryName) queryParams.append("categoryName", params.categoryName);
    if (params.propertyName) queryParams.append("propertyName", params.propertyName);
    if (params.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params.take !== undefined) queryParams.append("take", params.take.toString());

    const queryString = queryParams.toString();
    const url = `/properties${queryString ? `?${queryString}` : ""}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiError;

      if (Array.isArray(apiError.message)) {
        const errorMessages = apiError.message
          .map((item) => {
            if (item.constraints) {
              return Object.values(item.constraints);
            }
            return [];
          })
          .flat()
          .join(". ");
        throw new Error(errorMessages || "Validation failed");
      } else {
        throw new Error(typeof apiError.message === "string" ? apiError.message : apiError.error || "An error occurred");
      }
    }

    throw new Error("Failed to fetch properties. Please check your connection.");
  }
};

// Fetch user's properties with details
const fetchMyProperties = async (params: { skip?: number; take?: number } = {}): Promise<PropertyWithDetails[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params.take !== undefined) queryParams.append("take", params.take.toString());

    const queryString = queryParams.toString();
    const url = `/properties/my${queryString ? `?${queryString}` : ""}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiError;

      if (Array.isArray(apiError.message)) {
        // Handle validation errors (array of constraints)
        const errorMessages = apiError.message
          .map((item) => {
            if (item.constraints) {
              return Object.values(item.constraints);
            }
            return [];
          })
          .flat()
          .join(". ");
        throw new Error(errorMessages || "Validation failed");
      } else {
        // Handle single error message
        throw new Error(typeof apiError.message === "string" ? apiError.message : apiError.error || "An error occurred");
      }
    }

    // Handle network or unexpected errors
    throw new Error("Failed to fetch properties. Please check your connection.");
  }
};

// Hook to fetch properties with filters
export const useAllProperties = (params: FetchPropertiesParams = {}) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("Validation failed")) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};

// Hook to fetch user's properties
export const useMyProperties = (params: { skip?: number; take?: number } = {}) => {
  return useQuery({
    queryKey: ["myProperties", params],
    queryFn: () => fetchMyProperties(params),
    retry: (failureCount, error) => {
      // Don't retry on validation errors
      if (error instanceof Error && (error.message.includes("Validation failed") || error.message.includes("Unauthorized"))) {
        return false;
      }
      return failureCount < 2; // retry twice at most
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};

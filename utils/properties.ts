import { Property, PropertyWithDetails } from "@/types/property";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface CreatePropertyRequest {
  name: string;
  tagLine: string;
  description: string;
  price: number;
  categoryId: string;
  coverUrl: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  countryCode: string;
  amenityIds?: string[];
}

// Add these types to types/property.ts
export interface Amenity {
  id: string;
  name: string;
  description?: string;
}

// Add this interface
interface PropertyStats {
  totalProperties: number;
  totalNightsBookedFromAllProperties: number;
  totalIncomeFromAllProperties: number;
}

// Add this interface with other interfaces
export interface UpdatePropertyRequest {
  name: string;
  tagLine: string;
  description: string;
  price: number;
  categoryId: string;
  coverUrl: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  countryCode: string;
  amenityIds: string[];
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
    const url = `/v1/properties${queryString ? `?${queryString}` : ""}`;

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
    const url = `/v1/properties/my${queryString ? `?${queryString}` : ""}`;

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

// Add create property mutation hook
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePropertyRequest) => {
      const response = await axiosInstance.post("/v1/properties", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myProperties"] });
    },
  });
};

// Add delete property mutation hook
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await axiosInstance.delete(`/v1/properties/${propertyId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myProperties"] });
    },
  });
};

// Add this function to fetch a single property with details
const fetchPropertyById = async (propertyId: string): Promise<PropertyWithDetails> => {
  try {
    const response = await axiosInstance.get(`/v1/properties/${propertyId}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiError;
      throw new Error(typeof apiError.message === "string" ? apiError.message : apiError.error || "An error occurred");
    }
    throw new Error("Failed to fetch property details");
  }
};

// Add this hook
export const usePropertyById = (propertyId: string) => {
  return useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => fetchPropertyById(propertyId),
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("not found")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Add this hook
export const useMyAllPropertyStats = () => {
  return useQuery<PropertyStats>({
    queryKey: ["propertyStats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/properties/my/stats");
      return response.data.data;
    },
  });
};

// Add this hook
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, data }: { propertyId: string; data: Partial<UpdatePropertyRequest> }) => {
      try {
        const response = await axiosInstance.patch(`/v1/properties/${propertyId}`, data);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const apiError = error.response.data as ApiError;
          console.error("API Error Details:", apiError);
          throw new Error(typeof apiError.message === "string" ? apiError.message : apiError.error || "An error occurred");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myProperties"] });
    },
  });
};

import { Amenity } from "@/types/amenity";
import axiosInstance from "./axiosInstance";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

interface ApiError {
  statusCode: number;
  message: string | { constraints: Record<string, string> }[];
  error: string;
}

// Fetch amenities from the API
const fetchAmenities = async (): Promise<Amenity[]> => {
  try {
    const response = await axiosInstance.get("/v1/amenities");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiError;
      throw new Error(typeof apiError.message === "string" ? apiError.message : "Failed to fetch amenities");
    }
    throw new Error("Failed to fetch amenities. Please check your connection.");
  }
};

interface AmenitiesStore {
  amenities: Amenity[];
  setAmenities: (amenities: Amenity[]) => void;
}

export const useAmenitiesStore = create<AmenitiesStore>()(
  persist(
    (set) => ({
      amenities: [],
      setAmenities: (amenities) => set({ amenities }),
    }),
    {
      name: "amenities-storage",
    }
  )
);

export const useAmenities = () => {
  const { amenities, setAmenities } = useAmenitiesStore();

  const options: UseQueryOptions<Amenity[], Error, Amenity[], QueryKey> = {
    queryKey: ["amenities"] as const,
    queryFn: fetchAmenities,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    initialData: amenities.length > 0 ? amenities : undefined,
  };

  const query = useQuery(options);

  // Use useEffect to handle data updates
  useEffect(() => {
    if (query.data && JSON.stringify(query.data) !== JSON.stringify(amenities)) {
      setAmenities(query.data);
    }
  }, [query.data, amenities, setAmenities]);

  return query;
};

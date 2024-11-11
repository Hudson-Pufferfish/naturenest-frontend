import { Property } from "@/types/property";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// interface Property {
//   id: string;
//   name: string;
//   coverUrl: string;
//   country: string;
//   price: number;
//   // Add other property fields as needed
// }

// Fetch all properties
const fetchAllProperties = async (): Promise<Property[]> => {
  const response = await axiosInstance.get("/properties");
  return response.data;
};

// Search properties by name
const searchPropertiesByName = async (name: string): Promise<Property[]> => {
  const response = await axiosInstance.get(`/properties/search?name=${name}`);
  return response.data;
};

// Hook to fetch all properties
export const useFetchAllProperties = () => {
  return useQuery({
    queryKey: ["allProperties"],
    queryFn: fetchAllProperties,
  });
};

// Hook to search properties by name
export const useSearchPropertiesByName = (name: string) => {
  return useQuery({
    queryKey: ["searchProperties", name],
    queryFn: () => searchPropertiesByName(name),
    enabled: !!name,
  });
};

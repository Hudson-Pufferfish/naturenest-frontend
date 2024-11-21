import { Property } from "@/types/property";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface FetchPropertiesParams {
  categoryName?: string;
  propertyName?: string;
  skip?: number;
  take?: number;
}

// Fetch properties with filters
const fetchProperties = async (params: FetchPropertiesParams = {}): Promise<Property[]> => {
  const queryParams = new URLSearchParams();

  if (params.categoryName) queryParams.append("categoryName", params.categoryName);
  if (params.propertyName) queryParams.append("propertyName", params.propertyName);
  if (params.skip !== undefined) queryParams.append("skip", params.skip.toString());
  if (params.take !== undefined) queryParams.append("take", params.take.toString());

  const queryString = queryParams.toString();
  const url = `/properties${queryString ? `?${queryString}` : ""}`;

  const response = await axiosInstance.get(url);
  return response.data.data;
};

// Hook to fetch properties with filters
export const useProperties = (params: FetchPropertiesParams = {}) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

interface ApiError {
  statusCode: number;
  message: string | { constraints: Record<string, string> }[];
  error: string;
}

export interface CreateReservationRequest {
  propertyId: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
}

export interface UpdateReservationRequest {
  startDate?: string;
  endDate?: string;
  numberOfGuests?: number;
}

export interface ReservationWithDetails {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  numberOfGuests: number;
  property: {
    name: string;
    price: number;
    coverUrl: string;
    creator: {
      id: string;
      username: string;
      email: string;
    };
  };
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// Fetch my reservations with pagination and status filter
const fetchMyReservations = async (
  params: {
    skip?: number;
    take?: number;
    status?: "upcoming" | "past" | "all";
  } = {}
): Promise<ReservationWithDetails[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params.take !== undefined) queryParams.append("take", params.take.toString());
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = `/v1/reservations/my${queryString ? `?${queryString}` : ""}`;

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
    throw new Error("Failed to fetch reservations. Please check your connection.");
  }
};

// Hook to fetch user's reservations
export const useMyReservations = (
  params: {
    skip?: number;
    take?: number;
    status?: "upcoming" | "past" | "all";
  } = {}
) => {
  return useQuery({
    queryKey: ["myReservations", params],
    queryFn: () => fetchMyReservations(params),
    retry: (failureCount, error) => {
      if (error instanceof Error && (error.message.includes("Validation failed") || error.message.includes("Unauthorized"))) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};

// Create reservation mutation hook
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationRequest) => {
      const response = await axiosInstance.post("/v1/reservations", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
    },
  });
};

// Update reservation mutation hook
export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, data }: { reservationId: string; data: UpdateReservationRequest }) => {
      const response = await axiosInstance.patch(`/v1/reservations/${reservationId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
    },
  });
};

// Delete/Cancel reservation mutation hook
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await axiosInstance.delete(`/v1/reservations/${reservationId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
    },
  });
};

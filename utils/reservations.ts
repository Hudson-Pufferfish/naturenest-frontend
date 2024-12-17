import { Reservation } from "@/types/reservation";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ApiError {
  statusCode: number;
  message: string | { constraints: Record<string, string> }[];
  error: string;
}

// Fetch user's bookings/reservations
const fetchMyBookings = async (): Promise<Reservation[]> => {
  try {
    const response = await axiosInstance.get("/v1/reservations/my");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiError;

      // If it's a 404, return empty array
      if (error.response.status === 404) {
        return [];
      }

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
    throw new Error("Failed to fetch bookings. Please check your connection.");
  }
};

// Hook to fetch user's bookings
export const useMyBookings = () => {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchMyBookings,
    retry: (failureCount, error) => {
      if (error instanceof Error && (error.message.includes("Validation failed") || error.message.includes("Unauthorized"))) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};

// Hook to delete a booking
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await axiosInstance.delete(`/v1/reservations/${bookingId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
};

// Fetch reservations made on my properties
const fetchOtherReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await axiosInstance.get("/v1/reservations");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiError;
      console.log("API Error response:", apiError);

      // If it's a 404, return empty array
      if (error.response.status === 404) {
        return [];
      }

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

// Hook to fetch reservations on my properties
export const useOtherReservations = () => {
  return useQuery({
    queryKey: ["otherReservations"],
    queryFn: fetchOtherReservations,
    retry: (failureCount, error) => {
      if (error instanceof Error && (error.message.includes("Validation failed") || error.message.includes("Unauthorized"))) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};

// Hook to delete any reservation (as property owner)
export const useDeleteOthersReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await axiosInstance.delete(`/v1/reservations/${reservationId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["otherReservations"] });
    },
  });
};

// Add this interface at the top with other interfaces
interface UpdateBookingRequest {
  startDate?: string;
  endDate?: string;
  numberOfGuests?: number;
}

// Add this hook
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, data }: { bookingId: string; data: UpdateBookingRequest }) => {
      const response = await axiosInstance.patch(`/v1/reservations/${bookingId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
};

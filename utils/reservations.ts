import { Reservation } from "@/types/reservation";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO, startOfDay } from "date-fns";

interface ApiError {
  statusCode: number;
  message: string | { constraints: Record<string, string> }[];
  error: string;
}

export interface CreateBookingRequest {
  propertyId: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
}

export interface UpdateBookingRequest {
  startDate?: string;
  endDate?: string;
  numberOfGuests?: number;
}

// Fetch current user's bookings with pagination and status filter
const fetchMyBookings = async (
  params: {
    skip?: number;
    take?: number;
    status?: "upcoming" | "past" | "all";
  } = {}
): Promise<Reservation[]> => {
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

// Hook to fetch current user's bookings with pagination and filtering
export const useMyBookings = ({
  skip = 0,
  take = 10,
  status = "all",
}: {
  skip?: number;
  take?: number;
  status?: "upcoming" | "past" | "all";
} = {}) => {
  return useQuery({
    queryKey: ["myBookings", { skip, take, status }],
    queryFn: () => fetchMyBookings({ skip, take, status }),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && (error.message.includes("Validation failed") || error.message.includes("Unauthorized"))) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Create booking mutation hook
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createBooking"],
    mutationFn: async (data: CreateBookingRequest) => {
      // Ensure dates are in YYYY-MM-DD format
      const formattedData = {
        ...data,
        startDate: format(startOfDay(parseISO(data.startDate)), "yyyy-MM-dd"),
        endDate: format(startOfDay(parseISO(data.endDate)), "yyyy-MM-dd"),
      };
      const response = await axiosInstance.post("/v1/reservations", formattedData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
};

// Update booking mutation hook
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBooking"],
    mutationFn: async ({ bookingId, data }: { bookingId: string; data: UpdateBookingRequest }) => {
      // Ensure dates are in YYYY-MM-DD format if they exist
      const formattedData = {
        ...data,
        startDate: data.startDate ? format(startOfDay(parseISO(data.startDate)), "yyyy-MM-dd") : undefined,
        endDate: data.endDate ? format(startOfDay(parseISO(data.endDate)), "yyyy-MM-dd") : undefined,
      };
      const response = await axiosInstance.patch(`/v1/reservations/${bookingId}`, formattedData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
};

// Delete/Cancel booking mutation hook
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: async (bookingId: string) => {
      const response = await axiosInstance.delete(`/v1/reservations/${bookingId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
};

// Fetch reservations made on current user's properties
const fetchPropertyReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await axiosInstance.get("/v1/reservations");
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
    throw new Error("Failed to fetch reservations. Please check your connection.");
  }
};

// Hook to fetch reservations on current user's properties
export const usePropertyReservations = () => {
  return useQuery({
    queryKey: ["propertyReservations"],
    queryFn: fetchPropertyReservations,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && (error.message.includes("Validation failed") || error.message.includes("Unauthorized"))) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

import { Reservation } from "@/types/reservation";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateReservationRequest {
  propertyId: string;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
  numberOfGuests: number;
}

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationRequest) => {
      const response = await axiosInstance.post("/v1/reservations", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};

export const useReservations = (propertyId?: string) => {
  return useQuery({
    queryKey: ["reservations", propertyId],
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/reservations", {
        params: { propertyId },
      });
      return response.data.data;
    },
  });
};

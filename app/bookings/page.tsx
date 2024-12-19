"use client";

import { useMyBookings, useCancelBooking } from "@/utils/reservations";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import FormContainer from "@/components/form/FormContainer";
import { IconButton } from "@/components/form/Buttons";
import LoadingTable from "@/components/ui/loading-table";
import EmptyList from "@/components/home/EmptyList";
import { useQueryClient } from "@tanstack/react-query";

function DeleteBooking({ bookingId, isPast }: { bookingId: string; isPast: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cancelBooking = useCancelBooking();

  const handleDelete = async (prevState: { message: string }, formData: FormData) => {
    try {
      if (isPast) {
        toast({
          variant: "destructive",
          title: "Cannot Cancel Past Booking",
          description: "You can only cancel upcoming bookings.",
        });
        return { message: "Cannot cancel past booking" };
      }

      await cancelBooking.mutateAsync(bookingId);
      await queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      toast({ description: "Booking cancelled successfully" });
      return { message: "Booking cancelled successfully" };
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
      });
      return { message: error instanceof Error ? error.message : "Failed to cancel booking" };
    }
  };

  return (
    <FormContainer action={handleDelete}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}

export default function BookingsPage() {
  const [status, setStatus] = useState<"upcoming" | "past" | "all">("all");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: bookings = [], isLoading } = useMyBookings({
    skip: page * pageSize,
    take: pageSize,
    status,
  });

  if (isLoading) {
    return (
      <div className="mt-16">
        <LoadingTable />
      </div>
    );
  }

  if (!bookings?.length) {
    return <EmptyList heading="No bookings to display." message="Browse properties to make a booking." />;
  }

  const isBookingPast = (startDate: string) => {
    const bookingStartDate = startOfDay(parseISO(startDate));
    const today = startOfDay(new Date());
    return isBefore(bookingStartDate, today);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setStatus("all")}
            className={`px-4 py-2 rounded-md transition-colors ${
              status === "all"
                ? "bg-orange-500 text-white dark:bg-orange-600"
                : "bg-gray-100 text-gray-700 hover:bg-orange-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-orange-900/30"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("upcoming")}
            className={`px-4 py-2 rounded-md transition-colors ${
              status === "upcoming"
                ? "bg-orange-500 text-white dark:bg-orange-600"
                : "bg-gray-100 text-gray-700 hover:bg-orange-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-orange-900/30"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setStatus("past")}
            className={`px-4 py-2 rounded-md transition-colors ${
              status === "past"
                ? "bg-orange-500 text-white dark:bg-orange-600"
                : "bg-gray-100 text-gray-700 hover:bg-orange-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-orange-900/30"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => {
          const isPast = isBookingPast(booking.startDate);
          return (
            <div key={booking.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{booking.property.name}</h2>
                <p className="text-gray-600">
                  {format(parseISO(booking.startDate), "MMM d, yyyy")} - {format(parseISO(booking.endDate), "MMM d, yyyy")}
                </p>
                <p className="text-gray-600">
                  {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? "s" : ""}
                </p>
                <p className="text-gray-600">Total: ${booking.totalPrice}</p>
              </div>
              <div className="flex gap-2">
                {!isPast && (
                  <>
                    <Link href={`/bookings/${booking.id}/edit`}>
                      <IconButton actionType="edit" />
                    </Link>
                    <DeleteBooking bookingId={booking.id} isPast={isPast} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {bookings.length === pageSize && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { useMyBookings, useUpdateBooking } from "@/utils/reservations";
import { useToast } from "@/components/ui/use-toast";
import { format, startOfToday, isBefore, parseISO, startOfDay } from "date-fns";
import { SubmitButton } from "@/components/form/Buttons";

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();

  // Get all bookings and find the one we want to edit
  const { data: bookings = [], isLoading } = useMyBookings({
    skip: 0,
    take: 100, // Get more bookings to ensure we find the one we want
    status: "all",
  });

  const booking = bookings.find((b) => b.id === params.id);
  const updateBooking = useUpdateBooking();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  // Check if booking can be edited (start date is today or later)
  const startDate = startOfDay(parseISO(booking.startDate));
  const today = startOfToday();
  if (isBefore(startDate, today)) {
    return (
      <div>
        <h1>Cannot edit this booking</h1>
        <p>You can only edit upcoming bookings.</p>
      </div>
    );
  }

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      // Get the date strings and ensure they're in YYYY-MM-DD format without time component
      const startDateStr = formData.get("startDate") as string;
      const endDateStr = formData.get("endDate") as string;
      const numberOfGuests = parseInt(formData.get("numberOfGuests") as string);

      // Format dates to ensure they're in YYYY-MM-DD format
      const startDate = format(startOfDay(parseISO(startDateStr)), "yyyy-MM-dd");
      const endDate = format(startOfDay(parseISO(endDateStr)), "yyyy-MM-dd");

      await updateBooking.mutateAsync({
        bookingId: params.id,
        data: {
          startDate,
          endDate,
          numberOfGuests,
        },
      });

      router.push("/bookings");
      return { message: "Booking updated successfully!" };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Failed to update booking",
      };
    }
  };

  // Format dates for display, ensuring we use the date part only without timezone influence
  const formattedStartDate = format(startOfDay(parseISO(booking.startDate)), "yyyy-MM-dd");
  const formattedEndDate = format(startOfDay(parseISO(booking.endDate)), "yyyy-MM-dd");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Booking</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{booking.property.name}</h2>
        <p className="text-gray-600">Price per night: ${booking.property.price}</p>
      </div>
      <FormContainer action={handleFormAction}>
        <div className="grid md:grid-cols-2 gap-8 mb-4">
          <FormInput name="startDate" type="date" label="Check In Date" defaultValue={formattedStartDate} />
          <FormInput name="endDate" type="date" label="Check Out Date" defaultValue={formattedEndDate} />
        </div>
        <div className="md:w-1/2">
          <FormInput name="numberOfGuests" type="number" label="Number of Guests" required min={1} defaultValue={booking.numberOfGuests} />
        </div>
        <SubmitButton text="Save Changes" className="mt-8" />
      </FormContainer>
    </div>
  );
}

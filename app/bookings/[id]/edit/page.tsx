"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/form/FormInput";
import FormContainer from "@/components/form/FormContainer";
import { SubmitButton } from "@/components/form/Buttons";
import { useBookingById, useUpdateBooking } from "@/utils/reservations";
import LoadingTable from "@/components/ui/loading-table";
import EmptyList from "@/components/home/EmptyList";
import CounterInput from "@/components/form/CounterInput";
import { startOfToday, isBefore, format } from "date-fns";

function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: booking, error, isLoading } = useBookingById(params.id);
  const updateBooking = useUpdateBooking();

  if (isLoading) {
    return (
      <div className="mt-16">
        <LoadingTable />
      </div>
    );
  }

  if (error) {
    return <EmptyList heading="Failed to load booking." message="Please try again later." />;
  }

  if (!booking) {
    return <EmptyList heading="Booking not found." message="The booking you're looking for doesn't exist." />;
  }

  // Check if booking can be edited (start date is today or later)
  const startDate = new Date(booking.startDate);
  const today = startOfToday();
  if (isBefore(startDate, today)) {
    return <EmptyList heading="Cannot edit this booking." message="You can only edit upcoming bookings." />;
  }

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      const data = {
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        numberOfGuests: Number(formData.get("guests")),
      };

      await updateBooking.mutateAsync({ bookingId: params.id, data });
      toast({ description: "Booking updated successfully!" });
      router.push("/bookings");
      return { message: "Success" };
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to update booking",
      });
      return { message: error instanceof Error ? error.message : "Failed to update booking" };
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Edit Booking</h1>
      <div className="border p-8 rounded">
        <h3 className="text-lg mb-4 font-medium">Booking Details</h3>
        <FormContainer action={handleFormAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="startDate" type="date" label="Check In Date" defaultValue={format(new Date(booking.startDate), "yyyy-MM-dd")} />
            <FormInput name="endDate" type="date" label="Check Out Date" defaultValue={format(new Date(booking.endDate), "yyyy-MM-dd")} />
          </div>
          <CounterInput detail="guests" defaultValue={booking.numberOfGuests} />
          <SubmitButton text="update booking" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}

export default EditBookingPage;

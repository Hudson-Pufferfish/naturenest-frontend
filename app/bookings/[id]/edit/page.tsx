"use client";

import { useMyBookings, useUpdateBooking } from "@/utils/reservations";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO, startOfDay, isBefore, isValid } from "date-fns";
import { SubmitButton } from "@/components/form/Buttons";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(today);

  const {
    data: bookings = [],
    isLoading,
    error,
  } = useMyBookings({
    skip: 0,
    take: 100,
    status: "all",
  });

  const booking = bookings.find((b) => b.id === params.id);
  const updateBooking = useUpdateBooking();

  useEffect(() => {
    if (booking) {
      const initialStartDate = format(startOfDay(parseISO(booking.startDate)), "yyyy-MM-dd");
      setStartDate(initialStartDate);
    }
  }, [booking]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load booking",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6" data-testid="loading-skeleton">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-24 md:w-1/2" />
      </div>
    );
  }

  if (!booking) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Booking not found",
    });
    router.push("/bookings");
    return null;
  }

  const validateDates = (startDateStr: string, endDateStr: string) => {
    const todayDate = startOfDay(new Date());
    const startDateObj = startOfDay(parseISO(startDateStr));
    const endDateObj = startOfDay(parseISO(endDateStr));

    if (!isValid(startDateObj) || !isValid(endDateObj)) {
      toast({
        variant: "destructive",
        title: "Invalid Date Format",
        description: "Please enter valid dates",
      });
      return false;
    }

    if (isBefore(startDateObj, todayDate)) {
      toast({
        variant: "destructive",
        title: "Invalid Check-in Date",
        description: "Check-in date must be today or later",
      });
      return false;
    }

    if (isBefore(endDateObj, startDateObj) || endDateObj.getTime() === startDateObj.getTime()) {
      toast({
        variant: "destructive",
        title: "Invalid Check-out Date",
        description: "Check-out date must be at least one day after check-in date",
      });
      return false;
    }

    return true;
  };

  const minEndDate = startDate || today;
  const initialStartDate = format(startOfDay(parseISO(booking.startDate)), "yyyy-MM-dd");

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      const startDateStr = formData.get("startDate") as string;
      const endDateStr = formData.get("endDate") as string;
      const numberOfGuests = parseInt(formData.get("numberOfGuests") as string);

      if (!validateDates(startDateStr, endDateStr)) {
        return { message: "Date validation failed" };
      }

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

      toast({
        title: "Success",
        description: "Booking updated successfully!",
      });
      router.push("/bookings");
      return { message: "Booking updated successfully!" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update booking";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return { message: errorMessage };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Booking</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{booking.property.name}</h2>
        <p className="text-gray-600">Price per night: ${booking.property.price}</p>
        <p className="text-gray-600">Maximum guests: {booking.property.guests}</p>
      </div>
      <FormContainer action={handleFormAction}>
        <div className="grid md:grid-cols-2 gap-8 mb-4">
          <FormInput
            name="startDate"
            type="date"
            label="Check In Date"
            required
            min={today}
            defaultValue={initialStartDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <FormInput
            name="endDate"
            type="date"
            label="Check Out Date"
            required
            min={minEndDate}
            defaultValue={format(startOfDay(parseISO(booking.endDate)), "yyyy-MM-dd")}
          />
        </div>
        <div className="md:w-1/2">
          <FormInput
            name="numberOfGuests"
            type="number"
            label="Number of Guests"
            required
            min={1}
            max={booking.property.guests}
            defaultValue={booking.numberOfGuests.toString()}
          />
        </div>
        <SubmitButton text="Update Booking" className="mt-8" />
      </FormContainer>
    </div>
  );
}

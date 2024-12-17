"use client";

import { useCreateBooking } from "@/utils/reservations";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyById } from "@/utils/properties";
import { format, parseISO, startOfDay, isBefore, isValid } from "date-fns";
import { SubmitButton } from "@/components/form/Buttons";
import { useState } from "react";

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const { toast } = useToast();
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(today);

  const { data: property } = usePropertyById(propertyId || "");
  const createBooking = useCreateBooking();

  if (!propertyId) {
    return <div>Property ID is required</div>;
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

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      const startDateStr = formData.get("startDate") as string;
      const endDateStr = formData.get("endDate") as string;
      const numberOfGuests = parseInt(formData.get("numberOfGuests") as string);

      if (!validateDates(startDateStr, endDateStr)) {
        return { message: "Date validation failed" };
      }

      // Format dates to ensure they're in YYYY-MM-DD format
      const startDate = format(startOfDay(parseISO(startDateStr)), "yyyy-MM-dd");
      const endDate = format(startOfDay(parseISO(endDateStr)), "yyyy-MM-dd");

      await createBooking.mutateAsync({
        propertyId,
        startDate,
        endDate,
        numberOfGuests,
      });

      toast({
        title: "Success",
        description: "Booking created successfully!",
      });
      router.push("/bookings");
      return { message: "Booking created successfully!" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create booking";
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
      <h1 className="text-2xl font-bold mb-6">Create Booking</h1>
      {property && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{property.name}</h2>
          <p className="text-gray-600">Price per night: ${property.price}</p>
          <p className="text-gray-600">Maximum guests: {property.guests}</p>
        </div>
      )}
      <FormContainer action={handleFormAction}>
        <div className="grid md:grid-cols-2 gap-8 mb-4">
          <FormInput
            name="startDate"
            type="date"
            label="Check In Date"
            required
            min={today}
            defaultValue={today}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <FormInput name="endDate" type="date" label="Check Out Date" required min={startDate} defaultValue={startDate} />
        </div>
        <div className="md:w-1/2">
          <FormInput name="numberOfGuests" type="number" label="Number of Guests" required min={1} max={property?.guests || 1} />
        </div>
        <SubmitButton text="Create Booking" className="mt-8" />
      </FormContainer>
    </div>
  );
}

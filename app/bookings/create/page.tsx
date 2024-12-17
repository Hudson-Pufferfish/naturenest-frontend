"use client";

import { useCreateBooking } from "@/utils/reservations";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyById } from "@/utils/properties";
import { format, parseISO, startOfDay } from "date-fns";
import { SubmitButton } from "@/components/form/Buttons";

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const { toast } = useToast();

  const { data: property } = usePropertyById(propertyId || "");
  const createBooking = useCreateBooking();

  if (!propertyId) {
    return <div>Property ID is required</div>;
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

      await createBooking.mutateAsync({
        propertyId,
        startDate,
        endDate,
        numberOfGuests,
      });

      router.push("/bookings");
      return { message: "Booking created successfully!" };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Failed to create booking",
      };
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
          <FormInput name="startDate" type="date" label="Check In Date" required min={format(startOfDay(new Date()), "yyyy-MM-dd")} />
          <FormInput name="endDate" type="date" label="Check Out Date" required min={format(startOfDay(new Date()), "yyyy-MM-dd")} />
        </div>
        <div className="md:w-1/2">
          <FormInput name="numberOfGuests" type="number" label="Number of Guests" required min={1} max={property?.guests || 1} />
        </div>
        <SubmitButton text="Create Booking" className="mt-8" />
      </FormContainer>
    </div>
  );
}

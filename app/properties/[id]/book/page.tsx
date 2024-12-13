"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCreateReservation } from "@/utils/reservations";
import { useProperty } from "@/utils/properties";
import FormContainer from "@/components/form/FormContainer";
import { SubmitButton } from "@/components/form/Buttons";
import { useState } from "react";
import CounterInput from "@/components/form/CounterInput";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import DateInput from "@/components/form/DateInput";

function BookPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const createReservation = useCreateReservation();
  const { data: property, isLoading } = useProperty(params.id);
  const [startDate, setStartDate] = useState<string>("");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!property) {
    router.push("/");
    return null;
  }

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      const start = formData.get("startDate") as string;
      const end = formData.get("endDate") as string;

      if (!start || !end) {
        throw new Error("Please select both start and end dates");
      }

      // Validate end date is after start date
      if (new Date(end) <= new Date(start)) {
        throw new Error("End date must be after start date");
      }

      const data = {
        propertyId: params.id,
        startDate: start,
        endDate: end,
        numberOfGuests: Number(formData.get("guests")),
      };

      await createReservation.mutateAsync(data);
      toast({ description: "Reservation created successfully!" });
      router.push("/reservations");
      return { message: "Success" };
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to create reservation",
      });
      return { message: error instanceof Error ? error.message : "Failed to create reservation" };
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8">Book {property.name}</h1>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="border p-8 rounded space-y-8">
            <FormContainer action={handleFormAction}>
              <div className="space-y-8">
                <div className="grid gap-4">
                  <DateInput label="Check-in Date" name="startDate" min={today} onChange={setStartDate} />
                  <DateInput label="Check-out Date" name="endDate" min={startDate || today} />
                </div>
                <CounterInput detail="guests" max={property.guests} />
                <SubmitButton text="confirm booking" className="w-full" />
              </div>
            </FormContainer>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-x-1">
              <span className="text-xl font-semibold">{formatCurrency(property.price)}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Maximum {property.guests} guests</p>
              <p>
                {property.bedrooms} bedrooms · {property.beds} beds · {property.baths} baths
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookPropertyPage;

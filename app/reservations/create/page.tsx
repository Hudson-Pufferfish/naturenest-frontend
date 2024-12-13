"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCreateReservation } from "@/utils/reservations";
import FormContainer from "@/components/form/FormContainer";
import { SubmitButton } from "@/components/form/Buttons";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import CounterInput from "@/components/form/CounterInput";

function CreateReservationPage({ params }: { params: { propertyId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const createReservation = useCreateReservation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      if (!dateRange?.from || !dateRange?.to) {
        throw new Error("Please select dates for your reservation");
      }

      const data = {
        propertyId: params.propertyId,
        startDate: dateRange.from.toISOString().split("T")[0],
        endDate: dateRange.to.toISOString().split("T")[0],
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

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">create reservation</h1>
      <div className="border p-8 rounded">
        <FormContainer action={handleFormAction}>
          <div className="space-y-8">
            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} className="rounded-md border" />
            <CounterInput detail="guests" />
            <SubmitButton text="create reservation" className="w-full" />
          </div>
        </FormContainer>
      </div>
    </section>
  );
}

export default CreateReservationPage;

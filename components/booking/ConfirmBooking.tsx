"use client";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/utils/store";
import FormContainer from "@/components/form/FormContainer";
import { SubmitButton } from "@/components/form/Buttons";

function ConfirmBooking() {
  const { propertyId, range } = useProperty((state) => state);
  const checkIn = range?.from as Date;
  const checkOut = range?.to as Date;
  // if not sign in
  if (!userId)
    return (
      <Button type="button" className="w-full">
        Sign In to Complete Booking
      </Button>
    );

  const createBooking = createBookingAction.bind(null, {
    propertyId,
    checkIn,
    checkOut,
  });
  return (
    <section>
      <FormContainer action={createBooking}>
        <SubmitButton text="Reserve" className="w-full" />
      </FormContainer>
    </section>
  );
}
export default ConfirmBooking;

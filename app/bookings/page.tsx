"use client";

import Link from "next/link";
import EmptyList from "@/components/home/EmptyList";
import CountryFlagAndName from "@/components/card/CountryFlagAndName";
import { formatDate, formatCurrency } from "@/utils/format";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FormContainer from "@/components/form/FormContainer";
import { IconButton } from "@/components/form/Buttons";
import LoadingTable from "@/components/ui/loading-table";
import { useMyBookings, useDeleteBooking } from "@/utils/reservations";
import { useToast } from "@/components/ui/use-toast";
import { differenceInDays, isBefore, startOfToday } from "date-fns";

function BookingsPage() {
  const { data: bookings, error, isLoading } = useMyBookings();

  if (isLoading) {
    return (
      <div className="mt-16">
        <LoadingTable />
      </div>
    );
  }

  if (error) {
    return <EmptyList heading="Failed to load bookings." message="Please try again later." />;
  }

  if (!bookings || bookings.length === 0) {
    return <EmptyList heading="No bookings to display." message="Browse properties to make a booking." />;
  }

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">total bookings : {bookings.length}</h4>
      <Table>
        <TableCaption>A list of your recent bookings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const { id, totalPrice, startDate, endDate } = booking;
            const { id: propertyId, name, countryCode } = booking.property;

            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            const today = startOfToday();

            const numberOfNights = differenceInDays(endDateObj, startDateObj);
            const canCancel = !isBefore(startDateObj, today); // Can only cancel if start date is today or later

            const formattedStartDate = formatDate(startDateObj);
            const formattedEndDate = formatDate(endDateObj);

            return (
              <TableRow key={id}>
                <TableCell>
                  <Link href={`/properties/${propertyId}`} className="underline text-muted-foreground tracking-wide">
                    {name}
                  </Link>
                </TableCell>
                <TableCell>
                  <CountryFlagAndName countryCode={countryCode} />
                </TableCell>
                <TableCell>{numberOfNights}</TableCell>
                <TableCell>{formatCurrency(totalPrice)}</TableCell>
                <TableCell>{formattedStartDate}</TableCell>
                <TableCell>{formattedEndDate}</TableCell>
                <TableCell>{canCancel && <DeleteBooking bookingId={id} />}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DeleteBooking({ bookingId }: { bookingId: string }) {
  const { toast } = useToast();
  const deleteBooking = useDeleteBooking();

  const handleDelete = async (prevState: { message: string }, formData: FormData) => {
    try {
      await deleteBooking.mutateAsync(bookingId);
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

export default BookingsPage;

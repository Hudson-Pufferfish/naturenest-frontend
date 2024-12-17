"use client";

import Link from "next/link";
import EmptyList from "@/components/home/EmptyList";
import CountryFlagAndName from "@/components/card/CountryFlagAndName";
import { formatDate, formatCurrency } from "@/utils/format";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Stats from "@/components/reservations/Stats";
import { useOtherReservations } from "@/utils/reservations";
import LoadingTable from "@/components/ui/loading-table";
import { Reservation } from "@/types/reservation";
import { differenceInDays } from "date-fns";

function ReservationsPage() {
  const { data: reservations, error, isLoading } = useOtherReservations();

  if (isLoading) {
    return (
      <div className="mt-16">
        <LoadingTable />
      </div>
    );
  }

  if (error) {
    return <EmptyList heading="Failed to load reservations." message="Please try again later." />;
  }

  if (!reservations || reservations.length === 0) {
    return <EmptyList heading="No reservations to display." message="No one has booked your properties yet." />;
  }

  return (
    <>
      <Stats />
      <div className="mt-16">
        <h4 className="mb-4 capitalize">total reservations : {reservations.length}</h4>
        <Table>
          <TableCaption>A list of recent reservations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((item: Reservation) => {
              const { id, totalPrice, startDate, endDate } = item;
              const { id: propertyId, name, countryCode } = item.property;

              const startDateObj = new Date(startDate);
              const endDateObj = new Date(endDate);

              const numberOfNights = differenceInDays(endDateObj, startDateObj);

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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ReservationsPage;

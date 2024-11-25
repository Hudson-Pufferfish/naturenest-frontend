"use client";

import EmptyList from "@/components/home/EmptyList";
// import { deleteRentalAction } from "@/utils/actions";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FormContainer from "@/components/form/FormContainer";
import { IconButton } from "@/components/form/Buttons";
import { useMyProperties } from "@/utils/properties";
import { PropertyWithDetails } from "@/types/property";
import LoadingTable from "@/components/reservation/LoadingTable";

function RentalsPage() {
  const { data: rentals, error, isLoading } = useMyProperties();

  if (isLoading) {
    return (
      <div className="mt-16">
        <LoadingTable />
      </div>
    );
  }

  if (error) {
    return <EmptyList heading="Failed to load properties." message="Please try again later." />;
  }

  if (!rentals || rentals.length === 0) {
    return <EmptyList heading="No rentals to display." message="Don't hesitate to create a rental." />;
  }

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Active Properties : {rentals.length}</h4>
      <Table>
        <TableCaption>A list of all your properties.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Nightly Rate </TableHead>
            <TableHead>Nights Booked</TableHead>
            <TableHead>Total Income</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental: PropertyWithDetails) => {
            const { id: propertyId, name, price } = rental;
            const { totalNightsBooked, totalIncome } = rental;
            return (
              <TableRow key={propertyId}>
                <TableCell>
                  <Link href={`/properties/${propertyId}`} className="underline text-muted-foreground tracking-wide">
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>
                <TableCell>{totalNightsBooked || 0}</TableCell>
                <TableCell>{formatCurrency(totalIncome)}</TableCell>

                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/rentals/${propertyId}/edit`}>
                    <IconButton actionType="edit"></IconButton>
                  </Link>
                  <DeleteRental propertyId={propertyId} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DeleteRental({ propertyId }: { propertyId: string }) {
  // TODO(@hudsonn): Implement delete action for rentals
  const deleteRental = async () => {
    return { message: "Delete operation placeholder" };
  };
  return (
    <FormContainer action={deleteRental}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}

export default RentalsPage;

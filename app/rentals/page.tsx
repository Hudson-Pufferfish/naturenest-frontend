"use client";

import EmptyList from "@/components/home/EmptyList";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FormContainer from "@/components/form/FormContainer";
import { IconButton } from "@/components/form/Buttons";
import { useMyProperties, useDeleteProperty } from "@/utils/properties";
import { PropertyWithDetails } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import LoadingTable from "@/components/ui/loading-table";

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
  const { toast } = useToast();
  const deleteProperty = useDeleteProperty();

  const handleDelete = async (prevState: { message: string }, formData: FormData) => {
    try {
      await deleteProperty.mutateAsync(propertyId);
      toast({ description: "Property deleted successfully" });
      return { message: "Property deleted successfully" };
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete property",
      });
      return { message: error instanceof Error ? error.message : "Failed to delete property" };
    }
  };

  return (
    <FormContainer action={handleDelete}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}

export default RentalsPage;

"use client";
import EmptyList from "@/components/home/EmptyList";
import { useReservations } from "@/utils/reservations";
import LoadingTable from "@/components/reservation/LoadingTable";

function ReservationsPage() {
  const { data: reservations, error, isLoading } = useReservations();

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

  // Temporary placeholder for work in progress
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-semibold mb-4">🏗️ Under Construction</h2>
      <p className="text-muted-foreground">
        We&apos;re working hard to bring you a beautiful reservation management interface.
        <br />
        Check back soon!
      </p>
      {/* TODO: Implement reservation list/table */}
    </div>
  );
}

export default ReservationsPage;

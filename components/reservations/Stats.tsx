"use client";

import StatsCard from "@/components/admin/StatsCard";
import { useMyAllPropertyStats } from "@/utils/properties";
import { formatCurrency } from "@/utils/format";
import LoadingTable from "@/components/ui/loading-table";

function Stats() {
  const { data: stats, isLoading } = useMyAllPropertyStats();

  if (isLoading) {
    return <LoadingTable />;
  }

  if (!stats) return null;

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="properties" value={stats.totalProperties} />
      <StatsCard title="nights" value={stats.totalNightsBookedFromAllProperties} />
      <StatsCard title="amount" value={formatCurrency(stats.totalIncomeFromAllProperties)} />
    </div>
  );
}
export default Stats;

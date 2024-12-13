"use client";
import { useState } from "react";
import { useAmenities } from "@/utils/amenities";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

function AmenitiesInput({ defaultValue }: { defaultValue?: string[] }) {
  const { data: amenities, isLoading } = useAmenities();
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultValue || []);

  const handleChange = (checked: boolean, amenityId: string) => {
    setSelectedIds((prev) => {
      if (checked) {
        return [...prev, amenityId];
      }
      return prev.filter((id) => id !== amenityId);
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (!amenities) return null;

  return (
    <section>
      <input type="hidden" name="amenityIds" value={JSON.stringify(selectedIds)} />
      <div className="grid grid-cols-2 gap-4">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center space-x-2">
            <Checkbox
              id={amenity.id}
              checked={selectedIds.includes(amenity.id)}
              onCheckedChange={(checked) => handleChange(checked as boolean, amenity.id)}
            />
            <label htmlFor={amenity.id} className="text-sm font-medium leading-none capitalize flex gap-x-2 items-center">
              {amenity.name}
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AmenitiesInput;

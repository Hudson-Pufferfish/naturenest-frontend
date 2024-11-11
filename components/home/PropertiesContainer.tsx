"use client";

import PropertiesList from "./PropertiesList";
import EmptyList from "./EmptyList";
import { useFetchAllProperties } from "@/hooks/useProperties";

function PropertiesContainer({ category, search }: { category?: string; search?: string }) {
  const { data: properties } = useFetchAllProperties();

  if (!properties || properties.length === 0) {
    return <EmptyList heading="No results." message="Try changing or removing some of your filters." btnText="Clear Filters" />;
  }

  // Transform the properties to match PropertyCardProps
  const propertyCards = properties.map((property) => ({
    id: property.id,
    image: property.coverUrl || "",
    tagline: property.name,
    country: property.country || "",
    price: property.price || 0,
    name: property.name || "",
  }));

  return <PropertiesList properties={propertyCards} />;
}

export default PropertiesContainer;

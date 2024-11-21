"use client";

import PropertiesList from "./PropertiesList";
import EmptyList from "./EmptyList";
import { useProperties } from "@/utils/properties";

function PropertiesContainer({ category, search }: { category?: string; search?: string }) {
  const { data: properties } = useProperties({
    categoryName: category,
    propertyName: search,
    take: 20,
  });

  // TODO(@hudsonn): Add infinite scroll

  if (!properties || properties.length === 0) {
    return <EmptyList heading="No results." message="Try changing or removing some of your filters." btnText="Clear Filters" />;
  }

  return <PropertiesList properties={properties} />;
}

export default PropertiesContainer;

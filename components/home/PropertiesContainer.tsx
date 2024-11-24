"use client";

import PropertiesList from "./PropertiesList";
import EmptyList from "./EmptyList";
import { useProperties } from "@/utils/properties";
import LoadingCards from "../card/LoadingCards";

function PropertiesContainer({ category, search }: { category?: string; search?: string }) {
  const { data: properties, isLoading } = useProperties({
    categoryName: category,
    propertyName: search,
    take: 20,
  });

  // Show loading skeleton while fetching data
  if (isLoading) {
    return <LoadingCards />;
  }

  // Show empty list only when we have confirmed there are no properties
  if (!properties || properties.length === 0) {
    return <EmptyList heading="No results." message="Try changing or removing some of your filters." btnText="Clear Filters" />;
  }
  // TODO(@hudsonn): add infinite scroll
  return <PropertiesList properties={properties} />;
}

export default PropertiesContainer;

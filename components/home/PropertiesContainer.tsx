"use client";

import PropertiesList from "./PropertiesList";
import EmptyList from "./EmptyList";
import { useAllProperties } from "@/utils/properties";
import LoadingCards from "../card/LoadingCards";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";

function PropertiesContainer({ category, search }: { category?: string; search?: string }) {
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(search);

  const debouncedSetSearch = useDebouncedCallback((newSearch: string | undefined) => {
    setDebouncedSearch(newSearch?.trim() || undefined);
  }, 150);

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search]);

  const { data: properties, isLoading } = useAllProperties({
    categoryName: category,
    propertyName: debouncedSearch,
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

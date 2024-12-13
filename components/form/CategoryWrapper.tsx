"use client";
import { useCategories } from "@/utils/categories";
import CategoriesInput from "./CategoriesInput";

export default function CategoryWrapper({ defaultValue }: { defaultValue?: string }) {
  const categoriesQuery = useCategories();
  return <CategoriesInput {...categoriesQuery} defaultValue={defaultValue} />;
}

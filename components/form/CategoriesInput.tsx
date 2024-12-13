"use client";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/utils/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const name = "category";

function CategoriesInput({ defaultValue }: { defaultValue?: string }) {
  const { data: categories, isLoading, getIcon } = useCategories();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!categories?.length) return null;

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Categories
      </Label>
      <Select defaultValue={defaultValue || categories[0].id} name={name} required>
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => {
            const Icon = getIcon(category.name);
            return (
              <SelectItem key={category.id} value={category.id}>
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {category.name.replace(/_/g, " ")}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CategoriesInput;

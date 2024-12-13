"use client";
import { useCategories } from "@/utils/categories";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Category } from "@/types/category";

function CategoriesList({ category, search }: { category?: string; search?: string }) {
  const { data: categories, isLoading, getIcon } = useCategories();
  const searchTerm = search ? `&search=${search}` : "";

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!categories) return null;

  return (
    <section>
      <ScrollArea className="py-6">
        <div className="flex gap-x-4">
          {categories.map((item: Category) => {
            const isActive = item.name === category;
            const Icon = getIcon(item.name);
            return (
              <Link key={item.id} href={`/?category=${item.name}${searchTerm}`}>
                <article
                  className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[100px] ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  <Icon className="w-8 h-8" />
                  <p className="capitalize text-sm mt-1">{item.name.replace(/_/g, " ")}</p>
                </article>
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default CategoriesList;

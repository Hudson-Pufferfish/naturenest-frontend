"use client";
import BreadCrumbs from "@/components/properties/BreadCrumbs";
import ImageContainer from "@/components/properties/ImageContainer";
import PropertyDetails from "@/components/properties/PropertyDetails";
import { Separator } from "@/components/ui/separator";
import { redirect, useRouter } from "next/navigation";
import Description from "@/components/properties/Description";
import Amenities from "@/components/properties/Amenities";
import { usePropertyById } from "@/utils/properties";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: property, isLoading, error } = usePropertyById(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] md:h-[500px] w-full" />
        <div className="grid lg:grid-cols-12 gap-x-12">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    redirect("/");
  }

  const { baths, bedrooms, beds, guests } = property;
  const details = { baths, bedrooms, beds, guests };

  return (
    <section className="container mx-auto px-4 py-8">
      <BreadCrumbs name={property.name} />
      <header className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-bold capitalize">{property.tagLine}</h1>
      </header>
      <ImageContainer mainImage={property.coverUrl} name={property.name} />
      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
        <div className="lg:col-span-8">
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{property.name}</h1>
          </div>
          <PropertyDetails details={details} />
          <Separator className="mt-4" />
          <Description description={property.description} />
          <Amenities amenities={JSON.stringify(property.amenities || [])} />
        </div>
        <div className="lg:col-span-4">
          <div className="sticky top-4 bg-card rounded-lg border p-6 space-y-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl font-bold">{formatCurrency(property.price)}</p>
              <p className="text-sm text-muted-foreground">/night</p>
            </div>
            <Button className="w-full text-lg font-semibold py-6" size="lg" onClick={() => router.push(`/bookings/create?propertyId=${property.id}`)}>
              Book Now
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}

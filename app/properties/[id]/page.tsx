"use client";
import BreadCrumbs from "@/components/properties/BreadCrumbs";
import ImageContainer from "@/components/properties/ImageContainer";
import PropertyDetails from "@/components/properties/PropertyDetails";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import Description from "@/components/properties/Description";
import Amenities from "@/components/properties/Amenities";
import { useProperty } from "@/utils/properties";
import { Skeleton } from "@/components/ui/skeleton";
import { LuDollarSign } from "react-icons/lu";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// TODO: Implement these components later
// import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
// import PropertyRating from "@/components/card/PropertyRating";
// import ShareButton from "@/components/properties/ShareButton";
// import UserInfo from "@/components/properties/UserInfo";
// import SubmitReview from "@/components/reviews/SubmitReview";
// import PropertyReviews from "@/components/reviews/PropertyReviews";

function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const { data: property, isLoading, error } = useProperty(params.id);

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
    <section>
      <BreadCrumbs name={property.name} />
      <header className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-bold capitalize">{property.tagLine}</h1>
        <div className="flex items-center gap-x-4">
          {/* TODO: Implement share and favorite buttons */}
          {/* <ShareButton name={property.name} propertyId={property.id} /> */}
          {/* <FavoriteToggleButton propertyId={property.id} /> */}
        </div>
      </header>
      <ImageContainer mainImage={property.coverUrl} name={property.name} />
      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
        <div className="lg:col-span-8">
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{property.name}</h1>
            {/* TODO: Implement rating component */}
            {/* <PropertyRating inPage propertyId={property.id} /> */}
          </div>
          <PropertyDetails details={details} />
          {/* TODO: Implement user info component */}
          {/* <UserInfo profile={property.creator} /> */}
          <Separator className="mt-4" />
          <Description description={property.description} />
          {/* TODO: Update amenities component to handle the new data structure */}
          <Amenities amenities={JSON.stringify(property.amenities || [])} />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-x-1">
              <span className="text-xl font-semibold">{formatCurrency(property.price)}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            <Link href={`/properties/${property.id}/book`}>
              <Button className="w-full">Book Now</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* TODO: Implement reviews section */}
      {/* <PropertyReviews propertyId={property.id} /> */}
    </section>
  );
}

export default PropertyDetailsPage;

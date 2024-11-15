import Image from "next/image";
import Link from "next/link";
// import CountryFlagAndName from './CountryFlagAndName';
// import PropertyRating from './PropertyRating';
// import FavoriteToggleButton from './FavoriteToggleButton';
import { PropertyCardProps } from "@/types/property";
import { formatCurrency } from "@/utils/format";

function PropertyCard({ property }: { property: PropertyCardProps }) {
  const { name, coverUrl: image, price } = property;
  const { country, id: propertyId, tagLine } = property;
  return (
    <article className="group relative">
      <Link href={`/properties/${propertyId}`}>
        <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
          {/* TODO (@hudsonn) fix image loader */}
          <Image
            src={image ? (image.includes("unsplash.com/photos/") ? `https://images.unsplash.com/photo-${image.split("-").pop()}` : image) : ""}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            alt={name}
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold mt-1">{name ? name.substring(0, 30) : "N/A Property Name"}</h3>
          {/* TODO (@hudsonn) property rating */}
          {/* <PropertyRating inPage={false} propertyId={propertyId} /> */}
        </div>
        <p className="text-sm mt-1 text-muted-foreground">{tagLine ? tagLine.substring(0, 40) : "N/A Property Description"}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm mt-1">
            <span className="font-semibold">{price ? formatCurrency(price) : formatCurrency(0)}</span>
            night
          </p>
          {/* TODO (@hudsonn) country and flag */}
          {/* TODO (@hudsonn) handle undefined country */}
          {/* <CountryFlagAndName countryCode={country} /> */}
        </div>
      </Link>
      <div className="absolute top-5 right-5 z-5">
        {/* TODO (@hudsonn) favorite toggle button */}
        {/* <FavoriteToggleButton propertyId={propertyId} /> */}
      </div>
    </article>
  );
}
export default PropertyCard;

import { LuFolderCheck } from "react-icons/lu";
import Title from "./Title";

interface Amenity {
  name: string;
  id?: string;
}

function Amenities({ amenities }: { amenities: string }) {
  const amenitiesList = JSON.parse(amenities as string) as Amenity[];
  if (!amenitiesList || amenitiesList.length === 0) return null;

  return (
    <div className="mt-4">
      <Title text="What this place offers" />
      <div className="grid md:grid-cols-2 gap-x-4">
        {amenitiesList.map((amenity) => {
          return (
            <div key={amenity.name} className="flex items-center gap-x-4 mb-2">
              <LuFolderCheck className="h-6 w-6 text-primary" />
              <span className="font-light text-sm capitalize">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Amenities;

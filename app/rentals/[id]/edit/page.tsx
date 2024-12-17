"use client";

import { redirect } from "next/navigation";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import CategoriesInput from "@/components/form/CategoriesInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CountriesInput from "@/components/form/CountriesInput";
import CounterInput from "@/components/form/CounterInput";
import AmenitiesInput from "@/components/form/AmenitiesInput";
import { SubmitButton } from "@/components/form/Buttons";
import { usePropertyById, useUpdateProperty, UpdatePropertyRequest } from "@/utils/properties";
import { Amenity } from "@/types/amenity";
import LoadingTable from "@/components/ui/loading-table";
import EmptyList from "@/components/home/EmptyList";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

function EditRentalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: property, error, isLoading } = usePropertyById(params.id);
  const updateProperty = useUpdateProperty();

  if (isLoading) {
    return <LoadingTable />;
  }

  if (error || !property) {
    return <EmptyList heading="Property not found" message="The property you're looking for doesn't exist." />;
  }

  const defaultAmenities = property.amenities || [];

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      // Create update data object
      const updateData: Partial<UpdatePropertyRequest> = {};

      // Get all form values first
      const formValues = {
        name: formData.get("name") as string,
        tagLine: formData.get("tagLine") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        categoryId: formData.get("categoryId") as string,
        coverUrl: formData.get("coverUrl") as string,
        guests: Number(formData.get("guests")),
        bedrooms: Number(formData.get("bedrooms")),
        beds: Number(formData.get("beds")),
        baths: Number(formData.get("baths")),
        countryCode: formData.get("countryCode") as string,
        amenityIds: JSON.parse((formData.get("amenityIds") as string) || "[]"),
      };

      console.log("Form values:", formValues);
      console.log("Current property:", property);

      // Compare and add only changed values
      if (formValues.name !== property.name) updateData.name = formValues.name;
      if (formValues.tagLine !== property.tagLine) updateData.tagLine = formValues.tagLine;
      if (formValues.description !== property.description) updateData.description = formValues.description;
      if (formValues.price !== property.price) updateData.price = formValues.price;
      if (formValues.categoryId !== property.categoryId) updateData.categoryId = formValues.categoryId;
      if (formValues.coverUrl !== property.coverUrl) updateData.coverUrl = formValues.coverUrl;
      if (formValues.guests !== property.guests) updateData.guests = formValues.guests;
      if (formValues.bedrooms !== property.bedrooms) updateData.bedrooms = formValues.bedrooms;
      if (formValues.beds !== property.beds) updateData.beds = formValues.beds;
      if (formValues.baths !== property.baths) updateData.baths = formValues.baths;
      if (formValues.countryCode !== property.countryCode) updateData.countryCode = formValues.countryCode;

      // Handle amenities separately
      const currentAmenityIds = (property.amenities || []).map((a) => a.id).sort();
      const newAmenityIds = [...formValues.amenityIds].sort();
      if (JSON.stringify(currentAmenityIds) !== JSON.stringify(newAmenityIds)) {
        updateData.amenityIds = formValues.amenityIds;
      }

      // Basic validation
      if (Object.keys(updateData).length === 0) {
        throw new Error("No changes detected");
      }

      console.log("Final update data:", updateData);

      // Send the update
      await updateProperty.mutateAsync({
        propertyId: params.id,
        data: updateData,
      });

      toast({ description: "Property updated successfully!" });
      router.push("/rentals");
      return { message: "Success" };
    } catch (error) {
      console.error("Update error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update property";
      toast({
        variant: "destructive",
        description: errorMessage,
      });
      return { message: errorMessage };
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Edit Property</h1>
      <div className="border p-8 rounded">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <FormContainer action={handleFormAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="name" type="text" label="Name (20 limit)" defaultValue={property.name} />
            <FormInput name="tagLine" type="text" label="Tagline (30 limit)" defaultValue={property.tagLine} />
            <PriceInput defaultValue={property.price} />
            <CategoriesInput defaultValue={property.categoryId} />
          </div>
          <TextAreaInput name="description" labelText="Description (10 - 1000 words)" defaultValue={property.description} />
          <div className="grid sm:grid-cols-2 gap-8 mt-4">
            <CountriesInput defaultValue={property.countryCode} />
            <FormInput
              name="coverUrl"
              type="url"
              label="Cover Image URL"
              placeholder="https://example.com/image.jpg"
              defaultValue={property.coverUrl}
            />
          </div>
          <h3 className="text-lg mt-8 mb-4 font-medium">Accommodation Details</h3>
          <CounterInput detail="guests" defaultValue={property.guests} />
          <CounterInput detail="bedrooms" defaultValue={property.bedrooms} />
          <CounterInput detail="beds" defaultValue={property.beds} />
          <CounterInput detail="baths" defaultValue={property.baths} />
          <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
          <AmenitiesInput defaultValue={defaultAmenities.map((amenity) => amenity.id)} />
          <SubmitButton text="update rental" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

export default EditRentalPage;

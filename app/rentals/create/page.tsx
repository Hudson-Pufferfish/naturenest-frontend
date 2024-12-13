"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCreateProperty } from "@/utils/properties";
import FormInput from "@/components/form/FormInput";
import FormContainer from "@/components/form/FormContainer";
import { SubmitButton } from "@/components/form/Buttons";
import PriceInput from "@/components/form/PriceInput";
import CategoryWrapper from "@/components/form/CategoryWrapper";
import TextAreaInput from "@/components/form/TextAreaInput";
import CountriesInput from "@/components/form/CountriesInput";
import CounterInput from "@/components/form/CounterInput";
import AmenitiesInput from "@/components/form/AmenitiesInput";

function CreatePropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createProperty = useCreateProperty();

  const handleFormAction = async (prevState: { message: string }, formData: FormData) => {
    try {
      const data = {
        name: formData.get("name") as string,
        tagLine: formData.get("tagline") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        categoryId: formData.get("category") as string,
        coverUrl: formData.get("coverUrl") as string,
        guests: Number(formData.get("guests")),
        bedrooms: Number(formData.get("bedrooms")),
        beds: Number(formData.get("beds")),
        baths: Number(formData.get("baths")),
        countryCode: formData.get("country") as string,
        amenityIds: JSON.parse((formData.get("amenityIds") as string) || "[]"),
      };

      await createProperty.mutateAsync(data);
      toast({ description: "Property created successfully!" });
      router.push("/properties/my");
      return { message: "Success" };
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to create property",
      });
      return { message: error instanceof Error ? error.message : "Failed to create property" };
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">create property</h1>
      <div className="border p-8 rounded">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <FormContainer action={handleFormAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="name" type="text" label="Name (20 limit)" defaultValue="Cabin in Latvia" />
            <FormInput name="tagline" type="text" label="Tagline (30 limit)" defaultValue="Dream Getaway Awaits You Here" />
            {/* price */}
            <PriceInput />
            {/* categories */}
            <CategoryWrapper />
          </div>
          {/* text area / description */}
          <TextAreaInput name="description" labelText="Description (10 - 1000 words)" />
          <div className="grid sm:grid-cols-2 gap-8 mt-4">
            <CountriesInput />
            <FormInput
              name="coverUrl"
              type="url"
              label="Cover Image URL"
              placeholder="https://example.com/image.jpg"
              defaultValue="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8"
            />
          </div>
          <h3 className="text-lg mt-8 mb-4 font-medium">Accommodation Details</h3>
          <CounterInput detail="guests" />
          <CounterInput detail="bedrooms" />
          <CounterInput detail="beds" />
          <CounterInput detail="baths" />
          <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
          <AmenitiesInput />
          <SubmitButton text="create rental" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

export default CreatePropertyPage;

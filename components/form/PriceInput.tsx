import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";

type PriceInputProps = {
  defaultValue?: number;
  name?: string;
};

function PriceInput({ name, defaultValue }: PriceInputProps) {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Price ($)
      </Label>
      <Input id={name} type="number" name={name} min={0} defaultValue={defaultValue || 100} required />
    </div>
  );
}
export default PriceInput;

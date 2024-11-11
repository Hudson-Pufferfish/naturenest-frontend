import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
};

function FormInput(props: FormInputProps) {
  const { label, name, type, defaultValue, placeholder, required } = props;
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        {label || name}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required} />
    </div>
  );
}
export default FormInput;

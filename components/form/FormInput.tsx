import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

interface FormInputProps {
  name: string;
  type: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  min?: string;
}

function FormInput({ name, type, label, defaultValue, placeholder, min }: FormInputProps) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
      />
    </div>
  );
}

export default FormInput;

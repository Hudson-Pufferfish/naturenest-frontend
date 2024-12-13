"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateInputProps {
  label: string;
  name: string;
  defaultValue?: string;
  min?: string;
  onChange?: (date: string) => void;
}

function DateInput({ label, name, defaultValue, min, onChange }: DateInputProps) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={name} className="text-muted-foreground">
        {label}
      </Label>
      <Input type="date" id={name} name={name} defaultValue={defaultValue} min={min} onChange={(e) => onChange?.(e.target.value)} />
    </div>
  );
}

export default DateInput;

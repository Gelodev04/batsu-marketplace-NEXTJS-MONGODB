// components/select/campus-select.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { campuses, type CampusId } from "@/lib/campus";

type Props = {
  value: CampusId | "";
  onChange: (value: CampusId) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  withLabel?: boolean;
};

export default function CampusSelect({
  value,
  onChange,
  placeholder = "Select campus",
  disabled,
  className,
  withLabel = true,
}: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as CampusId)}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {withLabel && <SelectLabel>Campuses</SelectLabel>}
          {campuses.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

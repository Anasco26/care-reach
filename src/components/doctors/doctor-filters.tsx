import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Specialization } from "@/types";

export function DoctorFilters({
  search,
  onSearchChange,
  specialization,
  onSpecializationChange,
  specializations,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  specialization: string;
  onSpecializationChange: (value: string) => void;
  specializations: Specialization[];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search doctors by name..."
          className="pl-9"
          aria-label="Search doctors"
        />
      </div>
      <Select value={specialization} onValueChange={onSpecializationChange}>
        <SelectTrigger className="sm:w-64" aria-label="Filter by specialization">
          <SelectValue placeholder="All specializations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All specializations</SelectItem>
          {specializations.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

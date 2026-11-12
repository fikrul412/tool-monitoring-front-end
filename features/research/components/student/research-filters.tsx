
"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { ResearchStatus } from "../../types/research.types";

interface Props {
  search: string;
  status: ResearchStatus | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ResearchStatus | "ALL") => void;
}

export function ResearchFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search research..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <select
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value as ResearchStatus | "ALL")
        }
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="ALL">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  );
}

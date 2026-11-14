
import { Badge } from "@/components/ui/badge";
import type { ResearchStatus } from "../types/research.types";

interface Props {
  status: ResearchStatus;
}

const statusConfig: Record<
  ResearchStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  ONGOING: { label: "Ongoing", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  COMPLETION_REQUESTED: { label: "Completion requested", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  ARCHIVED: { label: "Archived", className: "bg-slate-100 text-slate-800 hover:bg-slate-100" },
  CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
};

export function ResearchStatusBadge({ status }: Props) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}

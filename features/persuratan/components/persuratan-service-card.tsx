import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PersuratanService } from "../types/persuratan.types";

interface PersuratanServiceCardProps {
  service: PersuratanService;
}

export function PersuratanServiceCard({
  service,
}: PersuratanServiceCardProps) {
  const Icon = service.icon;

  return (
    <Link
      href={service.href}
      className={cn(
        "group flex min-h-[86px] items-center gap-3 rounded-xl border",
        "border-border bg-background p-3.5 transition-all",
        "hover:border-primary/40 hover:bg-accent/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground">
          {service.title}
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </div>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
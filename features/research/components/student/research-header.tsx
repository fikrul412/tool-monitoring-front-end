
"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ResearchHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          My Research
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your research applications and track their status.
        </p>
      </div>

      <Button
        onClick={() => router.push("/dashboard/research/create")}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Research
      </Button>
    </div>
  );
}

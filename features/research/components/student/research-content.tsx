
"use client";

import { useState } from "react";

import { useMyResearch } from "../../hooks/use-research";
import type {
  ResearchStatus,
} from "../../types/research.types";

import { ResearchHeader } from "./research-header";
import { ResearchSummary } from "./research-summary";
import { ResearchFilters } from "./research-filters";
import { ResearchTable } from "./research-table";

export function ResearchContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ResearchStatus | "ALL">(
    "ALL",
  );

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useMyResearch(page, 10, {
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
  });

  const researches = data?.data ?? [];

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.limit ?? 10)));

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-sm text-destructive">
          Failed to load research applications.
        </p>

        <button
          onClick={() => refetch()}
          className="text-sm font-medium underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResearchHeader />

      <ResearchSummary researches={researches} />

      <ResearchFilters
        search={search}
        status={status}
      onSearchChange={(value) => { setSearch(value); setPage(1); }}
      onStatusChange={(value) => { setStatus(value); setPage(1); }}
      />

      <ResearchTable
        researches={researches}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{data?.total ?? 0} applications · page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={page <= 1 || isFetching} onClick={() => setPage((value) => value - 1)}>Previous</button>
          <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={page >= totalPages || isFetching} onClick={() => setPage((value) => value + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  FlaskConical,
  FileText,
} from "lucide-react";

import { useAllResearch } from "../../hooks/use-research";

import type { ResearchStatus } from "../../types/research.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PAGE_SIZE = 10;

const statusOptions = [
  { label: "All Status", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completion requested", value: "COMPLETION_REQUESTED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusVariant(status: ResearchStatus) {
  switch (status) {
    case "APPROVED":
      return "default";

    case "REJECTED":
      return "destructive";

    case "CANCELLED":
      return "outline";

    case "ONGOING":
      return "default";

    case "COMPLETED":
      return "default";

    default:
      return "secondary";
  }
}

function getStatusLabel(status: ResearchStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function AdminResearchContent() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ResearchStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllResearch({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
    status: status === "ALL" ? undefined : status,
  });

  const researches = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: ResearchStatus | "ALL") {
    setStatus(value);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setPage(1);
  }

  function openResearch(id: string) {
    router.push(`/admin/research/${id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">
            Research Applications
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          Review and manage student research applications.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : total}
            </div>
            <p className="text-xs text-muted-foreground">
              Applications matching current filters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Page
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {page} / {totalPages}
            </div>
            <p className="text-xs text-muted-foreground">
              {researches.length} applications displayed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search title, student name, or NIM..."
                value={search}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                className="pl-9"
              />
            </div>

            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as ResearchStatus | "ALL",
                )
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={!search && status === "ALL"}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Research table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Research Applications</CardTitle>

            {isFetching && !isLoading && (
              <span className="text-xs text-muted-foreground">
                Updating...
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading research applications...
            </div>
          ) : isError ? (
            <div className="space-y-3 py-12 text-center">
              <p className="text-sm text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Failed to load research applications."}
              </p>

              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : researches.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <p className="font-medium">
                No research applications found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="px-4 py-3 font-medium">
                        Research
                      </th>
                      <th className="px-4 py-3 font-medium">
                        Student
                      </th>
                      <th className="px-4 py-3 font-medium">
                        Period
                      </th>
                      <th className="px-4 py-3 font-medium">
                        Submitted
                      </th>
                      <th className="px-4 py-3 font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {researches.map((research) => (
                      <tr
                        key={research.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="max-w-xs px-4 py-4">
                          <p className="truncate font-medium">
                            {research.title}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium">
                            {research.student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {research.student.nim}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                          {formatDate(research.startDate)}
                          {" – "}
                          {formatDate(research.endDate)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                          {formatDate(research.createdAt)}
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            variant={getStatusVariant(research.status)}
                          >
                            {getStatusLabel(research.status)}
                          </Badge>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openResearch(research.id)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {(page - 1) * PAGE_SIZE + researches.length} of {total}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

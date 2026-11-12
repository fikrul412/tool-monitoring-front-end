
"use client";

import { useRouter } from "next/navigation";
import { Eye, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Research } from "../../types/research.types";
import { ResearchStatusBadge } from "../research-status-badge";

interface Props {
  researches: Research[];
  isLoading: boolean;
}

export function ResearchTable({
  researches,
  isLoading,
}: Props) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          My Research Applications
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading research applications...
          </div>
        ) : researches.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground" />

            <p className="font-medium">
              No research applications found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your research applications will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">
                    Research Title
                  </th>
                  <th className="py-3 pr-4 font-medium">
                    Start Date
                  </th>
                  <th className="py-3 pr-4 font-medium">
                    End Date
                  </th>
                  <th className="py-3 pr-4 font-medium">
                    Status
                  </th>
                  <th className="py-3 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {researches.map((research) => (
                  <tr
                    key={research.id}
                    className="border-b last:border-0"
                  >
                    <td className="py-4 pr-4 font-medium">
                      {research.title}
                    </td>

                    <td className="py-4 pr-4 whitespace-nowrap">
                      {research.startDate ?? "-"}
                    </td>

                    <td className="py-4 pr-4 whitespace-nowrap">
                      {research.endDate ?? "-"}
                    </td>

                    <td className="py-4 pr-4">
                      <ResearchStatusBadge
                        status={research.status}
                      />
                    </td>

                    <td className="py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/research/${research.id}`,
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

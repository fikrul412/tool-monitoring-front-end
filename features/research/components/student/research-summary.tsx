
import { Clock, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Research } from "../../types/research.types";

interface Props {
  researches: Research[];
}

export function ResearchSummary({ researches }: Props) {
  const pending = researches.filter(
    (item) => item.status === "PENDING",
  ).length;

  const approved = researches.filter(
    (item) => item.status === "APPROVED",
  ).length;

  const rejected = researches.filter(
    (item) => item.status === "REJECTED",
  ).length;

  const summaries = [
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {summaries.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>

              <Icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {item.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

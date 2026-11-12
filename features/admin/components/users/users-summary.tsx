
import { Users } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface UsersSummaryProps {
  total: number;
}

export function UsersSummary({ total }: UsersSummaryProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
          <Users className="size-5 text-muted-foreground" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Total pengguna
          </p>
          <p className="text-2xl font-semibold tabular-nums">
            {total}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

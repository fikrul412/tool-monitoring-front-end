
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/stores/auth.store";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === "authenticated" && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [status, user, router]);

  if (status !== "authenticated") {
    return null;
  }

  if (user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}

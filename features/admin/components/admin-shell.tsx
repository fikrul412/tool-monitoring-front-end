
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Activity,
  BookOpen,
  Boxes,
  Building2,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  FileText,
  Wrench,
  LogOut,
  Menu,
  Package,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const adminNavigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Pengguna",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Laboratorium",
    href: "/admin/laboratories",
    icon: Building2,
  },
  {
    label: "Peralatan",
    href: "/admin/equipment",
    icon: Boxes,
  },
  {
    label: "Bahan",
    href: "/admin/materials",
    icon: Package,
  },
  {
    label: "Peminjaman & Schedule",
    href: "/admin/loans",
    icon: Wrench,
  },
  {
    label: "Pengelolaan Limbah",
    href: "/admin/waste",
    icon: Trash2,
  },
  {
    label: "Research",
    href: "/admin/research",
    icon: BookOpen,
  },
  {
    label: "Persuratan",
    href: "/admin/persuratan",
    icon: FileText,
  },
  {
    label: "Absensi",
    href: "/admin/attendance",
    icon: Activity,
  },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName =
    user?.profile && "name" in user.profile
      ? user.profile.name
      : user?.email ?? "Administrator";

  const initial = userName.charAt(0).toUpperCase();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearUser();
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>

          <div>
            <p className="font-semibold">Tool Monitor</p>
            <p className="text-xs text-muted-foreground">
              Administration
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Management
          </p>

          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="mt-3 w-full justify-start text-muted-foreground"
            disabled={loggingOut}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>

            <div>
              <h1 className="text-sm font-semibold">
                {adminNavigation.find((item) =>
                  isActive(item.href)
                )?.label ?? "Administration"}
              </h1>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Tool Monitor Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {initial}
            </div>

            <span className="hidden max-w-36 truncate text-sm font-medium sm:block">
              {userName}
            </span>
          </div>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-16 z-40 border-b bg-background p-3 shadow-lg md:hidden">
            <nav className="space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                    <ChevronRight className="ml-auto size-4" />
                  </Link>
                );
              })}

              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                disabled={loggingOut}
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

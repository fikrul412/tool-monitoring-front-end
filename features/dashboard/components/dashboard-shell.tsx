
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    ChevronDown,
    GraduationCap,
    House,
    History,
    LogOut,
    UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";

import {
    primaryNavigation,
    mobileNavigation,
} from "@/features/dashboard/constants/navigation";

interface DashboardShellProps {
    children: React.ReactNode;
}

export default function DashboardShell({
    children,
}: DashboardShellProps) {
    const pathname = usePathname();
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);

    const [loggingOut, setLoggingOut] = useState(false);

    const profile = user?.profile;

    const userName =
        profile && "name" in profile ? profile.name : "User";

    const initial = userName.charAt(0).toUpperCase();

    const isStudent = user?.role === "STUDENT";

    function isActive(href: string) {
        if (href === "/dashboard") {
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
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b px-6">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <GraduationCap className="size-5" />
                    </div>

                    <div>
                        <p className="font-semibold">Tool Monitor</p>
                        <p className="text-xs text-muted-foreground">
                            Laboratory System
                        </p>
                    </div>
                </div>

                {/* Primary Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Menu
                    </p>

                    {primaryNavigation.map((item) => {
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

                {/* Sidebar User Information */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {initial}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {userName}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                {isStudent ? "Mahasiswa" : "Dosen"}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="md:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 md:hidden">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <GraduationCap className="size-4" />
                        </div>

                        <span className="font-semibold">Tool Monitor</span>
                    </div>

                    {/* Desktop Page Title */}
                    <div className="hidden md:block">
                        <h1 className="text-sm font-medium text-muted-foreground">
                            {primaryNavigation.find((item) =>
                                isActive(item.href)
                            )?.label ?? "Dashboard"}
                        </h1>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {/* Notifications */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Notifications"
                            className="relative rounded-full"
                        >
                            <Bell className="size-5" />
                        </Button>

                        {/* Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                aria-label="Open profile menu"
                                className="flex items-center gap-2 rounded-full p-1.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                    {initial}
                                </div>

                                <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-60"
                            >
                                {/* User Information */}
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium">
                                                {userName}
                                            </span>

                                            <span className="truncate text-xs font-normal text-muted-foreground">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>

                                    {/* Profile */}
                                    <DropdownMenuItem
                                        onClick={() => {
                                            router.push("/dashboard/profile");
                                        }}
                                    >
                                        <UserRound className="mr-2 size-4" />
                                        Profile
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                {/* Logout */}
                                <DropdownMenuItem
                                    variant="destructive"
                                    disabled={loggingOut}
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 size-4" />
                                    {loggingOut ? "Logging out..." : "Logout"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)] px-4 py-6 pb-24 sm:px-6 md:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden">
                <div className="mx-auto grid max-w-lg grid-cols-3">
                    {mobileNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
                                    active
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="size-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

import {
    House,
    Building2,
    Boxes,
    FlaskConical,
    BookOpen,
    History,
    UserRound,
    type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const primaryNavigation: NavigationItem[] = [
    {
        label: "Beranda",
        href: "/dashboard",
        icon: House,
    },
    {
        label: "Laboratorium",
        href: "/dashboard/laboratories",
        icon: Building2,
    },
    {
        label: "Research",
        href: "/dashboard/research",
        icon: BookOpen,
    },
    {
        label: "Peralatan",
        href: "/dashboard/equipment",
        icon: Boxes,
    },
    {
        label: "Bahan & Reagen",
        href: "/dashboard/materials",
        icon: FlaskConical,
    },
    {
        label: "Riwayat",
        href: "/dashboard/history",
        icon: History,
    },
    {
        label: "Profil",
        href: "/dashboard/profile",
        icon: UserRound,
    },
];

export const mobileNavigation = primaryNavigation;

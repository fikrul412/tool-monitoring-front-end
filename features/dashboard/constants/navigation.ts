import {
    House,
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

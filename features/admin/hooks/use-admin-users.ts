
"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminUserService } from "../service/admin-user.service";
import { identityService } from "../service/admin-user.service"; 
import type {
    AdminUser,
    CreateManagedUserPayload,
    UserRole,
    UserStatus,
} from "../types/admin-user.types";
import { getApiErrorMessage } from "../utils/user.utils";

const PAGE_SIZE = 10;
export function useLecturers(search: string) {
  return useQuery({
    queryKey: ["lecturers", search],
    queryFn: () => identityService.getLecturers(search),
    enabled: search.trim().length >= 2,
    staleTime: 60_000,
  });
}
export function useAdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState<UserRole | "ALL">("ALL");
    const [status, setStatus] = useState<UserStatus | "ALL">("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setError(null);

        try {
            const result = await adminUserService.getUsers({
                page,
                limit: PAGE_SIZE,
                search: search.trim() || undefined,
                role: role === "ALL" ? undefined : role,
                status: status === "ALL" ? undefined : status,
            });

            setUsers(result.data);
            setTotalUsers(result.pagination.total);
            setTotalPages(Math.max(result.pagination.totalPages, 1));
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [page, search, role, status]);
    useEffect(() => {
        let cancelled = false;

        async function loadUsers() {
            try {
                const result = await adminUserService.getUsers({
                    page,
                    limit: PAGE_SIZE,
                    search: search.trim() || undefined,
                    role: role === "ALL" ? undefined : role,
                    status: status === "ALL" ? undefined : status,
                });

                if (cancelled) return;

                setUsers(result.data);
                setTotalUsers(result.pagination.total);
                setTotalPages(Math.max(result.pagination.totalPages, 1));
                setError(null);
            } catch (err) {
                if (cancelled) return;
                setError(getApiErrorMessage(err));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadUsers();

        return () => {
            cancelled = true;
        };
    }, [page, search, role, status]);
    function updateFilters(callback: () => void) {
        setPage(1);
        callback();
    }

    async function createUser(payload: CreateManagedUserPayload) {
        setCreating(true);
        setActionError(null);
        setSuccessMessage(null);

        try {
            await adminUserService.createUser(payload);

            setSuccessMessage("Pengguna berhasil dibuat.");
            setPage(1);
            setSearch("");
            setRole("ALL");
            setStatus("ALL");

            // Refresh with cleared filters.
            const result = await adminUserService.getUsers({
                page: 1,
                limit: PAGE_SIZE,
            });

            setUsers(result.data);
            setTotalUsers(result.pagination.total);
            setTotalPages(Math.max(result.pagination.totalPages, 1));
        } catch (err) {
            const message = getApiErrorMessage(err);
            setActionError(message);
            throw err;
        } finally {
            setCreating(false);
        }
    }

    async function updateUserStatus(user: AdminUser) {
        const nextStatus =
            user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

        setUpdatingId(user.id);
        setActionError(null);
        setSuccessMessage(null);

        try {
            await adminUserService.updateUserStatus(user.id, nextStatus);

            setSuccessMessage("Status pengguna berhasil diperbarui.");
            await fetchUsers();
        } catch (err) {
            setActionError(getApiErrorMessage(err));
        } finally {
            setUpdatingId(null);
        }
    }

    return {
        users,
        page,
        setPage,
        totalPages,
        totalUsers,

        search,
        setSearch,
        role,
        setRole,
        status,
        setStatus,
        updateFilters,

        loading,
        error,
        actionError,
        successMessage,

        creating,
        updatingId,

        fetchUsers,
        createUser,
        updateUserStatus,
    };
}

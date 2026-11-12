
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useAdminUsers } from "../../hooks/use-admin-users";

import { UsersHeader } from "./users-header";
import { UsersSummary } from "./users-summary";
import { UsersFilters } from "./users-filters";
import { UsersTable } from "./users-table";
import { UsersPagination } from "./users-pagination";
import { CreateUserDialog } from "./create-user-dialog";

export function UsersContent() {
  const [createOpen, setCreateOpen] = useState(false);

  const {
    users,
    page,
    setPage,
    totalPages,
    totalUsers,
    search,
    role,
    status,
    loading,
    error,
    actionError,
    successMessage,
    creating,
    updatingId,
    setSearch,
    setRole,
    setStatus,
    updateFilters,
    fetchUsers,
    createUser,
    updateUserStatus,
  } = useAdminUsers();

  function handleStatusChange(user: (typeof users)[number]) {
    const nextStatus =
      user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    const confirmed = window.confirm(
      `Yakin ingin ${
        nextStatus === "SUSPENDED" ? "menangguhkan" : "mengaktifkan"
      } akun ${user.email ?? user.id}?`,
    );

    if (confirmed) {
      void updateUserStatus(user);
    }
  }

  return (
    <div className="space-y-6">
      <UsersHeader onCreate={() => setCreateOpen(true)} />

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            Coba lagi
          </Button>
        </div>
      )}

      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-border bg-muted p-3 text-sm">
          {successMessage}
        </div>
      )}

      <UsersSummary total={totalUsers} />

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
        <div>
          <h2 className="font-semibold">Daftar pengguna</h2>
          <p className="text-sm text-muted-foreground">
            Cari dan filter akun yang terdaftar di sistem.
          </p>
        </div>

        <UsersFilters
          search={search}
          role={role}
          status={status}
          loading={loading}
          onSearchChange={(value) =>
            updateFilters(() => setSearch(value))
          }
          onRoleChange={(value) =>
            updateFilters(() => setRole(value))
          }
          onStatusChange={(value) =>
            updateFilters(() => setStatus(value))
          }
          onRefresh={fetchUsers}
        />

        <UsersTable
          users={users}
          loading={loading}
          updatingId={updatingId}
          onStatusChange={handleStatusChange}
        />

        <UsersPagination
          page={page}
          totalPages={totalPages}
          totalUsers={totalUsers}
          loading={loading}
          onPageChange={setPage}
        />
      </section>

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={createUser}
        loading={creating}
      />
    </div>
  );
}

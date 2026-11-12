import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { AdminRoute } from "@/features/admin/guards/admin-route";
import { UsersContent } from "@/features/admin/components/users/users-content";

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <AdminRoute>
        <UsersContent />
      </AdminRoute>
    </ProtectedRoute>
  );
}
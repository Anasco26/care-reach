"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute role="ADMIN">
      <DashboardLayout title="Clinic administration">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

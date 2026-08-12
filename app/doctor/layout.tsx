"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute role="DOCTOR">
      <DashboardLayout title="Doctor dashboard">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

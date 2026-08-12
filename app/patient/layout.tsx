"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute role="PATIENT">
      <DashboardLayout title="Patient portal">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

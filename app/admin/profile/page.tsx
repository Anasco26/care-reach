"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordCard } from "@/components/auth/change-password-card";
import { useAuth } from "@/contexts/auth-context";

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl border-border/70">
        <CardHeader>
          <CardTitle className="text-lg">My account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium capitalize">{user?.role.toLowerCase()}</span>
          </div>
        </CardContent>
      </Card>
      <ChangePasswordCard />
    </div>
  );
}

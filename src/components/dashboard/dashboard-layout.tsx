"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  UserCog,
  Users,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { initials } from "@/lib/appointment-utils";
import type { Role } from "@/types";

const adminNav = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Doctors", url: "/admin/doctors", icon: Stethoscope },
  { title: "Patients", url: "/admin/patients", icon: Users },
  { title: "Appointments", url: "/admin/appointments", icon: ClipboardList },
  { title: "My profile", url: "/admin/profile", icon: UserCog },
] as const;

const doctorNav = [
  { title: "Upcoming", url: "/doctor", icon: CalendarClock },
  { title: "History", url: "/doctor/history", icon: History },
  { title: "My profile", url: "/doctor/profile", icon: UserCog },
] as const;

const patientNav = [
  { title: "Overview", url: "/patient", icon: LayoutDashboard },
  { title: "My appointments", url: "/patient/appointments", icon: CalendarCheck },
  { title: "History", url: "/patient/history", icon: History },
  { title: "My profile", url: "/patient/profile", icon: UserCog },
] as const;

function navFor(role: Role) {
  if (role === "ADMIN") return adminNav;
  if (role === "DOCTOR") return doctorNav;
  return patientNav;
}

export function DashboardLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const items = navFor(user?.role ?? "PATIENT");

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logout();
    router.replace("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2 px-2 py-1.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                C
              </span>
              <span className="truncate font-display text-sm font-semibold">
                CareReach Clinic
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                {user?.role === "ADMIN"
                  ? "Administration"
                  : user?.role === "DOCTOR"
                    ? "Practice"
                    : "My care"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Sign out">
                  <LogOut />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger />
            <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-foreground">
                  {user?.name}
                </p>
                <p className="text-xs capitalize text-muted-foreground">
                  {user?.role.toLowerCase()}
                </p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {initials(user?.name ?? "")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="sm:hidden"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

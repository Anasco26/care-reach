"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, dashboardPath } from "@/contexts/auth-context";

const links = [
  { label: "Doctors", to: "/doctors" },
  { label: "Services", hash: "#features" },
  { label: "Why us", hash: "#why-us" },
  { label: "Contact", hash: "#contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            CareReach
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {links.map((l) =>
            "to" in l ? (
              <Link
                key={l.label}
                href={l.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.hash}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:ml-0 md:flex">
          {user ? (
            <Button asChild size="sm">
              <Link href={dashboardPath(user.role)}>Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) =>
              "to" in l ? (
                <Link
                  key={l.label}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.hash}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {l.label}
                </a>
              ),
            )}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button asChild size="sm" className="flex-1">
                  <Link href={dashboardPath(user.role)}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

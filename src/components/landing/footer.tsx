import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartBadge />
            </span>
            <span className="font-display text-base font-bold">CareReach</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A modern clinic appointment portal for patients, doctors and clinic staff.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/doctors" className="hover:text-foreground">
                Find a doctor
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                Patient login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground">
                Create account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Demo accounts</h3>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li>admin@clinic.com</li>
            <li>doctor1@clinic.com</li>
            <li>patient1@clinic.com</li>
            <li className="pt-1 font-medium text-foreground">Password123@</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareReach Clinic. Demo project.
      </div>
    </footer>
  );
}

function HeartBadge() {
  return <HeartPulse className="size-4" />;
}

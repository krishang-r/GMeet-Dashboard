import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import { APP_TITLE } from "@/lib/org";

export function SiteHeader({
  email,
  isAdmin,
  active,
}: {
  email?: string | null;
  isAdmin: boolean;
  active?: "dashboard" | "admin" | "account";
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-fg">
              <LogoIcon />
            </span>
            {APP_TITLE}
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink href="/dashboard" current={active === "dashboard"}>
              My Meets
            </NavLink>
            {isAdmin && (
              <NavLink href="/admin" current={active === "admin"}>
                Admin
              </NavLink>
            )}
            <NavLink href="/account" current={active === "account"}>
              Account
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-sm text-muted sm:inline">{email}</span>
          )}
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        current
          ? "bg-brand/10 text-brand"
          : "text-muted hover:bg-elevated hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function LogoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3.5l4 3.5V7l-4 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
            GMeet Dashboard
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
            <span className="hidden text-sm text-slate-500 sm:inline">
              {email}
            </span>
          )}
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
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </Link>
  );
}

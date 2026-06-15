import Link from "next/link";
import { requireAdmin } from "@/lib/auth-helpers";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  const tabs = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/groups", label: "Groups" },
    { href: "/admin/meets", label: "Meets" },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader email={session.user.email} isAdmin active="admin" />
      <div className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl gap-1 px-4">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="border-b-2 border-transparent px-3 py-3 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

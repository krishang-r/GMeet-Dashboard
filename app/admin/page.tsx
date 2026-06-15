import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverview() {
  const [users, groups, meets, assignments] = await Promise.all([
    prisma.user.count(),
    prisma.group.count(),
    prisma.meet.count(),
    prisma.meetAssignment.count(),
  ]);

  const stats = [
    { label: "Users", value: users, href: "/admin/users" },
    { label: "Groups", value: groups, href: "/admin/groups" },
    { label: "Meets", value: meets, href: "/admin/meets" },
    { label: "Assignments", value: assignments, href: "/admin/meets" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Overview</h1>
      <p className="mb-6 text-sm text-slate-500">
        Manage who can access which meetings.
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
          >
            <div className="text-3xl font-semibold text-slate-900">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-semibold text-slate-900">Quick start</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Create users under the Users tab (or let them sign in with Google).</li>
          <li>Group users together under Groups for easier assignment.</li>
          <li>Add a meeting link under Meets and assign it to users or groups.</li>
          <li>Assigned people see the meeting on their dashboard instantly.</li>
        </ol>
      </div>
    </div>
  );
}

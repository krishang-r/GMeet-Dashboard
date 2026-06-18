import { prisma } from "@/lib/prisma";
import { CreateMeetForm } from "@/components/admin/CreateMeetForm";
import { MeetAdminCard } from "@/components/admin/MeetAdminCard";

export default async function MeetsPage() {
  const [meets, users, groups] = await Promise.all([
    prisma.meet.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignments: {
          include: { user: true, group: true },
        },
      },
    }),
    prisma.user.findMany({ orderBy: { email: "asc" } }),
    prisma.group.findMany({ orderBy: { name: "asc" } }),
  ]);

  const userOptions = users.map((u) => ({
    id: u.id,
    label: u.name ? `${u.name} (${u.email})` : u.email,
  }));
  const groupOptions = groups.map((g) => ({ id: g.id, label: g.name }));

  const userList = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }));
  const groupList = groups.map((g) => ({ id: g.id, name: g.name }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Meets
        </h1>
        <p className="mt-1 text-sm text-muted">
          Add a Google Meet link and choose who can see it.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Add a meet
        </h2>
        <CreateMeetForm users={userOptions} groups={groupOptions} />
      </section>

      <div className="space-y-4">
        {meets.length === 0 && (
          <p className="text-sm text-muted">No meets yet.</p>
        )}
        {meets.map((m) => (
          <MeetAdminCard
            key={m.id}
            meet={m}
            users={userList}
            groups={groupList}
          />
        ))}
      </div>
    </div>
  );
}

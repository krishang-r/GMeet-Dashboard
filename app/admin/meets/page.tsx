import { prisma } from "@/lib/prisma";
import { CreateMeetForm } from "@/components/admin/CreateMeetForm";
import {
  deleteMeet,
  addMeetAssignment,
  removeMeetAssignment,
} from "@/app/admin/actions";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Meets</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a Google Meet link and choose who can see it.
        </p>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Add a meet
        </h2>
        <CreateMeetForm users={userOptions} groups={groupOptions} />
      </section>

      <div className="space-y-4">
        {meets.length === 0 && (
          <p className="text-sm text-slate-500">No meets yet.</p>
        )}
        {meets.map((m) => (
          <section
            key={m.id}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900">
                  {m.title}
                </h3>
                {m.description && (
                  <p className="text-sm text-slate-500">{m.description}</p>
                )}
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block break-all text-sm text-brand hover:underline"
                >
                  {m.url}
                </a>
              </div>
              <form action={deleteMeet}>
                <input type="hidden" name="id" value={m.id} />
                <button
                  type="submit"
                  className="shrink-0 text-xs font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </form>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {m.assignments.length === 0 && (
                <span className="text-sm text-slate-400">
                  Not assigned to anyone yet.
                </span>
              )}
              {m.assignments.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {a.group ? (
                    <span className="font-medium text-brand">
                      group: {a.group.name}
                    </span>
                  ) : (
                    <>user: {a.user?.name ?? a.user?.email}</>
                  )}
                  <form action={removeMeetAssignment} className="inline">
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      className="text-slate-400 hover:text-red-600"
                      aria-label="Remove assignment"
                    >
                      ×
                    </button>
                  </form>
                </span>
              ))}
            </div>

            <form action={addMeetAssignment} className="flex items-center gap-2">
              <input type="hidden" name="meetId" value={m.id} />
              <select
                name="target"
                defaultValue=""
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
              >
                <option value="" disabled>
                  Assign to…
                </option>
                {groups.length > 0 && (
                  <optgroup label="Groups">
                    {groups.map((g) => (
                      <option key={g.id} value={`group:${g.id}`}>
                        {g.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {users.length > 0 && (
                  <optgroup label="Users">
                    {users.map((u) => (
                      <option key={u.id} value={`user:${u.id}`}>
                        {u.name ? `${u.name} (${u.email})` : u.email}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <button
                type="submit"
                className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Assign
              </button>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}

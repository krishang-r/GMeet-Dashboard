import { prisma } from "@/lib/prisma";
import { CreateGroupForm } from "@/components/admin/CreateGroupForm";
import {
  addGroupMember,
  removeGroupMember,
  deleteGroup,
} from "@/app/admin/actions";

export default async function GroupsPage() {
  const [groups, users] = await Promise.all([
    prisma.group.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        members: { include: { user: true } },
      },
    }),
    prisma.user.findMany({ orderBy: { email: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Groups</h1>
        <p className="mt-1 text-sm text-slate-500">
          Bundle users so you can assign a meeting to many people at once.
        </p>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Add a group
        </h2>
        <CreateGroupForm />
      </section>

      <div className="space-y-4">
        {groups.length === 0 && (
          <p className="text-sm text-slate-500">No groups yet.</p>
        )}
        {groups.map((g) => {
          const memberIds = new Set(g.members.map((m) => m.userId));
          const available = users.filter((u) => !memberIds.has(u.id));
          return (
            <section
              key={g.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {g.name}
                  </h3>
                  {g.description && (
                    <p className="text-sm text-slate-500">{g.description}</p>
                  )}
                </div>
                <form action={deleteGroup}>
                  <input type="hidden" name="id" value={g.id} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Delete group
                  </button>
                </form>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {g.members.length === 0 && (
                  <span className="text-sm text-slate-400">No members.</span>
                )}
                {g.members.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {m.user.name ?? m.user.email}
                    <form action={removeGroupMember} className="inline">
                      <input type="hidden" name="groupId" value={g.id} />
                      <input type="hidden" name="userId" value={m.userId} />
                      <button
                        type="submit"
                        className="text-slate-400 hover:text-red-600"
                        aria-label="Remove member"
                      >
                        ×
                      </button>
                    </form>
                  </span>
                ))}
              </div>

              {available.length > 0 && (
                <form action={addGroupMember} className="flex items-center gap-2">
                  <input type="hidden" name="groupId" value={g.id} />
                  <select
                    name="userId"
                    defaultValue=""
                    required
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  >
                    <option value="" disabled>
                      Add member…
                    </option>
                    {available.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name ? `${u.name} (${u.email})` : u.email}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                  >
                    Add
                  </button>
                </form>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

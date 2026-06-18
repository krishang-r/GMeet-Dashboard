import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { SetPasswordForm } from "@/components/admin/SetPasswordForm";
import { deleteUser, setUserRole } from "@/app/admin/actions";

export default async function UsersPage() {
  const session = await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { groupMembers: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted">
          Create accounts or manage existing ones.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Add a user
        </h2>
        <CreateUserForm />
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-elevated text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Groups</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => {
              const isSelf = u.id === session.user.id;
              return (
                <tr key={u.id} className="transition hover:bg-elevated/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">
                      {u.name ?? "—"}
                    </div>
                    <div className="text-muted">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {u.passwordHash ? "Password" : "Google only"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {u._count.groupMembers}
                  </td>
                  <td className="px-4 py-3">
                    <form action={setUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        disabled={isSelf}
                        className="rounded-md border border-line bg-surface px-2 py-1 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      {!isSelf && (
                        <button
                          type="submit"
                          className="text-xs font-medium text-brand hover:underline"
                        >
                          Save
                        </button>
                      )}
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <SetPasswordForm userId={u.id} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isSelf ? (
                      <span className="text-xs text-faint">You</span>
                    ) : (
                      <form action={deleteUser} className="inline">
                        <input type="hidden" name="id" value={u.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-danger hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
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
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create accounts or manage existing ones.
        </p>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Add a user
        </h2>
        <CreateUserForm />
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Groups</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const isSelf = u.id === session.user.id;
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {u.name ?? "—"}
                    </div>
                    <div className="text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {u.passwordHash ? "Password" : "Google only"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {u._count.groupMembers}
                  </td>
                  <td className="px-4 py-3">
                    <form action={setUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        disabled={isSelf}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-60"
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
                  <td className="px-4 py-3 text-right">
                    {isSelf ? (
                      <span className="text-xs text-slate-400">You</span>
                    ) : (
                      <form action={deleteUser} className="inline">
                        <input type="hidden" name="id" value={u.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-red-600 hover:underline"
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

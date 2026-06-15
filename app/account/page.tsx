import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, passwordHash: true },
  });

  return (
    <div className="min-h-screen">
      <SiteHeader
        email={session.user.email}
        isAdmin={session.user.role === "ADMIN"}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Account</h1>
        <p className="mt-1 text-sm text-slate-500">
          {user?.email}
          {user?.name ? ` · ${user.name}` : ""}
        </p>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-1 text-base font-semibold text-slate-900">
            {user?.passwordHash ? "Change password" : "Set a password"}
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            {user?.passwordHash
              ? "Update the password you use for email sign-in."
              : "Set a password to sign in with email as well as Google."}
          </p>
          <ChangePasswordForm hasPassword={!!user?.passwordHash} />
        </section>
      </main>
    </div>
  );
}

import { requireSession, getMeetsForUser } from "@/lib/auth-helpers";
import { SiteHeader } from "@/components/SiteHeader";
import { MeetCard } from "@/components/MeetCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const meets = await getMeetsForUser(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen">
      <SiteHeader email={session.user.email} isAdmin={isAdmin} active="dashboard" />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">My Meets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Meetings shared with you. Click a card to join in a new tab.
          </p>
        </div>

        {meets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">
              No meetings have been assigned to you yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meets.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

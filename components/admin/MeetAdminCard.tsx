"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import {
  updateMeet,
  deleteMeet,
  addMeetAssignment,
  removeMeetAssignment,
} from "@/app/admin/actions";
import { SubmitButton } from "./SubmitButton";
import { FormMessage } from "./FormMessage";
import { formatSchedule, toDateTimeLocal } from "@/lib/format";

type Assignment = {
  id: string;
  user: { name: string | null; email: string } | null;
  group: { name: string } | null;
};

type Meet = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  scheduledAt: Date | null;
  assignments: Assignment[];
};

export function MeetAdminCard({
  meet,
  users,
  groups,
}: {
  meet: Meet;
  users: { id: string; name: string | null; email: string }[];
  groups: { id: string; name: string }[];
}) {
  const [editing, setEditing] = useState(false);
  const [state, action] = useFormState(updateMeet, null);
  const when = formatSchedule(meet.scheduledAt);

  useEffect(() => {
    if (state?.success) setEditing(false);
  }, [state]);

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
      {editing ? (
        <form action={action} className="space-y-3">
          <input type="hidden" name="id" value={meet.id} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              name="title"
              defaultValue={meet.title}
              required
              placeholder="Title"
              className="field"
            />
            <input
              name="url"
              type="url"
              defaultValue={meet.url}
              required
              placeholder="Meeting URL"
              className="field"
            />
          </div>
          <input
            name="description"
            defaultValue={meet.description ?? ""}
            placeholder="Description (optional)"
            className="field"
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Date &amp; time (optional)
            </label>
            <input
              name="scheduledAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(meet.scheduledAt)}
              className="field max-w-xs"
            />
          </div>
          <div className="flex items-center gap-3">
            <SubmitButton>Save changes</SubmitButton>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm font-medium text-muted transition hover:text-foreground"
            >
              Cancel
            </button>
            <FormMessage state={state} />
          </div>
        </form>
      ) : (
        <>
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground">
                {meet.title}
              </h3>
              {when && (
                <p className="text-sm font-medium text-brand">{when}</p>
              )}
              {meet.description && (
                <p className="text-sm text-muted">{meet.description}</p>
              )}
              <a
                href={meet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block break-all text-sm text-brand hover:underline"
              >
                {meet.url}
              </a>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-medium text-brand hover:underline"
              >
                Edit
              </button>
              <form action={deleteMeet}>
                <input type="hidden" name="id" value={meet.id} />
                <button
                  type="submit"
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {meet.assignments.length === 0 && (
              <span className="text-sm text-faint">
                Not assigned to anyone yet.
              </span>
            )}
            {meet.assignments.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-elevated px-3 py-1 text-sm text-foreground"
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
                    className="text-faint transition hover:text-danger"
                    aria-label="Remove assignment"
                  >
                    ×
                  </button>
                </form>
              </span>
            ))}
          </div>

          <form action={addMeetAssignment} className="flex items-center gap-2">
            <input type="hidden" name="meetId" value={meet.id} />
            <select
              name="target"
              defaultValue=""
              required
              className="field max-w-xs"
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
              className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-dark"
            >
              Assign
            </button>
          </form>
        </>
      )}
    </section>
  );
}

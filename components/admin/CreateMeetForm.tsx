"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { createMeet } from "@/app/admin/actions";
import { SubmitButton } from "./SubmitButton";
import { FormMessage } from "./FormMessage";

type Option = { id: string; label: string };

export function CreateMeetForm({
  users,
  groups,
}: {
  users: Option[];
  groups: Option[];
}) {
  const [state, action] = useFormState(createMeet, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="title"
          type="text"
          required
          placeholder="Meeting title"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <input
          name="url"
          type="url"
          required
          placeholder="https://meet.google.com/abc-defg-hij"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <input
        name="description"
        type="text"
        placeholder="Description (optional)"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CheckboxList
          legend="Assign to groups"
          name="groupIds"
          options={groups}
          empty="No groups yet."
        />
        <CheckboxList
          legend="Assign to users"
          name="userIds"
          options={users}
          empty="No users yet."
        />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>Create meet</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

function CheckboxList({
  legend,
  name,
  options,
  empty,
}: {
  legend: string;
  name: string;
  options: Option[];
  empty: string;
}) {
  return (
    <fieldset className="rounded-lg border border-slate-200 p-3">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {legend}
      </legend>
      {options.length === 0 ? (
        <p className="text-sm text-slate-400">{empty}</p>
      ) : (
        <div className="max-h-40 space-y-1.5 overflow-y-auto">
          {options.map((o) => (
            <label
              key={o.id}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                name={name}
                value={o.id}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

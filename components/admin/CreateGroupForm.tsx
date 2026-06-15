"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { createGroup } from "@/app/admin/actions";
import { SubmitButton } from "./SubmitButton";
import { FormMessage } from "./FormMessage";

export function CreateGroupForm() {
  const [state, action] = useFormState(createGroup, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="name"
          type="text"
          required
          placeholder="Group name"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <input
          name="description"
          type="text"
          placeholder="Description (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton>Add group</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

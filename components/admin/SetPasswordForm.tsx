"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { setUserPassword } from "@/app/admin/actions";

export function SetPasswordForm({ userId }: { userId: string }) {
  const [state, action] = useFormState(setUserPassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={userId} />
      <input
        name="password"
        type="password"
        placeholder="New password"
        minLength={6}
        className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:border-brand"
      />
      <button
        type="submit"
        className="text-xs font-medium text-brand hover:underline"
      >
        Set
      </button>
      {state?.error && (
        <span className="text-xs text-red-600">{state.error}</span>
      )}
      {state?.success && (
        <span className="text-xs text-green-600">Saved</span>
      )}
    </form>
  );
}

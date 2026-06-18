"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { createUser } from "@/app/admin/actions";
import { SubmitButton } from "./SubmitButton";
import { FormMessage } from "./FormMessage";

export function CreateUserForm() {
  const [state, action] = useFormState(createUser, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="field"
        />
        <input
          name="name"
          type="text"
          placeholder="Name (optional)"
          className="field"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (optional, for email login)"
          className="field"
        />
        <select
          name="role"
          defaultValue="USER"
          className="field"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton>Add user</SubmitButton>
        <FormMessage state={state} />
      </div>
      <p className="text-xs text-faint">
        Leave password blank for Google-only accounts.
      </p>
    </form>
  );
}

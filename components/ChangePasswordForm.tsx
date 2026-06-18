"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { changeOwnPassword } from "@/app/account/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action] = useFormState(changeOwnPassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="max-w-sm space-y-3">
      {hasPassword && (
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Current password
          </label>
          <input
            name="currentPassword"
            type="password"
            required
            className="field"
          />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          New password
        </label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={6}
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Confirm new password
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className="field"
        />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{hasPassword ? "Change password" : "Set password"}</SubmitButton>
        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        {state?.success && <p className="text-sm text-success">{state.success}</p>}
      </div>
    </form>
  );
}

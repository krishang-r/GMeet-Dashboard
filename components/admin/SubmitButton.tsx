"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
      }
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

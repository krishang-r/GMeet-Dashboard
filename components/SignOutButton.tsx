"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-elevated"
    >
      Sign out
    </button>
  );
}

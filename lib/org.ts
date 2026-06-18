// Optional organisation name shown before "GMeet Dashboard". Must be a
// NEXT_PUBLIC_ var so it is readable in client components (e.g. the login page).
// Accessed via the literal property name so Next.js inlines it at build time.
export const ORGANISATION_NAME =
  process.env.NEXT_PUBLIC_ORGANISATION_NAME?.trim() || "";

// e.g. "Acme GMeet Dashboard", or just "GMeet Dashboard" when unset.
export const APP_TITLE = ORGANISATION_NAME
  ? `${ORGANISATION_NAME} GMeet Dashboard`
  : "GMeet Dashboard";

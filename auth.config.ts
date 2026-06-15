import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe config (no Prisma / bcrypt here). Used by middleware and shared
// with the full config in auth.ts. The Credentials provider and Prisma adapter
// are added in auth.ts because they need the Node.js runtime.
const providers: NextAuthConfig["providers"] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Allow a Google login to attach to an existing email/password account
      // that uses the same email address.
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    // Runs in middleware (edge). Only gates authentication; role checks for
    // /admin happen server-side in the admin layout.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ["/dashboard", "/admin"];
      const isProtected = protectedPaths.some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      if (isProtected) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;

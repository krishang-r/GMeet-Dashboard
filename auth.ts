import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  // Credentials provider requires JWT sessions.
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // role is present on the user object for both providers
        token.role = (user as { role?: string }).role;
      }

      // Bootstrap admins listed in ADMIN_EMAILS on every token refresh.
      if (
        token.email &&
        adminEmails.includes(token.email.toLowerCase()) &&
        token.role !== "ADMIN"
      ) {
        token.role = "ADMIN";
        if (token.id) {
          await prisma.user
            .update({
              where: { id: token.id as string },
              data: { role: "ADMIN" },
            })
            .catch(() => undefined);
        }
      }

      // Fill in role from DB if missing (e.g. first Google login).
      if (!token.role && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "ADMIN" | "USER") ?? "USER";
      }
      return session;
    },
  },
});

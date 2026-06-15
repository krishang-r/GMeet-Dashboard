# GMeet Dashboard

A dashboard to consolidate all your Google Meets in one place — not just the
pre-scheduled ones (those live in Google Calendar), but also the recurring
"instant" meetings with the same people that get a brand-new link every time.

Each meeting shows up as a card. People sign in, see **only** the meetings
shared with them, and click **Join meeting** to open Meet in a new tab. An
in-app admin panel lets you manage users, groups, meeting links, and who can
see what.

## Features

- **Login portal** — Google Sign-In **and** email/password.
- **Access control** — meetings are assigned to individual users or to groups;
  users only see what's assigned to them.
- **Admin panel** (`/admin`) — manage users, groups, meet links and assignments.
  - **Edit a meet in place** — update the link/title/time each time a recurring
    meeting gets a new link, without losing its assignments.
  - **Password management** — admins can set/reset any user's password.
- **Optional schedule** — give a meet a date/time (or leave blank for instant /
  recurring meets); it shows on the card.
- **Account page** (`/account`) — users change their own password (Google-only
  users can add one to enable email login).
- **Role-based** — `ADMIN` users get the admin panel; everyone else gets their
  dashboard.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript + Tailwind CSS
- [Auth.js / NextAuth v5](https://authjs.dev/) for authentication
- [Prisma](https://www.prisma.io/) ORM with **Neon Postgres** (free tier)
- Deploys to **Vercel**

---

## 1. Set up the database (Neon — free)

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string (it contains `-pooler`). It looks like:
   `postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require`
3. You'll paste it into `DATABASE_URL` below.

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill it in:

```bash
cp .env.example .env
```

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally; your Vercel URL in prod |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | From Google Cloud (optional) |
| `NEXT_PUBLIC_GOOGLE_ENABLED` | `"true"` to show the Google button |
| `ADMIN_EMAILS` | Comma-separated emails auto-promoted to admin on login |

### Google Sign-In (optional)

1. In [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**, create an **OAuth client ID** (type: Web application).
2. Add an **Authorized redirect URI**:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://your-app.vercel.app/api/auth/callback/google`
3. Put the client ID/secret in `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` and set
   `NEXT_PUBLIC_GOOGLE_ENABLED="true"`.

## 3. Run locally

```bash
npm install
npm run db:push        # create tables in your Neon database
npm run dev            # http://localhost:3000
```

### Create your first admin

Two ways:

- **Easiest:** put your email in `ADMIN_EMAILS`, then sign in with Google —
  you'll be promoted to admin automatically.
- **Email/password:** seed an admin account:

  ```bash
  SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=changeme npm run db:seed
  ```

  Then sign in with that email and password.

---

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/), **Import** the GitHub repo.
3. Add all the environment variables from your `.env` in
   **Project Settings → Environment Variables** (Production + Preview).
   - Set `NEXTAUTH_URL` to your real Vercel URL.
   - Update the Google redirect URI to match (see above).
4. Deploy. The `build` script runs `prisma db push` automatically, so your Neon
   tables are created/updated on every deploy.

> The build uses `prisma db push` for zero-config schema sync, which is great
> for getting started. For a production change history you can switch to
> `prisma migrate` later.

## How it works

- **`/login`** — Google + email/password sign-in.
- **`/dashboard`** — the signed-in user's meeting cards (assigned to them
  directly or via a group they belong to).
- **`/admin`** — admin-only: Users, Groups, Meets tabs.
- Middleware protects `/dashboard` and `/admin`; the admin layout additionally
  enforces the `ADMIN` role server-side.

## Project structure

```
app/
  login/            Login portal
  dashboard/        User's meeting cards
  admin/            Admin panel (users, groups, meets) + server actions
  api/auth/         Auth.js route handler
components/         MeetCard, header, admin forms
lib/                Prisma client, auth/access helpers
prisma/             schema + seed
auth.ts             Auth.js config (Google + Credentials)
auth.config.ts      Edge-safe config used by middleware
```

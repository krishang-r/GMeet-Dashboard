# GMeet Dashboard

A dashboard to consolidate all your Google Meets in one place — not just the
pre-scheduled ones (those live in Google Calendar), but also the recurring
"instant" meetings with the same people that get a brand-new link every time.

Each meeting shows up as a card. People sign in, see **only** the meetings
shared with them, and click **Join meeting** to open Meet in a new tab. An
in-app admin panel lets you manage users, groups, meeting links, and who can
see what. Ships with a polished light **and** dark theme.

> **Want your own?** Click **Use this template** (or fork/clone) on GitHub,
> then deploy:
>
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkrishang-r%2FGMeet-Dashboard&env=DATABASE_URL,AUTH_SECRET,NEXTAUTH_URL,ADMIN_EMAILS,NEXT_PUBLIC_GOOGLE_ENABLED,NEXT_PUBLIC_ORGANISATION_NAME&envDescription=See%20.env.example%20for%20what%20each%20value%20means)
>
> Vercel will ask for the environment variables below as you deploy. You'll
> still need a (free) Neon database — see step 1.

## Screenshots

| Login | Dashboard |
| --- | --- |
| ![Login page](readme_images/loginpage.png) | ![User dashboard](readme_images/Dashboard.png) |

| Admin · Overview | Admin · Users |
| --- | --- |
| ![Admin overview](readme_images/Admin_overview.png) | ![Admin users](readme_images/Admin_users.png) |

| Admin · Groups | Admin · Meets |
| --- | --- |
| ![Admin groups](readme_images/Admin_groups.png) | ![Admin meets](readme_images/Admin_meets.png) |

> Screens shown in dark mode — use the ☀️/🌙 toggle in the header (or on the
> login page) to switch. The choice is saved and respects your OS preference.

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
- **Light & dark theme** — no-flash theme switch, persisted per browser.
- **Custom branding** — set `NEXT_PUBLIC_ORGANISATION_NAME` to show e.g.
  *"Acme GMeet Dashboard"* in the title, header and login page.

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

> Use the **pooled** string (with `-pooler`), not the direct one — it handles
> Neon's auto-suspend reconnects far better and avoids most `57P01` errors.

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill it in:

```bash
cp .env.example .env
```

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string |
| `AUTH_SECRET` | Run `openssl rand -base64 32` (or `npx auth secret`) |
| `NEXTAUTH_URL` | `http://localhost:3000` locally; your Vercel URL in prod |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | From Google Cloud (optional) |
| `NEXT_PUBLIC_GOOGLE_ENABLED` | `"true"` to show the Google button |
| `NEXT_PUBLIC_ORGANISATION_NAME` | Optional. Prefixes the app name, e.g. `"Acme"` → *"Acme GMeet Dashboard"* |
| `ADMIN_EMAILS` | Comma-separated emails auto-promoted to admin on login |

> 🔒 **Never commit `.env`.** Only `.env.example` (placeholders) is tracked in
> git. Put real values in your local `.env` and, for production, in Vercel's
> **Environment Variables** — not in any committed file.
>
> ⚠️ `NEXT_PUBLIC_*` values are baked in at build time. After changing
> `NEXT_PUBLIC_GOOGLE_ENABLED` or `NEXT_PUBLIC_ORGANISATION_NAME`, **restart**
> `npm run dev` locally (and **redeploy** on Vercel) for it to take effect.

### Google Sign-In (optional)

1. In [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**, create an **OAuth client ID** (type: Web application).
2. Add an **Authorized redirect URI** — it must match **exactly**:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://your-app.vercel.app/api/auth/callback/google`
   - Click **Save** afterwards — changes can take a few minutes to apply.
3. Put the client ID/secret in `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` and set
   `NEXT_PUBLIC_GOOGLE_ENABLED="true"`.
4. If your OAuth consent screen is in **Testing** mode, add your Google account
   under **OAuth consent screen → Test users**, or you'll be blocked.

## 3. Run locally

```bash
npm install
npm run db:push        # create tables in your Neon database
npm run dev            # http://localhost:3000
```

### Create your first admin

There is **no public sign-up** — accounts are created by an admin or seeded.
Bootstrap the first admin one of two ways:

- **Easiest:** put your email in `ADMIN_EMAILS`, then sign in with Google —
  you'll be promoted to admin automatically.
- **Email/password:** seed an admin account (pick your own password):

  ```bash
  SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=changeme npm run db:seed
  ```

  Then sign in with that email and password.

---

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/), **Import** the GitHub repo (or use the
   **Deploy with Vercel** button up top).
3. In **Project Settings → Environment Variables**, add every variable from your
   `.env` (Production + Preview):
   - Set `NEXTAUTH_URL` to your **real** production URL, e.g.
     `https://your-app.vercel.app` (you'll know it after the first deploy) —
     **do not** leave it as `http://localhost:3000`.
   - Add `AUTH_TRUST_HOST=true` so Auth.js trusts Vercel's proxy host.
   - If using Google, add the prod redirect URI
     `https://your-app.vercel.app/api/auth/callback/google` in Google Console.
4. Deploy. The `build` script runs `prisma db push` automatically, so your Neon
   tables are created/updated on every deploy.
5. Create your first admin (see above) against the production database — easiest
   is to add your email to `ADMIN_EMAILS` and sign in with Google.

> The build uses `prisma db push` for zero-config schema sync, which is great
> for getting started. For a production change history you can switch to
> `prisma migrate` later.

---

## Troubleshooting — when you get stuck

<details>
<summary><strong>Google: <code>Error 400: redirect_uri_mismatch</code></strong></summary>

The redirect URI registered in Google Cloud must **exactly** match the one your
app sends. Check both sides:

- **What the app sends:** locally it's
  `http://localhost:3000/api/auth/callback/google`. Confirm your dev server is
  really on port **3000** (Next.js picks 3001+ if 3000 is busy — then your URL
  and the registered URI won't match). You can see the exact callback the app
  uses at `http://localhost:3000/api/auth/providers`.
- **What's registered:** in Google Console, make sure you clicked **Save**, that
  there's no stray space, and that you're editing the client whose ID is in
  `AUTH_GOOGLE_ID`. Google warns changes can take **5 minutes to a few hours**.
- Retry in an **incognito window** to avoid a cached request.
</details>

<details>
<summary><strong>Google: "Access blocked / app not verified"</strong></summary>

Your OAuth consent screen is in **Testing** mode. Add the Google account you're
signing in with under **OAuth consent screen → Test users**, or publish the
consent screen.
</details>

<details>
<summary><strong>A <code>NEXT_PUBLIC_*</code> change isn't showing up</strong></summary>

These are inlined at **build time**, not read at runtime. After editing
`NEXT_PUBLIC_GOOGLE_ENABLED` or `NEXT_PUBLIC_ORGANISATION_NAME`, **restart**
`npm run dev` (and **redeploy** on Vercel). A hot reload won't pick them up.
</details>

<details>
<summary><strong>Prisma: <code>terminating connection ... (57P01)</code></strong></summary>

Neon's free tier **auto-suspends** the database after inactivity, which drops
idle connections (this error). The next request wakes it (~0.5s cold start), so
it's mostly harmless noise. To minimise it, use the **pooled** connection string
(the one with `-pooler`) in `DATABASE_URL`.
</details>

<details>
<summary><strong>Login fails with "Invalid email or password"</strong></summary>

There's no public sign-up and the database starts empty. Create the first admin
by seeding (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` → `npm run db:seed`) or by
adding your email to `ADMIN_EMAILS` and signing in with Google.
</details>

<details>
<summary><strong>Dev: <code>404</code> on <code>/_next/static/...</code> chunks</strong></summary>

Stale build cache — usually from running `next build` while `next dev` is also
running (they share `.next`). Stop the dev server, then:

```bash
rm -rf .next && npm run dev
```

Hard-refresh the browser (Cmd/Ctrl+Shift+R) afterwards.
</details>

<details>
<summary><strong>Still stuck?</strong></summary>

- Check the **dev server terminal** and the browser **console / network** tab.
- Auth.js surfaces failures as `?error=...` in the URL — that string names the
  cause.
- Make sure your local `.env` exists and `DATABASE_URL` is reachable
  (`npm run db:studio` opens Prisma Studio against it).
</details>

---

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
  layout.tsx        Root layout, fonts, no-flash theme script
components/
  MeetCard, SiteHeader, ThemeToggle, admin forms
lib/
  prisma.ts         Prisma client
  auth-helpers.ts   Session / access helpers
  org.ts            Organisation-name branding helper
prisma/             schema + seed
auth.ts             Auth.js config (Google + Credentials)
auth.config.ts      Edge-safe config used by middleware
```

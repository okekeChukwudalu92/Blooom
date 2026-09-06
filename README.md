# Blooom — project scaffold

Three separate pieces, matching what we planned:

- **api/** — Express + Postgres backend. The single source of truth; both
  frontends talk to this and nothing else.
- **public-site/** — React (Vite). What visitors see: houses, credibility,
  faces. Read-only, no login code in it at all.
- **admin-panel/** — React (Vite). Login → OTP → security questions → set
  password → dashboard to add/manage houses, credibility, faces, and (god-mode
  only) invite/reset other admins.

Each folder has its own `.env.example` with comments on exactly where to get
each value. Copy it to `.env` in that same folder before running anything.

## 1. Set up the database

1. Create a Supabase project at supabase.com if you don't have one yet.
2. Open the SQL Editor in the Supabase dashboard, paste in the contents of
   `api/migrations/001_init.sql`, and run it. This creates the four tables:
   `admins`, `houses`, `credibility`, `faces`.
3. Go to Storage in the Supabase dashboard, create a new bucket named exactly
   `blooom-media`, and mark it **Public**.

## 2. Fill in your .env files

```
cp api/.env.example api/.env
cp public-site/.env.example public-site/.env
cp admin-panel/.env.example admin-panel/.env
```

Then open each `.env` and follow the comments inside — mainly `api/.env`,
which needs your Supabase connection string, Supabase project URL, and
Supabase service_role key (all from Project Settings in the Supabase
dashboard), plus a `JWT_SECRET` you generate yourself and the `GOD_PASSWORD`
you choose.

## 3. Install and run each piece locally

Open three terminal tabs:

```
cd api && npm install && npm run dev
```

```
cd public-site && npm install && npm run dev
```

```
cd admin-panel && npm install && npm run dev
```

- API runs on http://localhost:4000
- Public site runs on http://localhost:5173
- Admin panel runs on http://localhost:5174

## 4. First login

Go to the admin panel (http://localhost:5174) and log in with the
`GOD_PASSWORD` you set in `api/.env`. That logs you in as the developer
("god mode") account — no database row needed for this one, it's checked
straight against the env var.

From there, use the **Admins** tab to invite the BlooomOnline guy (or anyone
else): fill in his name and two security questions, submit, and the OTP
appears on screen once — copy it and send it to him yourself (DM, text,
however). He opens the admin panel, clicks "Verify OTP" under the password
field, enters it, answers his security questions, sets his own password, and
he's in from then on with his own login.

If he ever forgets his password: go to the Admins tab yourself, click
"Reset access" next to his name, and a fresh OTP is issued — send it to him
and he goes through the same OTP → questions → new password flow again. The
god password never has to be shared with anyone.

## 5. Deployment (when you're ready)

- **api/** → Render (same as your other projects). Set all the `.env`
  values as environment variables in Render's dashboard instead of a `.env`
  file.
- **public-site/** → Vercel, pointed at `blooom.online`
- **admin-panel/** → Vercel, pointed at `admin.blooom.online` (a different
  subdomain so the admin code never ships as part of the public site)
- Once you have real domains, update `ALLOWED_ORIGINS` in the API's
  environment variables to your real domains instead of localhost, and
  update `VITE_API_URL` in both frontends' environment variables to your
  real API domain (e.g. `https://api.blooom.online`).

## What's intentionally left simple for now

- The public site's design is a clean working version of the layout we
  planned (houses grid, credibility carousel with dots, faces cards) — it is
  **not** a port of the full animated space-background HTML site we built
  earlier. Bringing that whole experience (the star field, scroll parallax,
  shooting stars, mobile drawer nav) into React as its own set of components
  is a separate, sizeable job — say the word whenever you want to tackle
  that piece and we'll do it properly rather than rushed.
- Sort order for houses/credibility/faces exists in the database
  (`sort_order` column) but there's no drag-to-reorder UI yet — right now
  whatever order things were added in is the order they display.
- No image cropping/resizing on upload — whatever size photo you upload is
  what gets stored and displayed. Worth adding a client-side resize step
  before this goes live so a 12MB phone photo doesn't slow the site down.

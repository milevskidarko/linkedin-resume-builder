## LinkedIn Resume Builder – Phase 2 (Auth0 + Postgres)

Next.js app router project with Auth0-protected resume builder/preview. Database will be Postgres (Supabase/Neon) without Hasura yet.

### Setup
1) Install deps: `npm install`
2) Create `.env.local` with:
```
AUTH0_SECRET=generate-a-32+char-random-string
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET

DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
```
3) Configure Auth0 Application: Callback URL `http://localhost:3000/api/auth/callback`, Logout URL `http://localhost:3000`. Enable refresh tokens/rotating if desired.
4) Generate Prisma client and sync schema to Postgres:
```bash
npx prisma generate
npx prisma db push
```

### Auth
- Routes `/builder` and `/preview` are protected by middleware; unauthenticated users are redirected to Auth0 login.
- Auth endpoints live at `/api/auth/[auth0]` (login, logout, callback, me handled by SDK).
- `Header` shows sign-in/out state via Auth0 SDK.

### Database (Postgres)
- Bring your own Postgres (Supabase/Neon). `DATABASE_URL` is reserved for later persistence. Schema to add:
	- `users`: id (uuid), auth0_sub (text, unique), email, created_at
	- `resumes`: id (uuid), user_id (fk), title, summary, updated_at
	- `experiences`: id (uuid), resume_id (fk), role, company, start_date, end_date, description
	- `skills`: id (uuid), resume_id (fk), name, level

Prisma schema lives in `prisma/schema.prisma` and matches the fields captured by the resume form (personal info, summary, experience, education, skills).

### Run
```bash
npm run dev
# open http://localhost:3000
```

### Next steps
- Wire the builder page to call the new REST endpoints under `/api/resumes` for save/load.
- Add auto-save and optimistic updates in builder UI.
- Optional: move to Hasura/GraphQL later if needed.

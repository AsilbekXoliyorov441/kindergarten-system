# Bogcha — Kindergarten Management System

Web app for running a private kindergarten ("bogcha"): groups, children, staff, daily attendance, parent↔staff feedback threads, and finance/attendance statistics.

## Stack

React 19 (Vite) + JavaScript · Convex (backend + database) · Tailwind CSS v4 · Framer Motion · Recharts · React Router · Zustand · a hand-authored shadcn/ui-style component kit (Radix primitives + CVA), organized as Feature-Sliced Design (`app / pages / widgets / features / entities / shared`).

## Roles

- **Superadmin** — full access: groups, staff, children, settings, correspondence, statistics.
- **Opa** (caregiver/staff) — assigned group(s): roster, daily attendance, parent feedback threads.
- **Parent** — own child's profile, attendance calendar, and a feedback thread with staff/director.

## Run it

```bash
yarn install
npx convex dev   # starts the Convex backend, generates convex/_generated
yarn dev         # in a second terminal
```

Open the printed local URL (defaults to `http://localhost:4000`). Convex connection settings live in `.env.local` (not committed).

## Scripts

- `yarn dev` — start the frontend dev server
- `yarn build` — production build
- `yarn lint` — ESLint
- `npx convex dev` — run the Convex backend locally and sync functions/schema

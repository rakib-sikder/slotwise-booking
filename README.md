# Slotwise — Booking SaaS Micro-Product

A service-business booking tool: the owner sets services and weekly working hours, shares
one link, and clients book themselves into conflict-free slots.

- **`/book`** — public booking flow (pick service → pick date → pick a real, computed-available
  time → confirm with name/email).
- **`/admin`** — password-protected owner dashboard: upcoming bookings (with cancel), manage
  services, edit weekly working hours.

## The interesting part: slot computation

`lib/slots.ts` is the actual scheduling logic, not just CRUD:

- Generates candidate start times at 15-minute granularity within the day's working-hour
  ranges, keeping only ones where the *full service duration* fits before the range ends.
- Filters out anything overlapping an existing booking for that day.
- For today specifically, filters out anything less than 30 minutes from now.

The booking `POST /api/bookings` **re-derives the valid slot set server-side** and rejects
the request if the client's chosen time isn't in it — the client-displayed availability is
never trusted directly. `lib/store.ts#createBooking` does one more overlap check at the
moment of writing, so two people racing for the same slot can't both win it.

## Auth

A single owner login (`OWNER_PASSWORD`, HMAC-signed session cookie in `lib/auth.ts`) —
deliberately not a full multi-tenant user system, since this is a one-business demo. Swap in
Auth.js/Clerk + a real `businessId` column if this became a multi-tenant product.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Node's built-in `crypto` for session
signing (no auth library dependency)

## Getting started

```bash
npm install
npm run dev
```

Visit `/book` to try the customer flow, or `/admin` (demo password `demo1234`, or your own
`OWNER_PASSWORD` env var) for the owner dashboard.

## Notes for production use

- Data is stored as JSON under the OS temp dir (`lib/store.ts`) so it runs on serverless
  platforms (Vercel) without a database — but that means it's **ephemeral per warm
  instance**. Swap `lib/store.ts` for Postgres/SQLite-on-a-volume before handling real
  bookings; the rest of the app (routes, slot logic) doesn't need to change.
- Single business, single timezone (server local time) — a real multi-tenant version needs
  a `businessId` on every record and explicit per-business timezone handling.

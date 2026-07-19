import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Slotwise</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Set your services and working hours once. Share one link. Clients book themselves
          into real, conflict-free slots — no back-and-forth, no double-bookings.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link href="/book" className="rounded-full bg-blue-600 text-white text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity">
            Try the booking page
          </Link>
          <Link href="/admin" className="rounded-full border border-neutral-300 dark:border-neutral-700 text-sm font-medium px-6 py-3 hover:border-neutral-400 transition-colors">
            Owner dashboard
          </Link>
        </div>
        <p className="text-xs text-neutral-400 pt-4">
          Demo data: &ldquo;Blue Willow Salon&rdquo;. Owner dashboard is password-protected —
          the demo password is shown on the login screen.
        </p>
      </div>
    </div>
  );
}

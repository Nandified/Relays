import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Relays helps buyers build the right team — fast.
          </h1>
          <p className="mt-3 text-pretty text-base text-slate-600">
            Browse service providers like a marketplace. When you’re ready to act, we’ll
            capture the context and turn it into a lead — with a clean, calm experience.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/marketplace"
              className="rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
            >
              Browse marketplace
            </Link>
            <Link
              href="/marketplace"
              className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-900"
            >
              Find a home inspector
            </Link>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="font-semibold text-slate-900">Search-first marketplace</div>
              <div className="mt-1 text-slate-600">Thumbtack-like browse + sticky preview.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="font-semibold text-slate-900">Soft wall</div>
              <div className="mt-1 text-slate-600">Browse freely. Create an account only when you act.</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-[var(--shadow-elevated)]">
          <div className="text-sm font-semibold text-slate-900">Tonight’s goal</div>
          <div className="mt-2 text-sm text-slate-600">
            Get the marketplace working end-to-end with a soft wall and lead attribution.
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="rounded-2xl bg-slate-50 p-3">
              1) Browse pros
              <div className="text-xs text-slate-500">No login required</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              2) Click “Add to team”
              <div className="text-xs text-slate-500">Soft wall opens</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              3) Continue
              <div className="text-xs text-slate-500">Lead event logs with pro context</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

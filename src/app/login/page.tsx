export default function LoginPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[var(--shadow-elevated)]">
        <div className="text-base font-semibold text-slate-900">Log in</div>
        <div className="mt-2 text-sm text-slate-600">
          Placeholder for Magic Link + Google. For now, use any gated action (Add to team, Request booking)
          to trigger the fake auth modal.
        </div>
      </div>
    </main>
  );
}

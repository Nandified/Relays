"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "What service do you need?" }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3.5 pl-11 text-sm text-slate-200 placeholder:text-slate-500 outline-none shadow-[var(--shadow-card)] transition-all focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] focus:shadow-[var(--glow-accent)]"
      />
    </div>
  );
}

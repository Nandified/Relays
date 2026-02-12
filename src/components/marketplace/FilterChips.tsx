"use client";

interface FilterChipsProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function FilterChips({ categories, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`
          flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all
          ${selected === null
            ? "bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]"
            : "bg-[var(--bg-card)] border border-[var(--border)] text-slate-400 hover:border-[var(--border-hover)] hover:text-slate-300"
          }
        `}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(selected === cat ? null : cat)}
          className={`
            flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all whitespace-nowrap
            ${selected === cat
              ? "bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]"
              : "bg-[var(--bg-card)] border border-[var(--border)] text-slate-400 hover:border-[var(--border-hover)] hover:text-slate-300"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

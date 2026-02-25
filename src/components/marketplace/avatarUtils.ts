export function getInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Deterministic soft gradient from name.
// Intentionally keeps backgrounds light so dark text has strong contrast in light mode.
const AVATAR_GRADIENTS = [
  "from-blue-500/35 to-blue-400/15 dark:from-blue-400/25 dark:to-blue-300/10",
  "from-violet-500/35 to-violet-400/15 dark:from-violet-400/25 dark:to-violet-300/10",
  "from-emerald-500/35 to-emerald-400/15 dark:from-emerald-400/25 dark:to-emerald-300/10",
  "from-amber-500/35 to-amber-400/15 dark:from-amber-400/25 dark:to-amber-300/10",
  "from-rose-500/35 to-rose-400/15 dark:from-rose-400/25 dark:to-rose-300/10",
  "from-cyan-500/35 to-cyan-400/15 dark:from-cyan-400/25 dark:to-cyan-300/10",
  "from-fuchsia-500/35 to-fuchsia-400/15 dark:from-fuchsia-400/25 dark:to-fuchsia-300/10",
  "from-lime-500/35 to-lime-400/15 dark:from-lime-400/25 dark:to-lime-300/10",
];

export function avatarGradientClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

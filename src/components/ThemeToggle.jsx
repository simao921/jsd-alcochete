import { useApp } from "../context/AppContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white text-lg text-jsd-orange transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white"
      aria-label="Alternar tema"
    >
      {theme === "light" ? "◐" : "☀"}
    </button>
  );
}

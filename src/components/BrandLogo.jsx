import { cn } from "../services/helpers";

export function BrandLogo({
  className = "",
  imageClassName = "",
  showText = true,
  textTone = "dark"
}) {
  const titleClass = textTone === "light" ? "text-white" : "text-jsd-blue-dark";
  const subtitleClass = textTone === "light" ? "text-white/70" : "text-jsd-black/55";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="shrink-0 overflow-hidden rounded-full bg-white shadow-sm">
        <img
          src="/jsd-logo.jpg"
          alt="Logótipo da JSD"
          className={cn("h-16 w-16 object-cover sm:h-20 sm:w-20", imageClassName)}
        />
      </div>

      {showText && (
        <div>
          <p className={cn("font-display text-lg font-bold tracking-tight sm:text-xl", titleClass)}>JSD Alcochete</p>
          <p className={cn("text-xs uppercase tracking-[0.24em]", subtitleClass)}>Juventude Social Democrata</p>
        </div>
      )}
    </div>
  );
}

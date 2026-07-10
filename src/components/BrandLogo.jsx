import { cn } from "../services/helpers";

export function BrandLogo({
  className = "",
  imageClassName = "",
  showText = true,
  textTone = "dark",
  compact = false
}) {
  const titleClass = textTone === "light" ? "text-white" : "text-jsd-blue-dark";
  const subtitleClass = textTone === "light" ? "text-white/60" : "text-jsd-black/55";

  if (compact) {
    return (
      <div className={cn("flex min-w-0 max-w-[220px] items-center gap-3", className)}>
        <img
          src="/jsd-logo.jpg"
          alt="JSD Alcochete"
          className={cn(
            "h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-jsd-orange/25 shadow-[0_0_20px_rgba(255,153,0,0.15)]",
            imageClassName
          )}
        />
        {showText && (
          <div className="min-w-0 leading-tight">
            <p className={cn("truncate font-display text-sm font-bold tracking-tight sm:text-[15px]", titleClass)}>
              JSD Alcochete
            </p>
            <p className={cn("truncate text-[9px] font-semibold uppercase tracking-[0.2em]", subtitleClass)}>
              Juventude Social Democrata
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <img
        src="/jsd-logo.jpg"
        alt="Logótipo da JSD"
        className={cn(
          "h-16 w-16 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-jsd-orange/20 sm:h-[4.5rem] sm:w-[4.5rem]",
          imageClassName
        )}
      />

      {showText && (
        <div className="space-y-1">
          <p className={cn("font-display text-xl font-bold tracking-tight sm:text-2xl", titleClass)}>
            JSD Alcochete
          </p>
          <p className={cn("text-[10px] font-semibold uppercase tracking-[0.24em]", subtitleClass)}>
            Juventude Social Democrata
          </p>
        </div>
      )}
    </div>
  );
}

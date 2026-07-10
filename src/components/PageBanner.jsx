import { cn } from "../services/helpers";

/** Cabeçalho editorial para páginas internas (sem parallax). */
export function PageBanner({ label, title, description, className = "", children }) {
  return (
    <section className={cn("relative overflow-hidden border-b border-white/5", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,153,0,0.08),transparent_55%)] pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-jsd-orange via-jsd-orange/50 to-transparent" />

      <div className="section-shell relative z-10 pb-10 md:pb-14">
        <div className="max-w-4xl space-y-5">
          {label && <p className="eyebrow">{label}</p>}
          <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.05]">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-white/65">{description}</p>
          )}
          {children && <div className="flex flex-wrap gap-3 pt-2">{children}</div>}
        </div>
      </div>

      <div className="divider-orange" />
    </section>
  );
}

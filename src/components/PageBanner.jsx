import { BrandLogo } from "./BrandLogo";
import { cn } from "../services/helpers";

export function PageBanner({
  label,
  title,
  description,
  className = "",
  compact = false,
  children
}) {
  return (
    <section className={cn("section-shell", compact && "py-10 md:py-12", className)}>
      <div className="overflow-hidden rounded-[2rem] border border-jsd-orange/12 bg-white shadow-panel">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 p-8 md:p-10">
            <p className="eyebrow">{label}</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-jsd-blue-dark sm:text-5xl dark:text-white">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-jsd-black/75 dark:text-white/70">{description}</p>
            {children && <div className="flex flex-wrap gap-3 pt-2">{children}</div>}
          </div>

          <div className="flex min-h-full items-center justify-center bg-[#fff8ef] p-8 md:p-10">
            <BrandLogo imageClassName="h-24 w-24 sm:h-28 sm:w-28" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { cn } from "../services/helpers";
import { useScrollReveal } from "../hooks/useScrollReveal";

export function ScrollReveal({ children, className = "" }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className={cn("reveal", isVisible && "reveal-visible", className)}>
      {children}
    </div>
  );
}

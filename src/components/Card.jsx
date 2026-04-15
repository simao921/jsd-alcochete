import { cn } from "../services/helpers";

export function Card({ as: Tag = "article", className = "", children, ...props }) {
  return (
    <Tag className={cn("surface-panel p-6", className)} {...props}>
      {children}
    </Tag>
  );
}

import { useApp } from "../context/AppContext";
import { cn } from "../services/helpers";

const toneClasses = {
  info: "border-jsd-blue/15 bg-white/90 text-jsd-blue-dark dark:border-white/10 dark:bg-jsd-blue dark:text-white",
  success: "border-green-500/20 bg-green-50 text-green-900 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-100",
  warning: "border-jsd-orange/25 bg-orange-50 text-orange-900 dark:border-jsd-orange/20 dark:bg-jsd-orange/10 dark:text-orange-100"
};

export function NotificationContainer() {
  const { notifications } = useApp();

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-50 flex w-full max-w-sm flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "pointer-events-auto rounded-2xl border px-4 py-3 text-sm font-medium shadow-panel backdrop-blur transition",
            toneClasses[notification.tone] ?? toneClasses.info
          )}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

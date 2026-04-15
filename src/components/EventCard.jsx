import { Card } from "./Card";
import { formatDate, formatDateTime } from "../services/helpers";

export function EventCard({ event }) {
  return (
    <Card className="h-full space-y-5 border-jsd-orange/12 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-[#fff4e1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-jsd-orange">
          {event.category}
        </span>
        <span className="rounded-full bg-[#fff8ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-jsd-blue-dark dark:bg-white/10 dark:text-white">
          {event.status}
        </span>
      </div>

      <div className="space-y-3 flex-1">
        <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">{event.title}</h3>
        <p className="copy text-sm">{event.summary}</p>
      </div>

      <div className="grid gap-3 rounded-[1.5rem] bg-[#fff8ef] p-4 text-sm dark:bg-white/5">
        <div className="flex justify-between items-center border-b border-black/5 pb-2">
          <span className="font-semibold text-jsd-blue-dark dark:text-white">Data</span>
          <span className="font-medium">{formatDateTime(event.date)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-jsd-blue-dark dark:text-white">Local</span>
          <span className="font-medium text-right">{event.location}</span>
        </div>
      </div>
    </Card>
  );
}

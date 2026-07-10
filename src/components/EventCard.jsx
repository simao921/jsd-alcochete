import { Card } from "./Card";
import { formatDate, formatDateTime } from "../services/helpers";

export function EventCard({ event }) {
  return (
    <Card className="h-full space-y-5 border-jsd-orange/15 flex flex-col hover:border-jsd-orange/30 transition-colors duration-300 group">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-jsd-orange border border-jsd-orange/20 bg-jsd-orange/10 px-3 py-1">
          {event.category}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/10 px-3 py-1">
          {event.status}
        </span>
      </div>

      <div className="space-y-3 flex-1">
        <h3 className="font-display text-2xl font-bold text-white group-hover:text-jsd-orange transition-colors">
          {event.title}
        </h3>
        <p className="text-sm leading-relaxed text-white/65">{event.summary}</p>
      </div>

      <div className="grid gap-3 border border-white/5 bg-white/[0.02] p-4 text-sm">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="font-semibold text-jsd-orange text-xs uppercase tracking-widest">Data</span>
          <span className="font-medium text-white/80">{formatDateTime(event.date)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-jsd-orange text-xs uppercase tracking-widest">Local</span>
          <span className="font-medium text-white/80 text-right">{event.location}</span>
        </div>
      </div>
    </Card>
  );
}

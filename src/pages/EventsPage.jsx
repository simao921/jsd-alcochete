import { useState } from "react";

import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn, formatDateTime, formatDate } from "../services/helpers";

// ─── Safe Date Badge ────────────────────────────────────────────────────────
function DateBadge({ dateStr }) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.valueOf())) return null;
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("pt-PT", { month: "short" }).toUpperCase();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-jsd-orange px-4 py-3 text-white min-w-[60px]">
      <span className="text-2xl font-black leading-none">{day}</span>
      <span className="text-[10px] font-bold tracking-widest mt-0.5">{month}</span>
    </div>
  );
}

// ─── Status Pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const colours = {
    "Inscrições abertas": "bg-emerald-100 text-emerald-700",
    "Brevemente": "bg-amber-100 text-amber-700",
    "Concluído": "bg-slate-100 text-slate-500",
  };
  const cls = colours[status] || "bg-jsd-orange/10 text-jsd-orange";
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]", cls)}>
      {status || "Sem estado"}
    </span>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event }) {
  if (!event) return null;
  const title    = event.title    || "Evento sem título";
  const location = event.location || "Local não definido";
  const summary  = event.summary  || "";
  const category = event.category || "";
  const date     = event.date     || null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
      {/* Top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-jsd-orange to-amber-400" />

      <div className="flex flex-1 flex-col gap-5 p-7">
        {/* Header row */}
        <div className="flex items-start gap-4">
          <DateBadge dateStr={date} />
          <div className="min-w-0 flex-1 space-y-2">
            {category && (
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-jsd-orange">
                {category}
              </p>
            )}
            <h3 className="font-display text-xl font-bold leading-snug text-jsd-blue-dark line-clamp-2 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-sm leading-relaxed text-jsd-black/65 line-clamp-3 dark:text-white/60">
            {summary}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-5 dark:border-white/8">
          <div className="flex items-center gap-2 text-sm text-jsd-black/60 dark:text-white/55">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>
          <StatusPill status={event.status} />
        </div>
      </div>
    </div>
  );
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "border-jsd-orange bg-jsd-orange text-white shadow-md"
          : "border-black/10 bg-white text-jsd-black/60 hover:border-jsd-orange/50 hover:text-jsd-orange dark:border-white/10 dark:bg-white/5"
      )}
    >
      {label}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function EventsPage() {
  useDocumentMeta({
    title: "Eventos | JSD Alcochete",
    description: "Agenda de debates, formação e mobilização da Juventude Social Democrata de Alcochete.",
    keywords: "eventos JSD Alcochete, agenda, debates, formação"
  });

  const { events } = useApp();
  const [activeStatus, setActiveStatus] = useState("Todos");
  const [search, setSearch] = useState("");

  const safeEvents = Array.isArray(events) ? events.filter(Boolean) : [];

  // Collect unique statuses
  const statuses = ["Todos"];
  for (const ev of safeEvents) {
    if (ev.status && !statuses.includes(ev.status)) statuses.push(ev.status);
  }

  // Filter
  const filteredEvents = safeEvents.filter((ev) => {
    if (activeStatus !== "Todos" && ev.status !== activeStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle    = (ev.title    || "").toLowerCase().includes(q);
      const inLocation = (ev.location || "").toLowerCase().includes(q);
      const inSummary  = (ev.summary  || "").toLowerCase().includes(q);
      if (!inTitle && !inLocation && !inSummary) return false;
    }
    return true;
  });

  // Featured events (top row)
  const featuredEvents  = filteredEvents.filter((ev) => ev.featured);
  const regularEvents   = filteredEvents.filter((ev) => !ev.featured);
  const upcomingCount   = safeEvents.filter((ev) => ev.status === "Inscrições abertas").length;

  return (
    <>
      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-jsd-blue-dark via-[#1a2f5e] to-jsd-blue-dark py-28 text-white">
        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-jsd-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-jsd-orange/10 blur-3xl" />

        <div className="section-shell relative z-10">
          <ScrollReveal>
            <p className="eyebrow text-jsd-orange mb-5">Agenda Pública</p>
            <h1 className="font-display text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
              Eventos &{" "}
              <span className="text-jsd-orange">Iniciativas</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Debates, ações de terreno e momentos de participação da Juventude Social Democrata de Alcochete.
            </p>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <p className="text-4xl font-black text-jsd-orange">{safeEvents.length}</p>
                <p className="mt-1 text-sm text-white/60">eventos totais</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-4xl font-black text-jsd-orange">{upcomingCount}</p>
                <p className="mt-1 text-sm text-white/60">com inscrições abertas</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Search & Filters ─────────────────────────────────────────── */}
      <section className="section-shell pt-10 pb-0">
        <ScrollReveal>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-jsd-black/35" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="search"
                className="input pl-11"
                placeholder="Pesquisar por tema, local ou formato…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <FilterChip key={s} label={s} active={activeStatus === s} onClick={() => setActiveStatus(s)} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Events Grid ───────────────────────────────────────────────── */}
      <section className="section-shell">

        {/* Featured banner if any */}
        {featuredEvents.length > 0 && (
          <ScrollReveal className="mb-12">
            <p className="eyebrow mb-6">Em destaque</p>
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* All events */}
        {featuredEvents.length > 0 && regularEvents.length > 0 && (
          <p className="eyebrow mb-6">Mais eventos</p>
        )}

        {filteredEvents.length === 0 ? (
          <ScrollReveal>
            <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-dashed border-black/10 bg-white py-20 text-center dark:bg-white/5">
              <svg className="h-12 w-12 text-jsd-black/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <p className="text-lg font-semibold text-jsd-black/50">Sem eventos com estes critérios.</p>
              <button
                type="button"
                className="text-sm font-bold text-jsd-orange underline-offset-4 hover:underline"
                onClick={() => { setSearch(""); setActiveStatus("Todos"); }}
              >
                Limpar filtros
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(featuredEvents.length > 0 ? regularEvents : filteredEvents).map((ev) => (
              <ScrollReveal key={ev.id || Math.random()}>
                <EventCard event={ev} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

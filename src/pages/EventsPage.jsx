import { useState } from "react";

import { CinematicBanner } from "../components/CinematicBanner";
import { EventCard } from "../components/EventCard";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../services/helpers";

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

  const statuses = ["Todos"];
  for (const ev of safeEvents) {
    if (ev.status && !statuses.includes(ev.status)) statuses.push(ev.status);
  }

  const filteredEvents = safeEvents.filter((ev) => {
    if (activeStatus !== "Todos" && ev.status !== activeStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = (ev.title || "").toLowerCase().includes(q);
      const inLocation = (ev.location || "").toLowerCase().includes(q);
      const inSummary = (ev.summary || "").toLowerCase().includes(q);
      if (!inTitle && !inLocation && !inSummary) return false;
    }
    return true;
  });

  return (
    <div className="relative overflow-x-hidden">
      <CinematicBanner
        label="JSD Alcochete"
        titleLines={[
          { text: "Agenda pública", highlight: false },
          { text: "e momentos de", highlight: false },
          { text: "participação", highlight: true }
        ]}
        description="Consulta debates, ações de terreno e iniciativas da estrutura com uma apresentação institucional."
        image="/timeline_today.jpg"
        scrollTargetId="events-content"
      />

      <section id="events-content" className="section-shell pt-8 pb-20">
        <ScrollReveal>
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <input
                type="search"
                className="input"
                placeholder="Pesquisar por tema, local ou formato"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className={cn("chip", activeStatus === status && "chip-active")}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {filteredEvents.length === 0 ? (
          <ScrollReveal>
            <div className="border border-dashed border-white/10 py-20 text-center">
              <p className="text-base text-white/50">Sem eventos com estes critérios.</p>
              <button
                type="button"
                onClick={() => { setSearch(""); setActiveStatus("Todos"); }}
                className="mt-4 text-sm font-bold text-jsd-orange underline-offset-4 hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <ScrollReveal key={event.id || Math.random()}>
                <EventCard event={event} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

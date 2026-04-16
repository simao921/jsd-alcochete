import { useState } from "react";

import { Card } from "../components/Card";
import { EventCard } from "../components/EventCard";
import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../services/helpers";

export function EventsPage() {
  const { events, participateInEvent, pushNotification } = useApp();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [activeStatus, setActiveStatus] = useState("Todos");
  const [search, setSearch] = useState("");

  const safeEvents = Array.isArray(events) ? events : [];
  
  const statuses = ["Todos"];
  for (const ev of safeEvents) {
    if (ev?.status && !statuses.includes(ev.status)) {
      statuses.push(ev.status);
    }
  }

  const filteredEvents = safeEvents.filter((ev) => {
    if (!ev) return false;
    
    if (activeStatus !== "Todos" && ev.status !== activeStatus) {
      return false;
    }
    
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const titleMatch = ev.title && ev.title.toLowerCase().includes(q);
      const locMatch = ev.location && ev.location.toLowerCase().includes(q);
      const sumMatch = ev.summary && ev.summary.toLowerCase().includes(q);
      
      if (!titleMatch && !locMatch && !sumMatch) {
         return false;
      }
    }
    
    return true;
  });

  const handleParticipation = (eventId) => {
    if (!currentUser) {
      pushNotification("Entra na tua conta para confirmar participação.", "info");
      return;
    }
    participateInEvent(eventId, currentUser.id);
  };

  useDocumentMeta({
    title: "Eventos | JSD Alcochete",
    description: "Agenda de debates, formação e mobilização."
  });

  return (
    <>
      <PageBanner
        label="Eventos"
        title="Agenda pública e momentos de participação"
        description="Consulta debates, ações de terreno e iniciativas da estrutura com uma apresentação institucional."
      />

      <section className="section-shell pt-0">
        <ScrollReveal>
          <Card className="mb-8 border-black/5 bg-white shadow-sm">
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
          </Card>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <ScrollReveal key={event?.id || Math.random()}>
              <EventCard
                event={event}
                isLoggedIn={isAuthenticated}
                hasJoined={Boolean(currentUser?.participations?.includes(event?.id))}
                onParticipate={() => handleParticipation(event?.id)}
              />
            </ScrollReveal>
          ))}
          {filteredEvents.length === 0 && (
            <div className="col-span-full rounded-[1.5rem] bg-white p-10 text-center shadow-sm border border-black/5">
              <p className="text-lg font-medium text-jsd-black/60">Sem agenda disponível com estes critérios.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

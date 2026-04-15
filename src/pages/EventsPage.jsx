import { useDeferredValue, useMemo, useState } from "react";

import { Card } from "../components/Card";
import { EventCard } from "../components/EventCard";
import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn, normaliseText } from "../services/helpers";

export function EventsPage() {
  const { events, participateInEvent, pushNotification } = useApp();
  const { currentUser, isAuthenticated } = useAuth();
  const [activeStatus, setActiveStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const statuses = useMemo(() => ["Todos", ...new Set(events.map((event) => event.status))], [events]);
  const filteredEvents = useMemo(() => {
    const query = normaliseText(deferredSearch);

    return events.filter((event) => {
      const matchesStatus = activeStatus === "Todos" || event.status === activeStatus;
      const matchesSearch =
        !query ||
        normaliseText(event.title).includes(query) ||
        normaliseText(event.summary).includes(query) ||
        normaliseText(event.location).includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, deferredSearch, events]);

  const handleParticipation = (eventId) => {
    if (!currentUser) {
      pushNotification("Entra na tua conta para confirmar participação.", "info");
      return;
    }

    participateInEvent(eventId, currentUser.id);
  };

  useDocumentMeta({
    title: "Eventos | JSD Alcochete",
    description: "Agenda de debates, formação e mobilização da JSD Alcochete.",
    keywords: "eventos JSD Alcochete, debates, participação, formação política"
  });

  return (
    <>
      <PageBanner
        label="Eventos"
        title="Agenda pública e momentos de participação"
        description="Consulta debates, ações de terreno e iniciativas da estrutura com uma apresentação mais institucional e clara."
      />

      <section className="section-shell pt-0">
        <ScrollReveal>
          <Card className="mb-8 border-jsd-orange/12 bg-[#fff8ef]">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <input
                type="search"
                className="input"
                placeholder="Pesquisar por tema, local ou formato"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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
            <ScrollReveal key={event.id}>
              <EventCard
                event={event}
                isLoggedIn={isAuthenticated}
                hasJoined={Boolean(currentUser?.participations.includes(event.id))}
                onParticipate={() => handleParticipation(event.id)}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}

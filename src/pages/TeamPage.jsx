import { useMemo, useState } from "react";

import { MemberCard } from "../components/MemberCard";
import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../services/helpers";

export function TeamPage() {
  const { team } = useApp();
  const [activeGroup, setActiveGroup] = useState("Todos");

  const groups = useMemo(() => ["Todos", ...new Set(team.map((member) => member.group))], [team]);
  const filteredTeam = useMemo(
    () => (activeGroup === "Todos" ? team : team.filter((member) => member.group === activeGroup)),
    [activeGroup, team]
  );

  useDocumentMeta({
    title: "Equipa | JSD Alcochete",
    description: "Conhece a Comissão Política e a Mesa do Plenário da JSD Alcochete.",
    keywords: "equipa JSD Alcochete, comissão política, mesa do plenário"
  });

  return (
    <>
      <PageBanner
        label="Equipa"
        title="Estrutura política e órgãos do núcleo local"
        description="Conhece os responsáveis políticos da JSD Alcochete, organizados por órgão e com apresentação mais institucional."
      />

      <section className="section-shell pt-0">
        <ScrollReveal>
          <div className="mb-8 flex flex-wrap gap-3 rounded-[1.75rem] border border-jsd-orange/12 bg-[#fff8ef] p-4">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={cn("chip", activeGroup === group && "chip-active")}
              >
                {group}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeam.map((member) => (
            <ScrollReveal key={member.id}>
              <MemberCard member={member} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}

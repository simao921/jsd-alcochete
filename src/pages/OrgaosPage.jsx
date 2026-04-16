import { useMemo, useState } from "react";

import { MemberCard } from "../components/MemberCard";
import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../services/helpers";

export function OrgaosPage() {
  const { team } = useApp();
  const [activeGroup, setActiveGroup] = useState("Todos");

  const groups = useMemo(() => ["Todos", ...new Set(team.map((member) => member.group))], [team]);
  const filteredTeam = useMemo(
    () => (activeGroup === "Todos" ? team : team.filter((member) => member.group === activeGroup)),
    [activeGroup, team]
  );

  useDocumentMeta({
    title: "Os Nossos Órgãos | JSD Alcochete",
    description: "Conhece a responsabilidade dos órgãos locais da JSD e quem os compõe.",
    keywords: "órgãos JSD Alcochete, comissão política, mesa do plenário, estrutura política"
  });

  return (
    <>
      <PageBanner
        label="Os Nossos Órgãos"
        title="A força humana que desenha o caminho"
        description="Fica a conhecer o papel orgânico de cada secção e o rosto dos dirigentes ao leme de Alcochete."
      />

      <section className="section-shell pb-6 pt-0">
          <div className="grid gap-6 md:grid-cols-2 mb-12">
             <ScrollReveal className="bg-[#f0ece5] rounded-[2rem] p-8 border border-black/5 shadow-sm">
                <h3 className="font-display text-3xl font-bold text-jsd-blue-dark">Comissão Política</h3>
                <p className="mt-4 copy text-base md:text-lg">
                  Assume as rédeas executivas do núcleo, marcando a agenda, a comunicação perante a sociedade civil e elaborando ativamente a proposta diretiva estratégica. O centro do poder operante.
                </p>
             </ScrollReveal>
             <ScrollReveal className="bg-[#f0ece5] rounded-[2rem] p-8 border border-black/5 shadow-sm">
                <h3 className="font-display text-3xl font-bold text-jsd-blue-dark">Mesa do Plenário</h3>
                <p className="mt-4 copy text-base md:text-lg">
                  A nossa balança democrática. Este órgão garante os canais estritos de democracia interna, arbitrando, avaliando abertamente ou escrutinando todos os percursos da Comissão sob a lupa aberta dos militantes base.
                </p>
             </ScrollReveal>
          </div>
      </section>

      <section className="section-shell pt-0 pb-20">
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

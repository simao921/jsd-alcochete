import { Link } from "react-router-dom";

import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function EstruturasPage() {
  useDocumentMeta({
    title: "As Nossas Estruturas | JSD Alcochete",
    description: "Conhece as dinâmicas e o espaço físico e cívico da JSD Alcochete.",
    keywords: "estruturas, voluntariado, grupos, jsd, sede, atividades"
  });

  return (
    <>
      <PageBanner
        label="As Nossas Estruturas"
        title="Muito mais que uma sede partidária"
        description="Fica a conhecer o ecossistema ativo de iniciativas e espaços com que contamos para desenhar o futuro."
      />

      <section className="section-shell pt-4">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-start">
          <ScrollReveal className="space-y-6">
            <h2 className="font-display text-4xl font-bold text-jsd-blue-dark">Gente Pura Rumo à Mudança</h2>
            <p className="copy text-lg leading-relaxed">
              A JSD de Alcochete é, acima de tudo, um conjunto de pessoas inquietas, focadas e sempre dedicadas a encontrar e discutir soluções práticas para a nossa geração. Mais do que debates políticos, desenrolamos atividades reais.
            </p>
            <p className="copy text-lg leading-relaxed">
              Organizadas atividades culturais, recolhas focadas em apoio social, dinâmicas interativas e de networking desportivo até debates fundamentais em que a cidadania acontece, provamos sempre que a nossa acção não mora apenas no escrutínio partidário. Acontece nas ruas.
            </p>
            <div className="pt-8">
              <Link to="/junta-te" className="btn-primary px-8 py-4 text-base shadow-sm">
                Fazer parte da Causa
              </Link>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
             <div className="rounded-[2.5rem] bg-[#f0ece5] p-8 md:p-10 shadow-sm border border-jsd-orange/10">
                <h3 className="font-display text-3xl font-bold text-jsd-blue-dark mb-6">Em resumo</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 border-b border-black/5 pb-4">
                     <span className="flex-shrink-0 text-jsd-orange font-bold text-2xl">•</span>
                     <p className="font-medium text-jsd-black/80">Sede aberta onde podes colocar em prática as tuas ideias com os nossos meios.</p>
                  </li>
                  <li className="flex items-start gap-4 border-b border-black/5 pb-4">
                     <span className="flex-shrink-0 text-jsd-orange font-bold text-2xl">•</span>
                     <p className="font-medium text-jsd-black/80">Oportunidade para liderar causas filantrópicas ou ambientais usando a estrutura JSD.</p>
                  </li>
                  <li className="flex items-start gap-4">
                     <span className="flex-shrink-0 text-jsd-orange font-bold text-2xl">•</span>
                     <p className="font-medium text-jsd-black/80">Um grupo de amigos dispostos a quebrar a narrativa estagnada de Alcochete.</p>
                  </li>
                </ul>
             </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

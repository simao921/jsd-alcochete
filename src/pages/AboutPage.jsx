import { Link } from "react-router-dom";

import { BrandLogo } from "../components/BrandLogo";
import { Card } from "../components/Card";
import { ScrollReveal } from "../components/ScrollReveal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const sectionLinks = [
  { href: "#sobre-nos", label: "Sobre Nós" },
  { href: "#a-nossa-historia", label: "A Nossa História" },
  { href: "#os-nossos-orgaos", label: "Os Nossos Órgãos" },
  { href: "#as-nossas-estruturas", label: "As Nossas Estruturas" }
];

export function AboutPage() {
  useDocumentMeta({
    title: "Quem Somos? | JSD Alcochete",
    description: "Conhece a missão, história, órgãos e estruturas da JSD Alcochete.",
    keywords: "quem somos JSD Alcochete, história JSD, órgãos JSD, estruturas JSD"
  });

  return (
    <>
      <section className="overflow-hidden bg-[#fff8ef]">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <ScrollReveal className="space-y-7">
            <BrandLogo imageClassName="h-20 w-20 sm:h-24 sm:w-24" />
            <div className="space-y-5">
              <p className="eyebrow">Quem Somos?</p>
              <h1 className="headline">Uma equipa com garra, focada em resolver os verdadeiros problemas de Alcochete.</h1>
              <p className="copy text-lg">
                Somos a juventude do PSD, mas acima de tudo, uma força de mudança. Trabalhamos lado a lado com os jovens do concelho para propor melhorias, exigir mais e preparar uma nova geração de líderes locais.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {sectionLinks.map((item) => (
                <a key={item.href} href={item.href} className="btn-secondary">
                  {item.label}
                </a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <Card className="overflow-hidden border-jsd-orange/15 bg-gradient-to-br from-jsd-orange to-[#c56400] p-0 text-white">
              <div className="grid gap-6 p-8 md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">JSD Alcochete</p>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-jsd-orange">
                    Desde os anos 70
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="font-display text-5xl font-bold md:text-6xl">+ Liberdade</p>
                  <p className="font-display text-5xl font-bold md:text-6xl">+ Responsabilidade</p>
                  <p className="font-display text-5xl font-bold md:text-6xl">+ Futuro</p>
                </div>
                <p className="max-w-xl text-sm leading-7 text-white/78">
                  A nossa força vem da união. Quando ideias claras se juntam a uma grande equipa, é possível transformar a nossa terra e dar voz aos mais novos num mundo que tantas vezes nos ignora.
                </p>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-shell pt-8">
        <ScrollReveal>
          <Card className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
              <div className="border-b border-jsd-orange/10 bg-[#fff8ef] p-6 lg:border-b-0 lg:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-jsd-orange">Menu institucional</p>
                <div className="mt-5 grid gap-2">
                  {sectionLinks.map((item) => (
                    <a key={item.href} href={item.href} className="rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-jsd-blue-dark transition hover:bg-jsd-orange hover:text-white">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <div id="sobre-nos" className="scroll-mt-28 space-y-4 border-b border-jsd-orange/10 pb-10">
                  <p className="eyebrow">Sobre Nós</p>
                  <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Mais que um partido, uma causa</h2>
                  <p className="copy">
                    A JSD defende a liberdade, a oportunidade igual para todos e o mérito. O nosso objetivo em Alcochete é garantir que estas palavras saem do papel e se tornam em respostas aos problemas práticos: da habitação ao emprego, passando pela cultura e pelo desporto.
                  </p>
                </div>

                <div id="a-nossa-historia" className="scroll-mt-28 space-y-4 border-b border-jsd-orange/10 py-10">
                  <p className="eyebrow">A Nossa História</p>
                  <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Legado e irreverência</h2>
                  <p className="copy">
                    A JSD acompanhou a democracia e sempre esteve na linha da frente a quebrar tabus e a lutar pelo que parece impossível. O núcleo de Alcochete honra esse legado, misturando a experiência de quem já fez com a urgência de agir da nossa geração.
                  </p>
                </div>

                <div id="os-nossos-orgaos" className="scroll-mt-28 space-y-4 border-b border-jsd-orange/10 py-10">
                  <p className="eyebrow">Os Nossos Órgãos</p>
                  <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">A equipa no terreno</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="h-full !rounded-[1.5rem] bg-[#f0ece5]">
                      <h3 className="font-display text-2xl font-bold text-jsd-blue-dark">Comissão Política</h3>
                      <p className="mt-3 text-sm leading-7 text-jsd-black/72">
                        Responsável pela visão estratégica, agenda local, comunicação pública, mobilização e execução política do núcleo.
                      </p>
                    </Card>
                    <Card className="h-full !rounded-[1.5rem] bg-[#f0ece5]">
                      <h3 className="font-display text-2xl font-bold text-jsd-blue-dark">Mesa do Plenário</h3>
                      <p className="mt-3 text-sm leading-7 text-jsd-black/72">
                        Garante que todos têm voz, assegurando o debate aberto, democrático e saudável entre todos os membros.
                      </p>
                    </Card>
                  </div>
                </div>

                <div id="as-nossas-estruturas" className="scroll-mt-28 space-y-4 pt-10">
                  <p className="eyebrow">As Nossas Estruturas</p>
                  <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Muito mais que uma sede partidária</h2>
                  <p className="copy">
                    A JSD de Alcochete é um conjunto de pessoas inquietas, dedicadas a encontrar soluções para a nossa geração. Organizamos atividades culturais, desportivas e cívicas, provando que a política faz-se de várias maneiras e em contacto com a vida real. Falta cá a tua energia.
                  </p>
                  <div className="pt-4">
                    <Link to="/junta-te" className="btn-primary">
                      Tornar Militante
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </section>
    </>
  );
}

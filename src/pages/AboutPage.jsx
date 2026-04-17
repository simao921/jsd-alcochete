import { Link } from "react-router-dom";

import { BrandLogo } from "../components/BrandLogo";
import { Card } from "../components/Card";
import { ScrollReveal } from "../components/ScrollReveal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";



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
              <Link to="/orgaos" className="btn-secondary group">
                Conhecer a Equipa <span className="ml-2 group-hover:translate-x-1 transition-transform">-&gt;</span>
              </Link>
              <Link to="/estruturas" className="btn-secondary group">
                As Nossas Estruturas <span className="ml-2 group-hover:translate-x-1 transition-transform">-&gt;</span>
              </Link>
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
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">+</span>
                    <span className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-5xl">Liberdade</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">+</span>
                    <span className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-5xl">Responsabilidade</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">+</span>
                    <span className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-5xl">Futuro</span>
                  </div>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-white/80">
                  A nossa força vem da união. Quando ideias claras se juntam a uma grande equipa, é possível transformar a nossa terra e dar voz aos mais novos num mundo que tantas vezes nos ignora.
                </p>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-shell pt-10 pb-20">
        <ScrollReveal>
          <Card className="p-10 lg:p-16 border border-black/5 bg-white rounded-[2.5rem] shadow-sm">
            <div className="grid gap-16 lg:grid-cols-2">
              <div className="space-y-6">
                <p className="eyebrow">Sobre Nós</p>
                <h2 className="font-display text-4xl font-bold text-jsd-blue-dark">Mais que um partido, uma causa</h2>
                <p className="copy text-lg leading-relaxed">
                  A JSD defende a liberdade, a oportunidade igual para todos e o mérito. O nosso objetivo em Alcochete é garantir que estas palavras saem do papel e se tornam em respostas aos problemas práticos: da habitação ao emprego, passando pela cultura e pelo desporto.
                </p>
              </div>

              <div className="space-y-6">
                <p className="eyebrow">A Nossa História</p>
                <h2 className="font-display text-4xl font-bold text-jsd-blue-dark">Legado e irreverência</h2>
                <p className="copy text-lg leading-relaxed">
                  A JSD acompanhou a democracia e sempre esteve na linha da frente a quebrar tabus e a lutar pelo que parece impossível. O núcleo local honra esse enorme legado histórico ao misturar a experiência autárquica de quem já o fez com a urgência e energia jovem de intervir no terreno da nossa região.
                </p>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </section>
    </>
  );
}

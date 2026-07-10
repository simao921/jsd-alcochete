import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";

import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    title: "Sede Aberta",
    text: "Um espaço onde podes colocar em prática as tuas ideias com os nossos meios e apoio logístico."
  },
  {
    title: "Causas Reais",
    text: "Oportunidade para liderar iniciativas filantrópicas ou ambientais usando a estrutura JSD."
  },
  {
    title: "Comunidade Ativa",
    text: "Um grupo de amigos dispostos a quebrar a narrativa estagnada de Alcochete."
  }
];

export function EstruturasPage() {
  useDocumentMeta({
    title: "As Nossas Estruturas | JSD Alcochete",
    description: "Conhece as dinâmicas e o espaço físico e cívico da JSD Alcochete.",
    keywords: "estruturas, voluntariado, grupos, jsd, sede, atividades"
  });

  const prefersReducedMotion = useReducedMotion();
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.to(".estruturas-bg-text", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".estruturas-img", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, contentRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="relative overflow-x-hidden">
      <PageBanner
        label="As Nossas Estruturas"
        title="Muito mais que uma sede partidária"
        description="Fica a conhecer o ecossistema ativo de iniciativas e espaços com que contamos para desenhar o futuro."
      />

      <section ref={contentRef} className="section-shell pt-0">
        <div className="estruturas-bg-text absolute -left-10 top-0 font-display text-[18vw] font-black text-white/[0.02] tracking-tighter select-none pointer-events-none">
          ESTRUTURA
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-20 items-center relative z-10">
          <ScrollReveal className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-jsd-orange" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-jsd-orange">
                  GENTE PURA RUMO À MUDANÇA
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Um ecossistema de <span className="text-jsd-orange italic">ação real</span> nas ruas de Alcochete.
              </h2>
            </div>

            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-white/70">
              <p>
                A JSD de Alcochete é, acima de tudo, um conjunto de pessoas inquietas, focadas e sempre dedicadas a encontrar e discutir soluções práticas para a nossa geração. Mais do que debates políticos, desenrolamos atividades reais.
              </p>
              <p>
                Organizamos atividades culturais, recolhas focadas em apoio social, dinâmicas interativas e de networking desportivo até debates fundamentais em que a cidadania acontece. A nossa ação não mora apenas no escrutínio partidário — acontece nas ruas.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/junta-te" className="btn-primary gap-3 px-8 py-4 text-xs font-extrabold tracking-widest uppercase">
                Fazer parte da Causa
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal>
            <div ref={imageRef} className="relative">
              <div className="absolute -inset-4 rounded-2xl border border-jsd-orange/15 rotate-3 pointer-events-none" />
              <div className="estruturas-img relative overflow-hidden rounded-2xl border border-white/10 aspect-[4/5] shadow-2xl">
                <div
                  className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-1000"
                  style={{ backgroundImage: "url('/hero_cinematic.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0703] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-jsd-orange">ESPAÇO CÍVICO</span>
                  <p className="font-display font-bold text-xl text-white mt-1">Onde as ideias ganham forma</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative py-20 md:py-28 bg-[#0d0906] border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-jsd-orange/8 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <ScrollReveal className="text-center mb-14 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-jsd-orange">EM RESUMO</span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              O que nos <span className="text-jsd-orange">diferencia</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <ScrollReveal key={item.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 space-y-4 hover:border-jsd-orange/30 transition-colors duration-300"
                >
                  <span className="font-display text-3xl font-black text-jsd-orange/30 group-hover:text-jsd-orange/60 transition">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/65">{item.text}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";

import { MemberCard } from "../components/MemberCard";
import { PageBanner } from "../components/PageBanner";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../services/helpers";

gsap.registerPlugin(ScrollTrigger);

const orgaos = [
  {
    title: "Comissão Política",
    tag: "EXECUTIVO",
    description:
      "Assume as rédeas executivas do núcleo, marcando a agenda, a comunicação perante a sociedade civil e elaborando ativamente a proposta diretiva estratégica. O centro do poder operante."
  },
  {
    title: "Mesa do Plenário",
    tag: "DEMOCRACIA",
    description:
      "A nossa balança democrática. Este órgão garante os canais estritos de democracia interna, arbitrando, avaliando abertamente ou escrutinando todos os percursos da Comissão sob a lupa aberta dos militantes base."
  }
];

export function OrgaosPage() {
  const { team } = useApp();
  const [activeGroup, setActiveGroup] = useState("Todos");
  const prefersReducedMotion = useReducedMotion();
  const orgaosRef = useRef(null);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.to(".orgaos-bg-text", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: orgaosRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, orgaosRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="relative overflow-x-hidden">
      <PageBanner
        label="Os Nossos Órgãos"
        title="A força humana que desenha o caminho"
        description="Fica a conhecer o papel orgânico de cada secção e o rosto dos dirigentes ao leme de Alcochete."
      />

      <section ref={orgaosRef} className="section-shell pt-0 pb-6">
        <div className="orgaos-bg-text absolute -right-10 top-0 font-display text-[16vw] font-black text-white/[0.02] tracking-tighter select-none pointer-events-none">
          ÓRGÃOS
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12 relative z-10">
          {orgaos.map((orgao, i) => (
            <ScrollReveal key={orgao.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 space-y-5 hover:border-jsd-orange/25 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold tracking-widest text-jsd-orange/50 group-hover:text-jsd-orange transition">
                    0{i + 1}
                  </span>
                  <span className="rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-jsd-orange border border-jsd-orange/20 bg-jsd-orange/10 px-3 py-1">
                    {orgao.tag}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {orgao.title}
                </h3>
                <p className="text-base leading-relaxed text-white/65">{orgao.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section-shell pt-0 pb-20">
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
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
          {filteredTeam.map((member, i) => (
            <ScrollReveal key={member.id}>
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              >
                <MemberCard member={member} />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";

import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { applyHeroParallax } from "../services/parallax";

gsap.registerPlugin(ScrollTrigger);

export function AboutPage() {
  useDocumentMeta({
    title: "Quem Somos? | JSD Alcochete",
    description: "Conhece a missão, história, valores e o futuro da JSD Alcochete numa experiência imersiva.",
    keywords: "quem somos JSD Alcochete, história JSD, valores JSD, liberdade, Alcochete"
  });

  const prefersReducedMotion = useReducedMotion();
  
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroContentRef = useRef(null);
  const titleRef = useRef(null);
  const whoweareRef = useRef(null);
  const timelineTriggerRef = useRef(null);
  const timelineScrollRef = useRef(null);
  const valuesRef = useRef(null);

  // Active Value state for the editorial accordion
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    {
      num: "01",
      title: "LIBERDADE",
      tagline: "O poder da escolha individual",
      description: "Acreditamos na autonomia individual, na livre iniciativa e na liberdade de escolha para cada jovem traçar o seu destino sem amarras estatais.",
      image: "/hero_cinematic.jpg"
    },
    {
      num: "02",
      title: "JUSTIÇA SOCIAL",
      tagline: "Igualdade nas oportunidades de partida",
      description: "Garantir que o local onde nasces ou o teu contexto socioeconómico não limitam as tuas legítimas aspirações de progresso e mérito.",
      image: "/future_action.jpg"
    },
    {
      num: "03",
      title: "SOLIDARIEDADE",
      tagline: "Diálogo e respeito intergeracional",
      description: "Unir o futuro à experiência. Respeitar o legado dos nossos seniores e trabalhar em conjunto pela sustentabilidade dos sistemas sociais.",
      image: "/timeline_today.jpg"
    },
    {
      num: "04",
      title: "RESPONSABILIDADE",
      tagline: "Compromisso ético com o amanhã",
      description: "Ser jovem na política é assumir o compromisso de gerir os bens públicos de forma ética, sustentável, transparente e ecologicamente viável.",
      image: "/timeline_1974.jpg"
    },
    {
      num: "05",
      title: "INOVAÇÃO & REFORMA",
      tagline: "Audácia para reescrever as regras",
      description: "Questionar o status quo. Propor reformas estruturais para modernizar a economia local, simplificar processos e atrair novos investimentos.",
      image: "/future_action.jpg"
    },
    {
      num: "06",
      title: "EUROPEÍSMO",
      tagline: "Conectar Alcochete ao mundo",
      description: "Abraçar os valores humanistas europeus, promovendo a integração, a mobilidade estudantil e o intercâmbio de conhecimento internacional.",
      image: "/timeline_today.jpg"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // 1. Hero Title Mask Reveal (Text rising up out of invisible bounds)
      const letters = titleRef.current.querySelectorAll(".letter-reveal");
      gsap.fromTo(
        letters,
        { yPercent: 100, rotate: 3 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.6,
          stagger: 0.04,
          ease: "power4.out"
        }
      );

      applyHeroParallax(gsap, {
        heroEl: heroRef.current,
        imgEl: heroImgRef.current,
        contentEl: heroContentRef.current
      });

      // 2. Who We Are: Smooth vertical parallax elements
      gsap.to(".whoweare-bg-text", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: whoweareRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".whoweare-img-1", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: whoweareRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".whoweare-img-2", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: whoweareRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // 3. Horizontal Scroll Pinning with Window Parallax
      const timelineWidth = timelineScrollRef.current.scrollWidth;
      const windowWidth = window.innerWidth;

      const horizontalTween = gsap.to(timelineScrollRef.current, {
        x: () => -(timelineWidth - windowWidth),
        ease: "none",
        scrollTrigger: {
          trigger: timelineTriggerRef.current,
          pin: true,
          scrub: 0.5,
          start: "top top",
          end: () => `+=${timelineWidth - windowWidth}`,
          invalidateOnRefresh: true
        }
      });

      // Window-parallax effect for images inside the horizontal scroll
      const images = timelineScrollRef.current.querySelectorAll(".timeline-parallax-img");
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -15 },
          {
            xPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".timeline-card"),
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true
            }
          }
        );
      });

      // 4. Values Section: Background gradient scale on scroll
      gsap.to(".values-glow", {
        scale: 1.3,
        opacity: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, [prefersReducedMotion]);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="relative bg-[#080401] text-[#fffcf9] font-sans overflow-x-hidden selection:bg-jsd-orange selection:text-[#080401]">
      
      {/* BACKGROUND GRAPHIC NOISE & GRID LAYER */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* 1. HERO */}
      <section
        ref={heroRef}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#080401]"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={heroImgRef}
            className="absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
          >
            <img
              src="/hero_cinematic.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-[#080401] via-[#080401]/35 to-[#120a06]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff9900]/10 via-transparent to-[#ff7700]/6" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#080401] via-[#080401]/70 to-transparent" />
        </div>

        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[min(480px,75vw)] h-[min(300px,38vh)] rounded-full bg-jsd-orange/14 blur-[90px] pointer-events-none" />

        <div ref={heroContentRef} className="relative z-10 w-full max-w-6xl px-6 sm:px-10 flex flex-col items-center text-center space-y-7 will-change-transform">
          <div className="flex flex-col items-center gap-5">
            <img
              src="/jsd-logo.jpg"
              alt="JSD Alcochete"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-[3px] ring-jsd-orange/40 shadow-[0_0_40px_rgba(255,153,0,0.25)]"
            />
            <span className="eyebrow">JSD Alcochete</span>
          </div>

          <h1
            ref={titleRef}
            className="font-display text-5xl sm:text-7xl lg:text-[6.5rem] font-black uppercase tracking-tighter leading-[0.92] flex flex-col items-center"
          >
            <span className="overflow-hidden block py-1 h-[1.1em]">
              <span className="letter-reveal inline-block">Somos a</span>
            </span>
            <span className="overflow-hidden block py-1 h-[1.1em] text-jsd-orange">
              <span className="letter-reveal inline-block">geração que</span>
            </span>
            <span className="overflow-hidden block py-1 h-[1.1em]">
              <span className="letter-reveal inline-block">constrói</span>
            </span>
            <span className="overflow-hidden block py-1 h-[1.1em]">
              <span className="letter-reveal inline-block">o futuro.</span>
            </span>
          </h1>

          <p className="max-w-lg text-sm sm:text-base text-white/75 leading-relaxed rounded-2xl bg-black/35 backdrop-blur-md px-5 py-3 border border-white/10">
            Juventude Social Democrata de Alcochete — coragem, rigor e ação para moldar o concelho que merecemos.
          </p>

          <motion.button
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="group flex flex-col items-center gap-3 focus:outline-none pt-4"
            onClick={() => whoweareRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="text-[8px] uppercase tracking-[0.32em] font-bold text-white/55 group-hover:text-jsd-orange transition">
              Deslizar para iniciar
            </span>
            <div className="w-px h-12 bg-white/25 group-hover:bg-jsd-orange/60 transition relative overflow-hidden rounded-full">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-jsd-orange animate-scroll-down" />
            </div>
          </motion.button>
        </div>

        <div className="absolute bottom-0 left-0 w-full divider-orange z-10" />
      </section>

      {/* 2. MANIFESTO */}
      <section
        ref={whoweareRef}
        className="relative py-24 md:py-36 max-w-7xl mx-auto px-6 sm:px-12"
      >
        <div className="whoweare-bg-text absolute -left-16 top-6 font-display text-[20vw] font-black text-white/[0.025] tracking-tighter select-none pointer-events-none">
          MANIFESTO
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] items-center relative z-10">
          <div className="space-y-10">
            <div className="space-y-5">
              <span className="eyebrow">Quem Somos</span>
              <h2 className="section-title sm:text-5xl lg:text-6xl leading-tight">
                Uma comunidade focada em <span className="text-jsd-orange italic">desafiar o presente</span> e desenhar novas oportunidades.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <p className="copy leading-relaxed">
                Não somos uma juventude partidária de gabinete. A nossa força vem das ruas, das escolas, das coletividades e das tertúlias de Alcochete.
              </p>
              <p className="copy leading-relaxed">
                Trabalhamos de forma irreverente mas rigorosa. Da habitação ao ambiente, cada proposta visa criar as bases para viveres e venceres no teu concelho.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "1974", l: "Desde Abril" },
                { n: "50+", l: "Anos de história" },
                { n: "100%", l: "Compromisso local" }
              ].map((s) => (
                <div key={s.l} className="panel text-center">
                  <p className="font-display text-2xl sm:text-3xl font-black text-jsd-orange">{s.n}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/orgaos" className="btn-primary px-8 py-3.5 text-xs tracking-widest uppercase">
                Conhecer a Equipa
              </Link>
              <Link to="/estruturas" className="btn-secondary px-8 py-3.5 text-xs tracking-widest uppercase">
                A Nossa Estrutura
              </Link>
            </div>
          </div>

          <div className="relative h-[520px] sm:h-[580px]">
            <div className="absolute inset-[8%] rounded-3xl border border-jsd-orange/15 rotate-3 pointer-events-none" />
            <div className="whoweare-img-1 absolute left-0 top-0 w-[72%] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 z-20 shadow-2xl">
              <div className="h-full w-full bg-cover bg-center hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: "url('/hero_cinematic.jpg')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080401]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[10px] font-bold tracking-widest uppercase text-jsd-orange">Liderança</span>
                <p className="font-display font-bold text-lg text-white">Ação e Irreverência</p>
              </div>
            </div>
            <div className="whoweare-img-2 absolute right-0 bottom-0 w-[58%] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 z-10 shadow-xl">
              <div className="h-full w-full bg-cover bg-center hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: "url('/future_action.jpg')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080401]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[10px] font-bold tracking-widest uppercase text-jsd-orange">Compromisso</span>
                <p className="font-display font-bold text-lg text-white">Alcochete Unida</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY (Absurd Horizontal scroll with deep Parallax) */}
      <section 
        ref={timelineTriggerRef} 
        className={`relative ${prefersReducedMotion ? "" : "h-screen"} overflow-hidden bg-[#0d0906]`}
      >
        <div className={prefersReducedMotion ? "max-w-6xl mx-auto px-6 py-20" : "flex items-center h-full w-full"}>
          
          {prefersReducedMotion ? (
            // Static simple view for reduced motion
            <div className="space-y-16">
              <div className="text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-jsd-orange">A NOSSA HISTÓRIA</span>
                <h2 className="font-display text-4xl font-bold">Cronologia de Ação</h2>
              </div>
              <div className="grid gap-12 md:grid-cols-3">
                <div className="space-y-4 border border-white/10 p-6 bg-white/5">
                  <span className="font-display text-5xl font-black text-jsd-orange">1974/75</span>
                  <h3 className="text-xl font-bold">A Semente da Liberdade</h3>
                  <p className="text-white/70 text-sm">O despertar cívico com a Revolução dos Cravos. Jovens em Alcochete unem-se para formar as bases locais do movimento social-democrata.</p>
                </div>
                <div className="space-y-4 border border-white/10 p-6 bg-white/5">
                  <span className="font-display text-5xl font-black text-jsd-orange">1976</span>
                  <h3 className="text-xl font-bold">A Consolidação Cívica</h3>
                  <p className="text-white/70 text-sm">A fundação formal da organização nacional e a estruturação do núcleo de Alcochete na consolidação da democracia jovem.</p>
                </div>
                <div className="space-y-4 border border-white/10 p-6 bg-white/5">
                  <span className="font-display text-5xl font-black text-jsd-orange">Hoje</span>
                  <h3 className="text-xl font-bold">O Compromisso Continuado</h3>
                  <p className="text-white/70 text-sm">Lideramos o debate sobre habitação jovem, inovação, transição ecológica e atração de talento em Alcochete.</p>
                </div>
              </div>
            </div>
          ) : (
            // Full GSAP Horizontal Track
            <div ref={timelineScrollRef} className="flex h-full items-center pl-16 pr-[50vw] space-x-24">
              
              {/* Intro panel */}
              <div className="flex-shrink-0 w-[480px] space-y-6 pr-16 border-r border-white/10">
                <div className="flex items-center gap-3 text-jsd-orange">
                  <div className="w-6 h-[1px] bg-jsd-orange" />
                  <span className="text-xs font-bold uppercase tracking-widest">CRONOLOGIA</span>
                </div>
                <h3 className="font-display text-7xl font-black uppercase tracking-tighter leading-none">
                  A nossa <br/>jornada.
                </h3>
                <p className="text-white/60 text-base leading-relaxed">
                  Desliza horizontalmente para ver a história da JSD desenhar-se no tempo — da semente de Abril à liderança ativa local do presente.
                </p>
                <div className="flex items-center gap-3 text-jsd-orange font-bold text-xs uppercase tracking-widest animate-pulse pt-4">
                  <span>Deslizar para ver</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Chapter 1: 1974 */}
              <div className="timeline-card flex-shrink-0 w-[80vw] max-w-[850px] h-[70vh] flex items-center rounded-2xl bg-[#15110e] border border-white/10 overflow-hidden shadow-2xl relative group">
                <div className="w-1/2 h-full overflow-hidden relative">
                  <div 
                    className="timeline-parallax-img absolute inset-0 w-[130%] h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/timeline_1974.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#15110e]" />
                </div>
                <div className="w-1/2 p-16 space-y-6 flex flex-col justify-center">
                  <span className="font-display text-8xl font-black text-jsd-orange leading-none tracking-tighter select-none">1974</span>
                  <h4 className="font-display text-2xl font-bold uppercase tracking-tight text-white">A Semente da Liberdade</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Com a Revolução de 25 de abril de 1974, a juventude desperta para a cidadania ativa. Em Alcochete, reúnem-se os primeiros jovens dispostos a construir uma base sólida para a liberdade de pensamento e a social-democracia cívica.
                  </p>
                </div>
              </div>

              {/* Chapter 2: 1976 */}
              <div className="timeline-card flex-shrink-0 w-[80vw] max-w-[850px] h-[70vh] flex items-center rounded-2xl bg-[#15110e] border border-white/10 overflow-hidden shadow-2xl relative group">
                <div className="w-1/2 h-full overflow-hidden relative">
                  <div 
                    className="timeline-parallax-img absolute inset-0 w-[130%] h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/timeline_today.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#15110e]" />
                </div>
                <div className="w-1/2 p-16 space-y-6 flex flex-col justify-center">
                  <span className="font-display text-8xl font-black text-jsd-orange leading-none tracking-tighter select-none">1976</span>
                  <h4 className="font-display text-2xl font-bold uppercase tracking-tight text-white">A Consolidação Cívica</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    A JSD consolida-se formalmente no pós-revolução, definindo a sua autonomia e missão. O núcleo de Alcochete ganha dinamismo através de atividades desportivas, palestras públicas e a defesa corajosa das políticas educativas regionais.
                  </p>
                </div>
              </div>

              {/* Chapter 3: Hoje */}
              <div className="timeline-card flex-shrink-0 w-[80vw] max-w-[850px] h-[70vh] flex items-center rounded-2xl bg-[#15110e] border border-white/10 overflow-hidden shadow-2xl relative group">
                <div className="w-1/2 h-full overflow-hidden relative">
                  <div 
                    className="timeline-parallax-img absolute inset-0 w-[130%] h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/future_action.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#15110e]" />
                </div>
                <div className="w-1/2 p-16 space-y-6 flex flex-col justify-center">
                  <span className="font-display text-8xl font-black text-jsd-orange leading-none tracking-tighter select-none">HOJE</span>
                  <h4 className="font-display text-2xl font-bold uppercase tracking-tight text-white">Compromisso e Futuro</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    A juventude de Alcochete não assiste passivamente. Lideramos o debate autárquico com propostas concretas para habitação acessível, políticas ambientais rigorosas, atração cultural e fixação de talento jovem.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 4. VALUES SECTION (Interactive Editorial Accordion) */}
      <section 
        ref={valuesRef}
        className="relative py-32 md:py-48 max-w-7xl mx-auto px-6 sm:px-12 space-y-16"
      >
        {/* Floating background glowing orb */}
        <div className="values-glow absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 rounded-full bg-jsd-orange/10 blur-[120px] pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-8 items-end border-b border-white/10 pb-12 relative z-10">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-jsd-orange">VALORES FUNDAMENTAIS</span>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight">O que nos define.</h2>
          </div>
          <p className="text-white/60 text-lg max-w-lg md:text-right md:justify-self-end">
            Acreditamos na política como serviço comunitário transparente, baseando cada proposta nestes seis princípios éticos.
          </p>
        </div>

        {/* Editorial Accordion Layout */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 relative z-10 min-h-[500px]">
          {/* Accordion list */}
          <div className="flex flex-col border-t border-white/10">
            {values.map((v, i) => (
              <div 
                key={i}
                onMouseEnter={() => setActiveValue(i)}
                className="group border-b border-white/10 py-6 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className={`font-display text-sm font-bold tracking-widest transition-colors duration-300 ${activeValue === i ? "text-jsd-orange" : "text-white/40"}`}>
                      {v.num}
                    </span>
                    <h3 className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight transition-all duration-300 ${activeValue === i ? "text-jsd-orange translate-x-2" : "text-white group-hover:text-white/80"}`}>
                      {v.title}
                    </h3>
                  </div>
                  {/* Plus Icon that rotates on active */}
                  <motion.span 
                    animate={{ rotate: activeValue === i ? 45 : 0 }}
                    className={`text-xl font-light transition-colors duration-300 ${activeValue === i ? "text-jsd-orange" : "text-white/30"}`}
                  >
                    +
                  </motion.span>
                </div>

                {/* Expanding description container */}
                <motion.div
                  initial={false}
                  animate={{ height: activeValue === i ? "auto" : 0, opacity: activeValue === i ? 1 : 0 }}
                  className="overflow-hidden"
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                >
                  <div className="pl-12 pt-4 pb-2 space-y-2 max-w-xl">
                    <p className="text-jsd-orange/80 text-xs font-semibold uppercase tracking-widest">{v.tagline}</p>
                    <p className="text-white/70 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Accordion Dynamic Preview Image Block */}
          <div className="hidden lg:block relative h-full min-h-[450px] overflow-hidden border border-white/10">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: activeValue === i ? 0.6 : 0, scale: activeValue === i ? 1 : 1.05 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${v.image}')` }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080401] via-transparent to-transparent z-10" />
            <div className="absolute bottom-8 left-8 right-8 z-20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-jsd-orange">PREVIEW DO VALOR</span>
              <p className="font-display font-extrabold text-2xl tracking-tight text-white">
                {values[activeValue]?.title}
              </p>
              <p className="text-white/60 text-xs">{values[activeValue]?.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FUTURE SECTION & CTA (Premium & High-Contrast) */}
      <section className="relative py-48 bg-black overflow-hidden flex items-center min-h-[90vh]">
        {/* Background Image overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 scale-105"
          style={{ backgroundImage: "url('/future_action.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full grid md:grid-cols-[1.3fr_0.7fr] gap-16 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-jsd-orange border border-jsd-orange/20 bg-jsd-orange/10 px-4 py-2">
              MUDANÇA REAL
            </span>
            <h2 className="font-display text-5xl sm:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              O futuro não <br/>acontece por acaso.<br />
              <span className="text-jsd-orange italic">Constrói-se.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Não sejas apenas um espectador das transformações locais. Junta-te à força da juventude de Alcochete e escreve a tua própria página na construção do amanhã.
            </p>
          </div>

          <div className="flex md:justify-end">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/junta-te" 
                className="relative group inline-flex items-center justify-center rounded-full bg-jsd-orange text-black font-extrabold text-sm tracking-widest uppercase px-10 py-6 transition duration-300 hover:shadow-[0_0_50px_rgba(255,153,0,0.4)]"
              >
                Faz parte desta geração
                <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";

import { applyHeroParallax } from "../services/parallax";

gsap.registerPlugin(ScrollTrigger);

export function CinematicBanner({
  label,
  titleLines = [],
  description,
  image = "/hero_cinematic.jpg",
  fallbackImage = "/banner.jpg",
  scrollTargetId,
  height = "h-screen min-h-[640px]",
  children,
  compact = false
}) {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const letters = titleRef.current?.querySelectorAll(".letter-reveal");
      if (letters?.length) {
        gsap.fromTo(
          letters,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.6,
            stagger: 0.045,
            ease: "power4.out",
            delay: 0.2
          }
        );
      }

      applyHeroParallax(gsap, {
        heroEl: heroRef.current,
        imgEl: imgRef.current,
        contentEl: contentRef.current
      });
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleScrollDown = () => {
    if (scrollTargetId) {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const titleSize = compact
    ? "text-3xl sm:text-5xl lg:text-6xl"
    : "text-4xl sm:text-6xl lg:text-[5.25rem]";

  return (
    <section
      ref={heroRef}
      className={`relative ${height} w-full flex items-center justify-center overflow-hidden bg-[#080401]`}
    >
      {/* Camada de imagem — oversized para nunca cortar no parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={imgRef}
          className="absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        </div>
      </div>

      {/* Overlays fixos — não se movem com parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#080401] via-[#080401]/35 to-[#120a06]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff9900]/10 via-transparent to-[#ff7700]/6" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(8,4,1,0.3)_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jsd-orange/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#080401] via-[#080401]/70 to-transparent" />
      </div>

      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[min(480px,75vw)] h-[min(300px,38vh)] rounded-full bg-jsd-orange/14 blur-[90px] pointer-events-none" />

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-6xl px-6 sm:px-10 py-16 flex flex-col items-center text-center space-y-5 sm:space-y-7 will-change-transform"
      >
        {label && <span className="eyebrow">{label}</span>}

        <h1
          ref={titleRef}
          className={`font-display ${titleSize} font-black uppercase tracking-tighter leading-[0.94] flex flex-col items-center`}
        >
          {titleLines.map((line, i) => (
            <span
              key={i}
              className={`overflow-hidden block py-0.5 min-h-[1.05em] ${
                line.highlight ? "text-jsd-orange" : "text-[#fffcf9]"
              }`}
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              <span className="letter-reveal inline-block">{line.text}</span>
            </span>
          ))}
        </h1>

        {description && (
          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/85 font-sans tracking-normal normal-case rounded-2xl bg-black/35 backdrop-blur-md px-5 py-3.5 border border-white/10">
            {description}
          </p>
        )}

        {children && <div className="pt-1">{children}</div>}

        {!compact && (
          <motion.button
            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="group flex flex-col items-center gap-2.5 focus:outline-none pt-8"
            onClick={handleScrollDown}
            aria-label="Deslizar para o conteúdo"
          >
            <span className="text-[8px] uppercase tracking-[0.32em] font-bold text-white/55 group-hover:text-jsd-orange transition">
              Deslizar para explorar
            </span>
            <div className="w-px h-12 bg-white/25 group-hover:bg-jsd-orange/60 transition relative overflow-hidden rounded-full">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-jsd-orange animate-scroll-down" />
            </div>
          </motion.button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full divider-orange z-10" />
    </section>
  );
}

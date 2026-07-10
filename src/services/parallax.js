/** Parallax lento — só a imagem move, overlays fixos para não cortar. */
export const PARALLAX = {
  scrub: {
    slow: 3.2,
    medium: 2.4,
    fast: 1.6
  },
  movement: {
    image: 7,
    content: -28
  },
  imageScale: {
    from: 1.18,
    to: 1.14
  },
  scrollEnd: "+=130%"
};

export function heroScrollTrigger(trigger, extra = {}) {
  return {
    trigger,
    start: "top top",
    end: PARALLAX.scrollEnd,
    scrub: PARALLAX.scrub.slow,
    invalidateOnRefresh: true,
    ...extra
  };
}

/**
 * Aplica parallax só na camada de imagem — evita cortes no banner.
 */
export function applyHeroParallax(gsap, { heroEl, imgEl, contentEl }) {
  if (!heroEl || !imgEl) return;

  const scroll = heroScrollTrigger(heroEl);

  gsap.set(imgEl, { scale: PARALLAX.imageScale.to, transformOrigin: "center center" });

  gsap.fromTo(
    imgEl,
    { scale: PARALLAX.imageScale.from },
    { scale: PARALLAX.imageScale.to, duration: 3.2, ease: "power2.out" }
  );

  gsap.to(imgEl, {
    yPercent: PARALLAX.movement.image,
    ease: "none",
    scrollTrigger: { ...scroll, scrub: PARALLAX.scrub.slow }
  });

  if (contentEl) {
    gsap.to(contentEl, {
      y: PARALLAX.movement.content,
      opacity: 0.65,
      ease: "none",
      scrollTrigger: { ...scroll, scrub: PARALLAX.scrub.medium }
    });
  }
}

import { Link } from "react-router-dom";

import { navigationLinks, socialLinks } from "../data/seed";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-jsd-orange/10 bg-jsd-orange text-white dark:border-white/10 dark:bg-[#8a4500]">
      <div className="shell-container grid gap-12 py-14 lg:grid-cols-[1.15fr_0.9fr_0.9fr_0.95fr]">
        <div className="space-y-4">
          <BrandLogo textTone="light" imageClassName="h-14 w-14 sm:h-16 sm:w-16" />
          <p className="eyebrow !border-white/15 !bg-white/10 !text-white">Juventude Social Democrata</p>
          <h2 className="font-display text-3xl font-bold">JSD Alcochete</h2>
          <p className="max-w-xl text-sm leading-7 text-white/72">
            Organização política juvenil focada na participação cívica, formação democrática e mobilização jovem no concelho de Alcochete.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Navegação</p>
          <div className="mt-4 flex flex-col gap-3">
            {navigationLinks.map((item) => (
              <Link key={item.to} to={item.to} className="text-sm text-white/80 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Contacto</p>
          <div className="mt-4 flex flex-col gap-3">
            <span className="text-sm text-white/80">jsd.alcochete@exemplo.pt</span>
            <span className="text-sm text-white/80">+351 912 000 000</span>
            <span className="text-sm text-white/80">Alcochete, Setúbal</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Siga-nos</p>
          <div className="mt-4 flex flex-col gap-3">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="text-sm text-white/80 transition hover:text-white">
                {item.label}
              </a>
            ))}
            <span className="pt-4 text-sm text-white/55">© 2026 Juventude Social Democrata. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

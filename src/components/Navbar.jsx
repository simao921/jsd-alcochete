import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { navigationLinks } from "../data/seed";
import { cn } from "../services/helpers";
import { BrandLogo } from "./BrandLogo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { pathname } = useLocation();
  const aboutLinks = [
    { href: "/sobre", label: "Sobre Nós & História" },
    { href: "/orgaos", label: "Os Nossos Órgãos" },
    { href: "/estruturas", label: "As Nossas Estruturas" }
  ];
  const mainLinks = navigationLinks.filter((item) => item.to !== "/sobre");
  const homeLink = mainLinks.find((item) => item.to === "/");
  const otherLinks = mainLinks.filter((item) => item.to !== "/");

  useEffect(() => {
    setIsOpen(false);
    setIsAboutOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080401]/92 backdrop-blur-xl">
      <div className="shell-container flex h-[4.5rem] items-center justify-between gap-5">
        <Link to="/" className="min-w-0 max-w-[240px] shrink-0 text-white">
          <BrandLogo compact textTone="light" />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {homeLink && (
            <NavLink
              to={homeLink.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white/60 transition-all hover:bg-white/5 hover:text-white",
                  isActive && "bg-white/10 text-white"
                )
              }
            >
              {homeLink.label}
            </NavLink>
          )}

          <div 
            className="relative"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <button
              type="button"
              className="inline-flex cursor-default items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white/60 transition-all hover:bg-white/5 hover:text-white"
            >
              Quem Somos
              <span className={cn("transition-transform duration-300 text-[8px] text-white/40", isAboutOpen && "rotate-180")}>▼</span>
            </button>

            <div className={cn(
              "absolute left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2 w-64 overflow-hidden border border-white/10 bg-[#0c0600]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 origin-top",
              isAboutOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
            )}>
              <div className="p-2 space-y-1">
                {aboutLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsAboutOpen(false)}
                    className="block rounded-lg px-4 py-3 text-[12px] font-bold text-white/70 transition-all hover:bg-white/5 hover:text-jsd-orange hover:translate-x-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {otherLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white/60 transition-all hover:bg-white/5 hover:text-white",
                  isActive && "bg-white/10 text-white"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/junta-te" className="inline-flex items-center justify-center rounded-full bg-jsd-orange text-black font-extrabold text-[10px] tracking-widest uppercase h-9 px-5 hover:shadow-[0_0_30px_rgba(255,153,0,0.35)] transition duration-300">
            Junta-te a Nós
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center border border-white/10 bg-transparent text-white hover:bg-white/5 shadow-sm lg:hidden"
          aria-label="Abrir menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b border-white/10 bg-[#0c0600]/95 backdrop-blur-xl pb-6 pt-4 shadow-xl lg:hidden">
          <div className="shell-container flex flex-col gap-2">
            {homeLink && (
              <NavLink
                to={homeLink.to}
                className={({ isActive }) =>
                  cn(
                    "px-5 py-4 text-sm font-bold tracking-wider uppercase transition",
                    isActive ? "bg-jsd-orange text-black font-black" : "text-white/60 hover:bg-white/5"
                  )
                }
              >
                {homeLink.label}
              </NavLink>
            )}
            <div className="border border-white/10 bg-white/[0.02] p-2">
              <p className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-jsd-orange">Quem Somos</p>
              {aboutLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/5">
                  {item.label}
                </Link>
              ))}
            </div>
            {otherLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-5 py-4 text-sm font-bold tracking-wider uppercase transition",
                    isActive ? "bg-jsd-orange text-black font-black" : "text-white/60 hover:bg-white/5"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-4 px-2">
              <Link to="/junta-te" className="inline-flex items-center justify-center w-full rounded-full bg-jsd-orange text-black font-extrabold text-[12px] tracking-widest uppercase py-4">
                Junta-te a Nós
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

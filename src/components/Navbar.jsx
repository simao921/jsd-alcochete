import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { navigationLinks } from "../data/seed";
import { cn } from "../services/helpers";
import { BrandLogo } from "./BrandLogo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { pathname } = useLocation();
  const { currentUser, isAuthenticated, logout } = useAuth();
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
    <header className="sticky top-0 z-40 border-b-[3px] border-jsd-orange/80 bg-white/85 backdrop-blur-xl dark:border-white/5 dark:bg-jsd-blue-dark/85">
      <div className="shell-container flex h-20 items-center justify-between gap-6">
        <Link to="/" className="text-jsd-blue-dark dark:text-white">
          <BrandLogo imageClassName="h-10 w-10 sm:h-12 sm:w-12 shadow-none" textTone="dark" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {homeLink && (
            <NavLink
              to={homeLink.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-[13px] font-bold text-jsd-black/60 transition-all hover:bg-black/5 hover:text-jsd-blue-dark dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
                  isActive && "bg-black/5 text-jsd-blue-dark dark:bg-white/10 dark:text-white"
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
              className="inline-flex cursor-default items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-jsd-black/60 transition-all hover:bg-black/5 hover:text-jsd-blue-dark dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
            >
              Quem Somos
              <span className={cn("transition-transform duration-300 text-[10px]", isAboutOpen && "rotate-180")}>▼</span>
            </button>

            <div className={cn(
              "absolute left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2 w-64 overflow-hidden rounded-[1.25rem] border border-black/5 bg-white/95 backdrop-blur-xl shadow-xl transition-all duration-300 origin-top dark:border-white/10 dark:bg-jsd-blue-dark/95",
              isAboutOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
            )}>
              <div className="p-2 space-y-1">
                {aboutLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsAboutOpen(false)}
                    className="block rounded-xl px-4 py-3 text-[13px] font-bold text-jsd-black/70 transition-all hover:bg-jsd-light hover:text-jsd-orange hover:translate-x-1 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
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
                  "rounded-full px-4 py-2 text-[13px] font-bold text-jsd-black/60 transition-all hover:bg-black/5 hover:text-jsd-blue-dark dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
                  isActive && "bg-black/5 text-jsd-blue-dark dark:bg-white/10 dark:text-white"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/junta-te" className="btn-primary !h-10 !px-6 !text-[13px] !shadow-none">
            Junta-te a Nós
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-jsd-blue-dark shadow-sm lg:hidden dark:border-white/10 dark:bg-transparent dark:text-white"
          aria-label="Abrir menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b border-black/5 bg-white/95 backdrop-blur-xl pb-6 pt-4 shadow-xl lg:hidden dark:border-white/5 dark:bg-jsd-blue-dark/95">
          <div className="shell-container flex flex-col gap-2">
            {homeLink && (
              <NavLink
                to={homeLink.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-2xl px-5 py-4 text-sm font-bold transition",
                    isActive ? "bg-jsd-orange text-white" : "text-jsd-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
                  )
                }
              >
                {homeLink.label}
              </NavLink>
            )}
            <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-2 dark:border-white/5 dark:bg-white/[0.02]">
              <p className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-jsd-orange">Quem Somos</p>
              {aboutLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-bold text-jsd-black/70 transition hover:bg-white dark:text-white/70 dark:hover:bg-white/10">
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
                    "rounded-2xl px-5 py-4 text-sm font-bold transition",
                    isActive ? "bg-jsd-orange text-white" : "text-jsd-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-4 px-2">
              <Link to="/junta-te" className="btn-primary w-full shadow-none">
                Junta-te a Nós
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

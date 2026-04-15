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
    { href: "/sobre#sobre-nos", label: "Sobre Nós" },
    { href: "/sobre#a-nossa-historia", label: "A Nossa História" },
    { href: "/sobre#os-nossos-orgaos", label: "Os Nossos Órgãos" },
    { href: "/sobre#as-nossas-estruturas", label: "As Nossas Estruturas" }
  ];
  const mainLinks = navigationLinks.filter((item) => item.to !== "/sobre");
  const homeLink = mainLinks.find((item) => item.to === "/");
  const otherLinks = mainLinks.filter((item) => item.to !== "/");

  useEffect(() => {
    setIsOpen(false);
    setIsAboutOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-jsd-orange/10 bg-jsd-orange backdrop-blur dark:border-white/10 dark:bg-[#8a4500]">
      <div className="shell-container flex h-20 items-center justify-between gap-6">
        <Link to="/" className="text-white">
          <BrandLogo imageClassName="h-12 w-12 sm:h-14 sm:w-14" textTone="light" />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {homeLink && (
            <NavLink
              to={homeLink.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10",
                  isActive && "bg-white/14"
                )
              }
            >
              {homeLink.label}
            </NavLink>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAboutOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Quem Somos?
              <span className={cn("transition-transform duration-300 inline-block", !isAboutOpen && "rotate-180")}>⌃</span>
            </button>

            {isAboutOpen && (
              <div className="absolute left-0 top-[calc(100%+0.85rem)] w-80 overflow-hidden rounded-[1.5rem] border border-jsd-orange/10 bg-white shadow-panel">
                {aboutLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsAboutOpen(false)}
                    className="block border-b border-jsd-orange/10 px-6 py-5 text-sm font-medium tracking-[0.08em] text-jsd-blue-dark transition last:border-b-0 hover:bg-[#fff5e8]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {otherLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10",
                  isActive && "bg-white/14"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/junta-te" className="btn-secondary !border-white/20 !bg-white !px-8 !text-jsd-orange">
            Junta-te a Nós
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white lg:hidden"
          aria-label="Abrir menu"
        >
          {isOpen ? "×" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="shell-container pb-5 lg:hidden">
          <div className="surface-panel space-y-3 !rounded-[1.5rem] !border-jsd-orange/10 !bg-white p-4 text-jsd-blue-dark dark:!border-white/10 dark:!bg-[#3a2100] dark:text-white">
            {homeLink && (
              <NavLink
                to={homeLink.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive ? "bg-jsd-orange text-white dark:text-jsd-black" : "hover:bg-jsd-orange/10 dark:hover:bg-white/5"
                  )
                }
              >
                {homeLink.label}
              </NavLink>
            )}
            <div className="rounded-2xl border border-jsd-orange/10 bg-[#fff8ef] p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-jsd-orange">Quem Somos?</p>
              {aboutLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white">
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
                    "block rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive ? "bg-jsd-orange text-white dark:text-jsd-black" : "hover:bg-jsd-orange/10 dark:hover:bg-white/5"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex flex-1 items-center justify-end gap-2">
                <Link to="/junta-te" className="btn-primary">
                  Junta-te a Nós
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

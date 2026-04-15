import { NavLink, Outlet } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { BrandLogo } from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { cn } from "../services/helpers";

export function DashboardLayout({ children }) {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="section-shell pb-8">
        <div className="surface-panel overflow-hidden border-jsd-orange/12 p-0">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4 bg-jsd-orange p-8 text-white">
              <BrandLogo textTone="light" imageClassName="h-14 w-14 sm:h-16 sm:w-16" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/72">Área reservada</p>
                <h1 className="mt-3 font-display text-4xl font-bold">
                  {currentUser ? `Olá, ${currentUser.name.split(" ")[0]}.` : "A tua área política digital."}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78">
                  Gestão de participação, atividade e operação interna com linguagem visual mais institucional.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 p-8">
               {/* Menu interior limpo, focado só no admin */}
            </div>
          </div>
        </div>
      </section>
      <main className="shell-container pb-20">{children ?? <Outlet />}</main>
    </div>
  );
}

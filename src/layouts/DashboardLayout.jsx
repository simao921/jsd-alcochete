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
      <section className="border-b border-black/5 bg-white shadow-sm dark:border-white/5 dark:bg-jsd-blue-dark">
        <div className="shell-container flex flex-col md:flex-row md:items-center justify-between gap-6 py-8">
           <div className="flex items-center gap-5">
              <BrandLogo imageClassName="h-10 w-10 sm:h-12 sm:w-12" textTone="dark" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-jsd-orange">JSD Dashboard</p>
                <h1 className="mt-1 font-display text-2xl font-black text-jsd-blue-dark dark:text-white">
                  {currentUser ? `Bem-vindo, ${currentUser.name.split(" ")[0]}` : "Área Reservada"}
                </h1>
              </div>
           </div>
        </div>
      </section>
      <main className="shell-container pt-8 pb-20">{children ?? <Outlet />}</main>
    </div>
  );
}

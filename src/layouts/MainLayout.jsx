import { Outlet } from "react-router-dom";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080401] text-[#fffcf9]">
      {/* Cinematic glows */}
      <div className="pointer-events-none fixed inset-0 opacity-50 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,153,0,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,153,0,0.04),transparent_55%)]" />
      </div>
      
      {/* Noise background overlay globally */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10">
        <Navbar />
        <main>{children ?? <Outlet />}</main>
        <Footer />
      </div>
    </div>
  );
}

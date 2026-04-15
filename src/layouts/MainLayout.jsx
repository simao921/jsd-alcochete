import { Outlet } from "react-router-dom";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,153,0,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(0,51,160,0.14),transparent_30%)]" />
      </div>
      <div className="relative">
        <Navbar />
        <main>{children ?? <Outlet />}</main>
        <Footer />
      </div>
    </div>
  );
}

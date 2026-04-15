import { useEffect, useRef } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { NotificationContainer } from "./components/NotificationContainer";
import { useApp } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { MainLayout } from "./layouts/MainLayout";
import { ADMIN_SECRET_PATH, isAdminShortcutUnlocked, unlockAdminShortcut } from "./services/adminAccess";
import { AboutPage } from "./pages/AboutPage";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EventsPage } from "./pages/EventsPage";
import { HomePage } from "./pages/HomePage";
import { JoinPage } from "./pages/JoinPage";
import { NewsPage } from "./pages/NewsPage";
import { NewsArticlePage } from "./pages/NewsArticlePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TeamPage } from "./pages/TeamPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
}

function AdminShortcutListener() {
  const navigate = useNavigate();
  const { pushNotification } = useApp();
  const lastZeroPressRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!(event.ctrlKey && event.shiftKey)) {
        return;
      }

      if (event.key === "0") {
        lastZeroPressRef.current = Date.now();
        return;
      }

      if (event.key === "9" && Date.now() - lastZeroPressRef.current < 1800) {
        unlockAdminShortcut();
        pushNotification("Painel de gestão desbloqueado.", "success");
        navigate(ADMIN_SECRET_PATH);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, pushNotification]);

  return null;
}

function PublicShell() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function PrivateShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function HiddenAdminPage() {
  if (!isAdminShortcutUnlocked()) {
    return <NotFoundPage />;
  }

  return (
    <DashboardLayout>
      <AdminPage />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AdminShortcutListener />
      <Routes>
        <Route element={<PublicShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/equipa" element={<TeamPage />} />
          <Route path="/noticias" element={<NewsPage />} />
          <Route path="/noticias/:id" element={<NewsArticlePage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/junta-te" element={<JoinPage />} />
        </Route>
        <Route path="/admin" element={<NotFoundPage />} />
        <Route path={ADMIN_SECRET_PATH} element={<HiddenAdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <NotificationContainer />
    </>
  );
}

import { Link } from "react-router-dom";

import { Card } from "../components/Card";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { formatDateTime } from "../services/helpers";

export function DashboardPage() {
  const { currentUser, isAuthenticated, saveProfile } = useAuth();
  const { events } = useApp();

  useDocumentMeta({
    title: "Dashboard | JSD Alcochete",
    description: "Área de membros com perfil, pontos e atividade política.",
    keywords: "dashboard JSD Alcochete, pontos, membros"
  });

  if (!isAuthenticated || !currentUser) {
    return (
      <Card className="space-y-5">
        <p className="eyebrow">Acesso reservado</p>
        <h1 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Entra para aceder à área de membros</h1>
        <p className="copy">
          Faz login para acompanhar pontos, editar perfil e participar de forma organizada no trabalho político da JSD Alcochete.
        </p>
        <Link to="/login" className="btn-primary w-fit">
          Ir para login
        </Link>
      </Card>
    );
  }

  const joinedEvents = events.filter((event) => currentUser.participations.includes(event.id));

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    saveProfile({
      name: formData.get("name"),
      age: Number(formData.get("age")),
      motivation: formData.get("motivation")
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ScrollReveal>
          <Card className="space-y-6 border-jsd-orange/12">
            <div className="flex items-center gap-4">
              <img src={currentUser.avatar} alt={currentUser.name} className="h-20 w-20 rounded-[1.5rem] object-cover" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-jsd-orange">{currentUser.role === "admin" ? "Administrador" : "Membro"}</p>
                <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">{currentUser.name}</h2>
                <p className="mt-1 text-sm text-jsd-black/65 dark:text-white/65">{currentUser.email}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: currentUser.points, label: "pontos" },
                { value: currentUser.participations.length, label: "eventos" },
                { value: currentUser.activityLog.length, label: "ações registadas" }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] bg-[#fff8ef] p-4 text-center dark:bg-white/5">
                  <p className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="copy text-sm">{currentUser.motivation}</p>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <Card as="form" className="space-y-5 border-jsd-orange/12" onSubmit={handleProfileSubmit}>
            <div>
              <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Perfil</h2>
              <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">Atualiza os teus dados pessoais e a tua motivação política.</p>
            </div>
            <div className="field">
              <label htmlFor="profile-name" className="label">Nome</label>
              <input id="profile-name" name="name" defaultValue={currentUser.name} className="input" required />
            </div>
            <div className="field">
              <label htmlFor="profile-age" className="label">Idade</label>
              <input id="profile-age" name="age" type="number" min="14" max="35" defaultValue={currentUser.age} className="input" required />
            </div>
            <div className="field">
              <label htmlFor="profile-motivation" className="label">Motivação</label>
              <textarea id="profile-motivation" name="motivation" defaultValue={currentUser.motivation} className="textarea" required />
            </div>
            <button type="submit" className="btn-primary w-full">Guardar alterações</button>
          </Card>
        </ScrollReveal>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <ScrollReveal>
          <Card className="space-y-5 border-jsd-orange/12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Atividade recente</h2>
                <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">Cada participação soma credibilidade, experiência e impacto.</p>
              </div>
              <Link to="/eventos" className="btn-secondary">Explorar eventos</Link>
            </div>
            <div className="space-y-4">
              {currentUser.activityLog.map((activity) => (
                <div key={activity.id} className="rounded-[1.5rem] border border-jsd-orange/10 bg-[#fff8ef] p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-jsd-blue-dark dark:text-white">{activity.label}</p>
                    <span className="rounded-full bg-jsd-orange px-3 py-1 text-xs font-bold text-jsd-black">+{activity.points} pts</span>
                  </div>
                  <p className="mt-2 text-sm text-jsd-black/60 dark:text-white/60">{formatDateTime(activity.date)}</p>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="space-y-5 border-jsd-orange/12">
            <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Eventos inscritos</h2>
            <div className="space-y-4">
              {joinedEvents.length ? (
                joinedEvents.map((event) => (
                  <div key={event.id} className="rounded-[1.5rem] bg-[#fff8ef] p-4 dark:bg-white/5">
                    <p className="font-semibold text-jsd-blue-dark dark:text-white">{event.title}</p>
                    <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">{event.location}</p>
                    <p className="mt-1 text-sm text-jsd-black/55 dark:text-white/55">{formatDateTime(event.date)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-jsd-black/65 dark:text-white/65">Ainda não tens eventos inscritos. Explora a agenda e entra em campo.</p>
              )}
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {currentUser.role === "admin" && (
        <ScrollReveal>
          <Card className="space-y-4 border-jsd-orange/15 bg-[#fff8ef]">
            <p className="eyebrow">Acesso interno</p>
            <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Painel administrativo oculto</h2>
            <p className="text-sm leading-7 text-jsd-black/72 dark:text-white/72">
              O painel interno não está exposto por rota pública. Para abrir, usa o atalho <strong>Ctrl + Shift + 0</strong> e depois <strong>9</strong>.
            </p>
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
}

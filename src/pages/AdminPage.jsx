import { useMemo, useState } from "react";

import { Card } from "../components/Card";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { AdminSidebar } from "../layouts/AdminSidebar";
import { cn, formatDate, formatDateTime } from "../services/helpers";

// ─── Initial State ─────────────────────────────────────────────────────────
const newsInitial  = { title: "", category: "Atividades", excerpt: "", content: "", author: "", featured: false };
const eventInitial = { title: "", category: "Debate", date: "", location: "", summary: "", status: "Inscrições abertas", capacity: 30, featured: false };
const teamInitial  = { name: "", role: "", group: "Comissão Política", bio: "", email: "", photo: "" };
const memberInitial = { name: "", email: "", age: "", motivation: "", password: "", role: "member", points: 30 };

// ─── PDF Export ────────────────────────────────────────────────────────────
function exportToPDF(title, rows, columns) {
  const colWidths = columns.map(() => `${Math.floor(100 / columns.length)}%`).join("; ");
  const headerCells = columns.map((c) => `<th style="border:1px solid #ddd;padding:8px;background:#FF9900;color:#fff;text-align:left;font-size:12px">${c.label}</th>`).join("");
  const bodyRows = rows.map((row) => {
    const cells = columns.map((c) => `<td style="border:1px solid #eee;padding:8px;font-size:11px;vertical-align:top">${row[c.key] ?? "—"}</td>`).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="pt-PT"><head><meta charset="UTF-8"/>
<title>${title}</title>
<style>body{font-family:Arial,sans-serif;padding:20px}h1{color:#1a2f5e;font-size:20px;margin-bottom:4px}p.meta{color:#888;font-size:11px;margin-bottom:16px}table{width:100%;border-collapse:collapse}@media print{button{display:none}}</style>
</head><body>
<h1>${title}</h1>
<p class="meta">Exportado em ${new Date().toLocaleString("pt-PT")} — JSD Alcochete</p>
<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>
<br/><button onclick="window.print()" style="background:#FF9900;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px">Imprimir / Guardar PDF</button>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) { alert("O browser bloqueou a janela popup. Permite popups para este site."); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 600);
}


// ─── Micro Components ─────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="border-b border-black/5 pb-6 dark:border-white/8">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-jsd-black/55 dark:text-white/55">{subtitle}</p>}
    </div>
  );
}

function FieldGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function ActionRow({ children }) {
  return <div className="flex flex-wrap gap-3 pt-2">{children}</div>;
}

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
    >
      Eliminar
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Inscrições abertas": "bg-emerald-50 text-emerald-700",
    "Brevemente": "bg-amber-50 text-amber-700",
    "Concluído": "bg-slate-100 text-slate-500",
    "Pendente": "bg-blue-50 text-blue-600",
    "Novo": "bg-blue-50 text-blue-600",
    "Em contacto": "bg-amber-50 text-amber-700",
    "Entrevista": "bg-purple-50 text-purple-700",
    "Convertido": "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={cn("inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest", styles[status] || "bg-jsd-orange/10 text-jsd-orange")}>
      {status || "—"}
    </span>
  );
}

function RequestMeta({ label, value }) {
  return (
    <div className="rounded-[1rem] bg-[#f9f8f6] px-4 py-3 dark:bg-white/5">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-jsd-orange">{label}</p>
      <p className="mt-1.5 text-sm text-jsd-black/72 dark:text-white/65">{value || "—"}</p>
    </div>
  );
}

// ─── Safe List Item ──────────────────────────────────────────────────────────
// Wraps each rendered item so one bad item never breaks the whole list.
function SafeItem({ children }) {
  try {
    return children;
  } catch {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-500">
        Erro ao renderizar este item. Dados inválidos na base de dados.
      </div>
    );
  }
}

// ─── Stats Panel ─────────────────────────────────────────────────────────────
function StatCard({ label, value, colour = "orange" }) {
  const ring = colour === "orange" ? "ring-jsd-orange/20 text-jsd-orange" : "ring-jsd-blue-dark/20 text-jsd-blue-dark dark:text-white dark:ring-white/20";
  return (
    <div className={cn("flex flex-col gap-1 rounded-2xl border border-transparent bg-white px-6 py-5 ring-1 shadow-sm dark:bg-white/5", ring)}>
      <span className="text-3xl font-black">{value}</span>
      <span className="text-xs font-medium text-jsd-black/50 dark:text-white/45">{label}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function AdminPage() {
  const {
    news, events, team, members, joinRequests,
    createNews, updateNews, deleteNews,
    createEvent, updateEvent, deleteEvent,
    createTeamMember, updateTeamMember, deleteTeamMember,
    registerMember, updateMember, deleteMember,
    updateJoinRequestStatus
  } = useApp();
  const { currentUser, isAdmin } = useAuth();

  const [activeSection, setActiveSection] = useState("news");
  const [newsForm, setNewsForm]     = useState(newsInitial);
  const [eventForm, setEventForm]   = useState(eventInitial);
  const [teamForm, setTeamForm]     = useState(teamInitial);
  const [memberForm, setMemberForm] = useState(memberInitial);
  const [editingIds, setEditingIds] = useState({ news: null, event: null, team: null, member: null });
  const [viewingRequestId, setViewingRequestId] = useState(null);
  const [managingParticipantsId, setManagingParticipantsId] = useState(null);
  const [draftParticipants, setDraftParticipants] = useState([]);

  const openParticipants = (item) => {
    setManagingParticipantsId(item.id);
    setDraftParticipants(Array.isArray(item.participants) ? item.participants : []);
  };

  const toggleParticipant = (memberId) => {
    setDraftParticipants((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    );
  };

  const saveParticipants = () => {
    updateEvent(managingParticipantsId, { participants: draftParticipants });
    setManagingParticipantsId(null);
  };

  // ─── Convert Request → Member ────────────────────────────────────────────
  const convertRequestToMember = (req) => {
    const password = Math.random().toString(36).slice(2, 10) + "Jsd!";
    registerMember({
      name: req.name || "",
      email: req.email || "",
      age: "",
      motivation: req.motivation || "",
      password,
      role: "member",
      points: 30,
    });
    updateJoinRequestStatus(req.id, "Convertido");
    alert(`Membro criado!\nEmail: ${req.email}\nPassword gerada: ${password}\n\nGuarda esta password para a partilhar com o novo membro.`);
  };

  useDocumentMeta({
    title: "Admin | JSD Alcochete",
    description: "Painel administrativo da JSD Alcochete.",
    keywords: "admin JSD Alcochete"
  });

  const requestStatuses = useMemo(() => ["Novo", "Em contacto", "Entrevista", "Convertido"], []);

  const resetEditing = (section) =>
    setEditingIds((c) => ({ ...c, [section]: null }));

  // ─── Form Handlers ──────────────────────────────────────────────────────
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const payload = { ...newsForm, featured: Boolean(newsForm.featured) };
    if (editingIds.news) { updateNews(editingIds.news, payload); resetEditing("news"); }
    else createNews(payload);
    setNewsForm(newsInitial);
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const payload = { ...eventForm, capacity: Number(eventForm.capacity), featured: Boolean(eventForm.featured) };
    if (editingIds.event) { updateEvent(editingIds.event, payload); resetEditing("event"); }
    else createEvent(payload);
    setEventForm(eventInitial);
  };

  const handleTeamSubmit = (e) => {
    e.preventDefault();
    if (editingIds.team) { updateTeamMember(editingIds.team, teamForm); resetEditing("team"); }
    else createTeamMember(teamForm);
    setTeamForm(teamInitial);
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    const payload = { ...memberForm, age: Number(memberForm.age), points: Number(memberForm.points) };
    if (editingIds.member) { updateMember(editingIds.member, payload); resetEditing("member"); }
    else registerMember(payload);
    setMemberForm(memberInitial);
  };

  // ─── Safe arrays ────────────────────────────────────────────────────────
  const safeNews    = Array.isArray(news)         ? news.filter(Boolean)         : [];
  const safeEvents  = Array.isArray(events)       ? events.filter(Boolean)       : [];
  const safeTeam    = Array.isArray(team)         ? team.filter(Boolean)         : [];
  const safeMembers = Array.isArray(members)      ? members.filter(Boolean)      : [];
  const safeReqs    = Array.isArray(joinRequests) ? joinRequests.filter(Boolean) : [];

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="min-w-0 space-y-6">

        {/* ══ OVERVIEW STATS ════════════════════════════════════════════════ */}
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Notícias"    value={safeNews.length}    colour="orange" />
            <StatCard label="Eventos"     value={safeEvents.length}  colour="orange" />
            <StatCard label="Membros"     value={safeMembers.length} colour="blue"   />
            <StatCard label="Pedidos"     value={safeReqs.length}    colour="blue"   />
          </div>
        </ScrollReveal>

        {/* ══ NOTÍCIAS ══════════════════════════════════════════════════════ */}
        {activeSection === "news" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 p-8 shadow-sm lg:p-10">
              <SectionHeader
                eyebrow="Gestão editorial"
                title="Criar e gerir notícias"
                subtitle="Publique e edite artigos que aparecem na secção de Notícias do site."
              />

              <form className="grid gap-4" onSubmit={handleNewsSubmit}>
                <FieldGroup label="Título">
                  <input className="input" placeholder="Ex: JSD Alcochete presente em…" value={newsForm.title}
                    onChange={(e) => setNewsForm((c) => ({ ...c, title: e.target.value }))} required />
                </FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup label="Categoria">
                    <select className="input" value={newsForm.category}
                      onChange={(e) => setNewsForm((c) => ({ ...c, category: e.target.value }))}>
                      <option>Atividades</option>
                      <option>Opinião</option>
                      <option>Comunicados</option>
                    </select>
                  </FieldGroup>
                  <FieldGroup label="Autor">
                    <input className="input" placeholder="Nome do autor" value={newsForm.author}
                      onChange={(e) => setNewsForm((c) => ({ ...c, author: e.target.value }))} required />
                  </FieldGroup>
                </div>
                <FieldGroup label="Excerto">
                  <textarea className="textarea" placeholder="Breve resumo para listas e redes sociais…" value={newsForm.excerpt}
                    onChange={(e) => setNewsForm((c) => ({ ...c, excerpt: e.target.value }))} required />
                </FieldGroup>
                <FieldGroup label="Conteúdo completo">
                  <textarea className="textarea min-h-[160px]" placeholder="Texto principal do artigo…" value={newsForm.content}
                    onChange={(e) => setNewsForm((c) => ({ ...c, content: e.target.value }))} required />
                </FieldGroup>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-[#fafafa] p-4 text-sm font-medium text-jsd-blue-dark dark:bg-white/5 dark:text-white">
                  <input type="checkbox" checked={newsForm.featured}
                    onChange={(e) => setNewsForm((c) => ({ ...c, featured: e.target.checked }))} />
                  Marcar como destaque (aparece em primeiro na home)
                </label>
                <ActionRow>
                  <button type="submit" className="btn-primary">
                    {editingIds.news ? "Guardar alterações" : "Publicar notícia"}
                  </button>
                  {editingIds.news && (
                    <button type="button" className="btn-secondary" onClick={() => { setNewsForm(newsInitial); resetEditing("news"); }}>
                      Cancelar edição
                    </button>
                  )}
                </ActionRow>
              </form>

              {/* List */}
              <div className="grid gap-3">
                {safeNews.length === 0 && (
                  <p className="p-4 text-sm text-jsd-black/45">Sem notícias publicadas. Começa por criar uma acima.</p>
                )}
                {safeNews.map((article) => (
                  <SafeItem key={article.id}>
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                      <div className="min-w-0 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-jsd-orange">{article.category}</p>
                        <h3 className="font-display text-xl font-bold leading-snug text-jsd-blue-dark line-clamp-1 dark:text-white">{article.title}</h3>
                        <p className="text-sm text-jsd-black/55 dark:text-white/50">{article.author}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button type="button" className="btn-secondary" onClick={() => { setNewsForm(article); setEditingIds((c) => ({ ...c, news: article.id })); }}>Editar</button>
                        <DeleteButton onClick={() => deleteNews(article.id)} />
                      </div>
                    </div>
                  </SafeItem>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {/* ══ EVENTOS ═══════════════════════════════════════════════════════ */}
        {activeSection === "events" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 p-8 shadow-sm lg:p-10">
              <SectionHeader
                eyebrow="Gestão de agenda"
                title="Criar e gerir eventos"
                subtitle="Adicione e actualize a agenda pública de eventos e iniciativas."
              />

              <form className="grid gap-4" onSubmit={handleEventSubmit}>
                <FieldGroup label="Título do evento">
                  <input className="input" placeholder="Ex: Debate sobre Habitação" value={eventForm.title}
                    onChange={(e) => setEventForm((c) => ({ ...c, title: e.target.value }))} required />
                </FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup label="Categoria">
                    <select className="input" value={eventForm.category}
                      onChange={(e) => setEventForm((c) => ({ ...c, category: e.target.value }))}>
                      <option>Debate</option>
                      <option>Formação</option>
                      <option>Terreno</option>
                    </select>
                  </FieldGroup>
                  <FieldGroup label="Data e hora">
                    <input className="input" type="datetime-local" value={eventForm.date}
                      onChange={(e) => setEventForm((c) => ({ ...c, date: e.target.value }))} required />
                  </FieldGroup>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup label="Local">
                    <input className="input" placeholder="Ex: Alcochete, Sala Municipal" value={eventForm.location}
                      onChange={(e) => setEventForm((c) => ({ ...c, location: e.target.value }))} required />
                  </FieldGroup>
                  <FieldGroup label="Capacidade máxima">
                    <input className="input" type="number" min="1" value={eventForm.capacity}
                      onChange={(e) => setEventForm((c) => ({ ...c, capacity: e.target.value }))} required />
                  </FieldGroup>
                </div>
                <FieldGroup label="Estado">
                  <select className="input" value={eventForm.status}
                    onChange={(e) => setEventForm((c) => ({ ...c, status: e.target.value }))}>
                    <option>Inscrições abertas</option>
                    <option>Brevemente</option>
                    <option>Concluído</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="Resumo">
                  <textarea className="textarea" placeholder="Breve descrição do evento…" value={eventForm.summary}
                    onChange={(e) => setEventForm((c) => ({ ...c, summary: e.target.value }))} required />
                </FieldGroup>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-[#fafafa] p-4 text-sm font-medium text-jsd-blue-dark dark:bg-white/5 dark:text-white">
                  <input type="checkbox" checked={eventForm.featured}
                    onChange={(e) => setEventForm((c) => ({ ...c, featured: e.target.checked }))} />
                  Marcar como destaque (aparece em primeiro na home e na agenda)
                </label>
                <ActionRow>
                  <button type="submit" className="btn-primary">
                    {editingIds.event ? "Guardar alterações" : "Criar evento"}
                  </button>
                  {editingIds.event && (
                    <button type="button" className="btn-secondary" onClick={() => { setEventForm(eventInitial); resetEditing("event"); }}>
                      Cancelar edição
                    </button>
                  )}
                </ActionRow>
              </form>

              {/* List */}
              <div className="grid gap-3">
                {safeEvents.length === 0 && (
                  <p className="p-4 text-sm text-jsd-black/45">Sem eventos criados. Adiciona o primeiro acima.</p>
                )}
                {safeEvents.map((item) => {
                  const dateStr = item.date ? new Date(item.date).toLocaleString("pt-PT") : "Sem data";
                  const enrolledIds = Array.isArray(item.participants) ? item.participants : [];
                  const isOpen = managingParticipantsId === item.id;
                  return (
                    <SafeItem key={item.id}>
                      <div className="rounded-[1.25rem] border border-black/5 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                        {/* Main row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge status={item.status} />
                              {item.featured && (
                                <span className="rounded-full bg-jsd-orange/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-jsd-orange">Destaque</span>
                              )}
                              <span className="rounded-full bg-jsd-blue-dark/8 px-2.5 py-0.5 text-[10px] font-bold text-jsd-blue-dark dark:bg-white/10 dark:text-white">
                                {enrolledIds.length} inscrito{enrolledIds.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <h3 className="font-display text-xl font-bold leading-snug text-jsd-blue-dark line-clamp-1 dark:text-white">{item.title || "Sem título"}</h3>
                            <p className="text-sm text-jsd-black/55 dark:text-white/50">
                              {dateStr} &bull; {item.location || "Sem local"}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                              type="button"
                              className={cn("btn-secondary", isOpen && "bg-jsd-orange/10 text-jsd-orange border-jsd-orange/30")}
                              onClick={() => isOpen ? setManagingParticipantsId(null) : openParticipants(item)}
                            >
                              {isOpen ? "Fechar" : "Inscrições"}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => {
                              const formDate = item.date && typeof item.date === "string" ? item.date.slice(0, 16) : "";
                              setEventForm({ ...item, date: formDate });
                              setEditingIds((c) => ({ ...c, event: item.id }));
                              setManagingParticipantsId(null);
                            }}>Editar</button>
                            <DeleteButton onClick={() => deleteEvent(item.id)} />
                          </div>
                        </div>

                        {/* Participants drawer */}
                        {isOpen && (
                          <div className="border-t border-black/5 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <p className="text-xs font-bold uppercase tracking-widest text-jsd-orange">Selecionar inscritos</p>
                            {safeMembers.length === 0 ? (
                              <p className="text-sm text-jsd-black/45">Sem membros registados. Adiciona membros primeiro.</p>
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {safeMembers.map((m) => (
                                  <label
                                    key={m.id}
                                    className={cn(
                                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition",
                                      draftParticipants.includes(m.id)
                                        ? "border-jsd-orange/40 bg-jsd-orange/5 font-semibold text-jsd-blue-dark"
                                        : "border-black/5 bg-[#fafafa] text-jsd-black/65 hover:border-jsd-orange/20"
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      className="accent-jsd-orange"
                                      checked={draftParticipants.includes(m.id)}
                                      onChange={() => toggleParticipant(m.id)}
                                    />
                                    <div className="min-w-0">
                                      <p className="truncate font-medium text-jsd-blue-dark">{m.name}</p>
                                      <p className="truncate text-xs text-jsd-black/45">{m.email}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-3 pt-1">
                              <button type="button" className="btn-primary" onClick={saveParticipants}>Guardar inscrições</button>
                              <button type="button" className="btn-secondary" onClick={() => setManagingParticipantsId(null)}>Cancelar</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </SafeItem>
                  );
                })}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {/* ══ EQUIPA ════════════════════════════════════════════════════════ */}
        {activeSection === "team" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 p-8 shadow-sm lg:p-10">
              <SectionHeader
                eyebrow="Órgãos internos"
                title="Gerir Equipa"
                subtitle="Adicione ou edite membros dos órgãos diretivos."
              />

              <form className="grid gap-4" onSubmit={handleTeamSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup label="Nome completo">
                    <input className="input" placeholder="Nome" value={teamForm.name}
                      onChange={(e) => setTeamForm((c) => ({ ...c, name: e.target.value }))} required />
                  </FieldGroup>
                  <FieldGroup label="Cargo">
                    <input className="input" placeholder="Ex: Presidente" value={teamForm.role}
                      onChange={(e) => setTeamForm((c) => ({ ...c, role: e.target.value }))} required />
                  </FieldGroup>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup label="Grupo">
                    <select className="input" value={teamForm.group}
                      onChange={(e) => setTeamForm((c) => ({ ...c, group: e.target.value }))}>
                      <option>Comissão Política</option>
                      <option>Conselho de Jurisdição</option>
                      <option>Mesa do Congresso</option>
                    </select>
                  </FieldGroup>
                  <FieldGroup label="Email">
                    <input className="input" type="email" placeholder="email@exemplo.com" value={teamForm.email}
                      onChange={(e) => setTeamForm((c) => ({ ...c, email: e.target.value }))} />
                  </FieldGroup>
                </div>
                <FieldGroup label="Biografia">
                  <textarea className="textarea" placeholder="Breve bio…" value={teamForm.bio}
                    onChange={(e) => setTeamForm((c) => ({ ...c, bio: e.target.value }))} />
                </FieldGroup>
                <FieldGroup label="URL da fotografia">
                  <input className="input" placeholder="https://…" value={teamForm.photo}
                    onChange={(e) => setTeamForm((c) => ({ ...c, photo: e.target.value }))} />
                </FieldGroup>
                <ActionRow>
                  <button type="submit" className="btn-primary">{editingIds.team ? "Guardar alterações" : "Adicionar membro"}</button>
                  {editingIds.team && (
                    <button type="button" className="btn-secondary" onClick={() => { setTeamForm(teamInitial); resetEditing("team"); }}>Cancelar</button>
                  )}
                </ActionRow>
              </form>

              <div className="grid gap-3">
                {safeTeam.length === 0 && <p className="p-4 text-sm text-jsd-black/45">Sem membros na equipa.</p>}
                {safeTeam.map((member) => (
                  <SafeItem key={member.id}>
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center gap-4">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-jsd-orange/20" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-jsd-orange/10 font-bold text-jsd-orange">
                            {(member.name || "?")[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-jsd-blue-dark dark:text-white">{member.name}</p>
                          <p className="text-sm text-jsd-black/55 dark:text-white/50">{member.role} &bull; {member.group}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary" onClick={() => { setTeamForm(member); setEditingIds((c) => ({ ...c, team: member.id })); }}>Editar</button>
                        <DeleteButton onClick={() => deleteTeamMember(member.id)} />
                      </div>
                    </div>
                  </SafeItem>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {/* ══ MEMBROS ═══════════════════════════════════════════════════════ */}
        {activeSection === "members" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 p-8 shadow-sm lg:p-10">
              <SectionHeader
                eyebrow="Gestão de militantes"
                title="Registar e gerir membros"
                subtitle="Crie contas de acesso para os militantes da estrutura."
              />

              <form className="grid gap-4" onSubmit={handleMemberSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup label="Nome"><input className="input" placeholder="Nome completo" value={memberForm.name} onChange={(e) => setMemberForm((c) => ({ ...c, name: e.target.value }))} required /></FieldGroup>
                  <FieldGroup label="Email"><input className="input" type="email" placeholder="email@exemplo.com" value={memberForm.email} onChange={(e) => setMemberForm((c) => ({ ...c, email: e.target.value }))} required /></FieldGroup>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FieldGroup label="Idade"><input className="input" type="number" min="14" max="35" value={memberForm.age} onChange={(e) => setMemberForm((c) => ({ ...c, age: e.target.value }))} required /></FieldGroup>
                  <FieldGroup label="Pontos iniciais"><input className="input" type="number" min="0" value={memberForm.points} onChange={(e) => setMemberForm((c) => ({ ...c, points: e.target.value }))} /></FieldGroup>
                  <FieldGroup label="Nível de acesso">
                    <select className="input" value={memberForm.role} onChange={(e) => setMemberForm((c) => ({ ...c, role: e.target.value }))}>
                      <option value="member">Membro</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </FieldGroup>
                </div>
                <FieldGroup label="Motivação">
                  <textarea className="textarea" placeholder="Motivo de interesse na JSD…" value={memberForm.motivation} onChange={(e) => setMemberForm((c) => ({ ...c, motivation: e.target.value }))} />
                </FieldGroup>
                {!editingIds.member && (
                  <FieldGroup label="Password">
                    <input className="input" type="password" placeholder="Mínimo 8 caracteres" value={memberForm.password} onChange={(e) => setMemberForm((c) => ({ ...c, password: e.target.value }))} required />
                  </FieldGroup>
                )}
                <ActionRow>
                  <button type="submit" className="btn-primary">{editingIds.member ? "Guardar alterações" : "Registar membro"}</button>
                  {editingIds.member && <button type="button" className="btn-secondary" onClick={() => { setMemberForm(memberInitial); resetEditing("member"); }}>Cancelar</button>}
                </ActionRow>
              </form>

              <div className="grid gap-3">
                {safeMembers.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => exportToPDF(
                        "Lista de Membros JSD Alcochete",
                        safeMembers.map((m) => ({
                          Nome: m.name,
                          Email: m.email,
                          Funcao: m.role === "admin" ? "Administrador" : "Membro",
                          Pontos: m.points,
                        })),
                        [
                          { label: "Nome", key: "Nome" },
                          { label: "Email", key: "Email" },
                          { label: "Função", key: "Funcao" },
                          { label: "Pontos", key: "Pontos" },
                        ]
                      )}
                    >
                      ↓ Exportar PDF
                    </button>
                  </div>
                )}
                {safeMembers.length === 0 && <p className="p-4 text-sm text-jsd-black/45">Sem membros registados.</p>}
                {safeMembers.map((m) => (
                  <SafeItem key={m.id}>
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                      <div>
                        <p className="font-bold text-jsd-blue-dark dark:text-white">{m.name}</p>
                        <p className="text-sm text-jsd-black/55 dark:text-white/50">{m.email} &bull; {m.role} &bull; {m.points} pts</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary" onClick={() => { setMemberForm({ ...m, password: "" }); setEditingIds((c) => ({ ...c, member: m.id })); }}>Editar</button>
                        <DeleteButton onClick={() => deleteMember(m.id)} />
                      </div>
                    </div>
                  </SafeItem>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {/* ══ PEDIDOS ═══════════════════════════════════════════════════════ */}
        {activeSection === "requests" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 p-8 shadow-sm lg:p-10">
              {!viewingRequestId ? (
                <>
                  <SectionHeader
                    eyebrow="Captação"
                    title="Pedidos de adesão"
                    subtitle="Processa os pedidos submetidos na página Junta-te."
                  />
                  {safeReqs.length > 0 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => exportToPDF(
                          "Lista de Pedidos de Adesão — JSD Alcochete",
                          safeReqs.map((r) => ({
                            Nome: r.name,
                            Email: r.email,
                            Telemovel: r.mobile,
                            Estado: r.status,
                            Distrito: r.district,
                            Conselho: r.council,
                          })),
                          [
                            { label: "Nome", key: "Nome" },
                            { label: "Email", key: "Email" },
                            { label: "Telemóvel", key: "Telemovel" },
                            { label: "Estado", key: "Estado" },
                            { label: "Distrito", key: "Distrito" },
                            { label: "Concelho", key: "Conselho" },
                          ]
                        )}
                      >
                        ↓ Exportar PDF
                      </button>
                    </div>
                  )}
                  <div className="grid gap-3">
                    {safeReqs.length === 0 && <p className="p-4 text-sm text-jsd-black/45">Ainda não há pedidos de adesão.</p>}
                    {safeReqs.map((req) => (
                      <SafeItem key={req.id}>
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                          <div className="space-y-1">
                            <p className="font-bold text-jsd-blue-dark dark:text-white">{req.name}</p>
                            <p className="text-sm text-jsd-black/55 dark:text-white/50">{req.email} &bull; {formatDateTime(req.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <StatusBadge status={req.status} />
                            <button type="button" className="btn-secondary whitespace-nowrap" onClick={() => setViewingRequestId(req.id)}>
                              Abrir processo →
                            </button>
                          </div>
                        </div>
                      </SafeItem>
                    ))}
                  </div>
                </>
              ) : (() => {
                const req = safeReqs.find((r) => r.id === viewingRequestId);
                if (!req) return <p className="p-4 text-sm text-jsd-black/45">Pedido não encontrado.</p>;
                return (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
                    <button onClick={() => setViewingRequestId(null)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-jsd-orange transition hover:text-jsd-blue-dark">
                      ← Voltar à lista
                    </button>

                    <div className="flex flex-wrap items-start justify-between gap-6 border-b border-black/8 pb-6">
                      <div>
                        <h2 className="font-display text-4xl font-black text-jsd-blue-dark dark:text-white">{req.name}</h2>
                        <p className="mt-2 text-lg text-jsd-black/55 dark:text-white/55">{req.email}</p>
                      </div>
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-jsd-black/45">Estado do processo</label>
                          <select className="input min-w-[180px]" value={req.status} onChange={(e) => updateJoinRequestStatus(req.id, e.target.value)}>
                            {requestStatuses.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        {req.status !== "Convertido" && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => convertRequestToMember(req)}
                          >
                            ✓ Converter para Membro
                          </button>
                        )}
                        {req.status === "Convertido" && (
                          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">✓ Já convertido</span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      <RequestMeta label="Cartão de cidadão" value={req.citizenCardNumber} />
                      <RequestMeta label="Data de nascimento" value={req.birthDate ? formatDate(req.birthDate) : ""} />
                      <RequestMeta label="Telemóvel" value={req.mobile} />
                      <RequestMeta label="Telefone" value={req.phone} />
                      <RequestMeta label="Morada" value={[req.street, req.doorNumber, req.floor].filter(Boolean).join(", ")} />
                      <RequestMeta label="Freguesia" value={req.parish} />
                      <RequestMeta label="Código postal" value={req.postalCode} />
                      <RequestMeta label="Concelho" value={req.council} />
                      <RequestMeta label="Distrito" value={req.district} />
                      <RequestMeta label="Estado profissional" value={req.professionalStatus} />
                      <RequestMeta label="Concelho de registo" value={req.registrationCouncil} />
                      <RequestMeta label="Referenciado por" value={req.referencedBy} />
                    </div>

                    {req.motivation && (
                      <div className="rounded-[1.25rem] border border-black/5 bg-[#f9f8f6] p-6 dark:bg-white/5">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-jsd-orange">Motivação</p>
                        <p className="text-sm leading-relaxed text-jsd-black/75 dark:text-white/70">{req.motivation}</p>
                      </div>
                    )}

                    {/* CC Documents */}
                    <div className="space-y-4 border-t border-black/8 pt-6">
                      <p className="text-sm font-semibold text-jsd-black/65 dark:text-white/55">Documentos de identificação anexados:</p>
                      <div className="flex flex-wrap gap-5">
                        {[
                          { label: "Frente do CC", name: req.documentFrontName, uri: req.documentFrontUri },
                          { label: "Verso do CC",  name: req.documentBackName,  uri: req.documentBackUri  }
                        ].map(({ label, name, uri }) => (
                          <div key={label} className="flex min-w-[200px] flex-col gap-3 rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm dark:bg-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-jsd-orange">{label}</p>
                            <p className="break-all font-mono text-xs text-jsd-black/55 dark:text-white/45">{name || "Não anexado"}</p>
                            {uri && (
                              <a href={uri} download={name} target="_blank" rel="noreferrer" className="btn-primary mt-auto text-center">
                                Ver / Baixar
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

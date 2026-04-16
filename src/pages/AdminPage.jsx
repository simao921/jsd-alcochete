import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Card } from "../components/Card";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { AdminSidebar } from "../layouts/AdminSidebar";
import { formatDate, formatDateTime } from "../services/helpers";

const newsInitial = {
  title: "",
  category: "Atividades",
  excerpt: "",
  content: "",
  author: "",
  featured: false
};

const eventInitial = {
  title: "",
  category: "Debate",
  date: "",
  location: "",
  summary: "",
  status: "Inscrições abertas",
  capacity: 30,
  featured: false
};

const teamInitial = {
  name: "",
  role: "",
  group: "Comissão Política",
  bio: "",
  email: "",
  photo: ""
};

const memberInitial = {
  name: "",
  email: "",
  age: "",
  motivation: "",
  password: "",
  role: "member",
  points: 30
};

function RequestMeta({ label, value }) {
  return (
    <div className="rounded-[1.25rem] bg-white/75 px-4 py-3 dark:bg-white/5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-jsd-orange">{label}</p>
      <p className="mt-2 text-sm text-jsd-black/72 dark:text-white/72">{value || "Não indicado"}</p>
    </div>
  );
}

export function AdminPage() {
  const {
    news,
    events,
    team,
    members,
    joinRequests,
    createNews,
    updateNews,
    deleteNews,
    createEvent,
    updateEvent,
    deleteEvent,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    registerMember,
    updateMember,
    deleteMember,
    updateJoinRequestStatus
  } = useApp();
  const { currentUser, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState("news");
  const [newsForm, setNewsForm] = useState(newsInitial);
  const [eventForm, setEventForm] = useState(eventInitial);
  const [teamForm, setTeamForm] = useState(teamInitial);
  const [memberForm, setMemberForm] = useState(memberInitial);
  const [editingIds, setEditingIds] = useState({ news: null, event: null, team: null, member: null });
  const [viewingRequestId, setViewingRequestId] = useState(null);

  useDocumentMeta({
    title: "Admin | JSD Alcochete",
    description: "Painel administrativo da JSD Alcochete com gestão de notícias, eventos, equipa e membros.",
    keywords: "admin JSD Alcochete, gestão, CRUD"
  });

  const requestStatuses = useMemo(() => ["Novo", "Em contacto", "Entrevista", "Convertido"], []);

  const resetEditing = (section) => {
    setEditingIds((current) => ({ ...current, [section]: null }));
  };

  const handleNewsSubmit = (event) => {
    event.preventDefault();
    if (editingIds.news) {
      updateNews(editingIds.news, { ...newsForm, featured: Boolean(newsForm.featured) });
      setNewsForm(newsInitial);
      resetEditing("news");
      return;
    }

    createNews({ ...newsForm, featured: Boolean(newsForm.featured) });
    setNewsForm(newsInitial);
  };

  const handleEventSubmit = (event) => {
    event.preventDefault();
    const payload = { ...eventForm, capacity: Number(eventForm.capacity), featured: Boolean(eventForm.featured) };

    if (editingIds.event) {
      updateEvent(editingIds.event, payload);
      setEventForm(eventInitial);
      resetEditing("event");
      return;
    }

    createEvent(payload);
    setEventForm(eventInitial);
  };

  const handleTeamSubmit = (event) => {
    event.preventDefault();

    if (editingIds.team) {
      updateTeamMember(editingIds.team, teamForm);
      setTeamForm(teamInitial);
      resetEditing("team");
      return;
    }

    createTeamMember(teamForm);
    setTeamForm(teamInitial);
  };

  const handleMemberSubmit = (event) => {
    event.preventDefault();
    const payload = { ...memberForm, age: Number(memberForm.age), points: Number(memberForm.points) };

    if (editingIds.member) {
      updateMember(editingIds.member, payload);
      setMemberForm(memberInitial);
      resetEditing("member");
      return;
    }

    registerMember(payload);
    setMemberForm(memberInitial);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="space-y-6">
        {activeSection === "news" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 shadow-md p-8 lg:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Gestão editorial</p>
                  <h2 className="mt-4 font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Criar e gerir notícias</h2>
                </div>
              </div>

              <form className="grid gap-4" onSubmit={handleNewsSubmit}>
                <input className="input" placeholder="Título" value={newsForm.title} onChange={(event) => setNewsForm((current) => ({ ...current, title: event.target.value }))} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <select className="input" value={newsForm.category} onChange={(event) => setNewsForm((current) => ({ ...current, category: event.target.value }))}>
                    <option>Atividades</option>
                    <option>Opinião</option>
                    <option>Comunicados</option>
                  </select>
                  <input className="input" placeholder="Autor" value={newsForm.author} onChange={(event) => setNewsForm((current) => ({ ...current, author: event.target.value }))} required />
                </div>
                <textarea className="textarea" placeholder="Excerto" value={newsForm.excerpt} onChange={(event) => setNewsForm((current) => ({ ...current, excerpt: event.target.value }))} required />
                <textarea className="textarea" placeholder="Conteúdo" value={newsForm.content} onChange={(event) => setNewsForm((current) => ({ ...current, content: event.target.value }))} required />
                <label className="flex items-center gap-3 text-sm font-medium text-jsd-blue-dark dark:text-white">
                  <input type="checkbox" checked={newsForm.featured} onChange={(event) => setNewsForm((current) => ({ ...current, featured: event.target.checked }))} />
                  Marcar como destaque
                </label>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">{editingIds.news ? "Atualizar notícia" : "Criar notícia"}</button>
                  {editingIds.news && <button type="button" className="btn-secondary" onClick={() => { setNewsForm(newsInitial); resetEditing("news"); }}>Cancelar edição</button>}
                </div>
              </form>

              <div className="grid gap-4">
                {news.map((article) => (
                  <div key={article.id} className="rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-jsd-orange">{article.category}</p>
                        <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">{article.title}</h3>
                        <p className="text-sm text-jsd-black/65 dark:text-white/65">{article.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary" onClick={() => { setNewsForm(article); setEditingIds((current) => ({ ...current, news: article.id })); }}>Editar</button>
                        <button type="button" className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600" onClick={() => deleteNews(article.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
                {news.length === 0 && <p className="text-sm text-jsd-black/50 p-4">Sem notícias publicadas. Começa por criar uma na secção acima.</p>}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {activeSection === "events" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 shadow-md p-8 lg:p-10">
              <div>
                <p className="eyebrow">Gestão de agenda</p>
                <h2 className="mt-4 font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Criar e gerir eventos</h2>
              </div>
              <form className="grid gap-4" onSubmit={handleEventSubmit}>
                <input className="input" placeholder="Título" value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <select className="input" value={eventForm.category} onChange={(event) => setEventForm((current) => ({ ...current, category: event.target.value }))}>
                    <option>Debate</option>
                    <option>Formação</option>
                    <option>Terreno</option>
                  </select>
                  <input className="input" type="datetime-local" value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Local" value={eventForm.location} onChange={(event) => setEventForm((current) => ({ ...current, location: event.target.value }))} required />
                  <input className="input" type="number" min="1" placeholder="Capacidade" value={eventForm.capacity} onChange={(event) => setEventForm((current) => ({ ...current, capacity: event.target.value }))} required />
                </div>
                <select className="input" value={eventForm.status} onChange={(event) => setEventForm((current) => ({ ...current, status: event.target.value }))}>
                  <option>Inscrições abertas</option>
                  <option>Brevemente</option>
                  <option>Concluído</option>
                </select>
                <textarea className="textarea" placeholder="Resumo" value={eventForm.summary} onChange={(event) => setEventForm((current) => ({ ...current, summary: event.target.value }))} required />
                <label className="flex items-center gap-3 text-sm font-medium text-jsd-blue-dark dark:text-white">
                  <input type="checkbox" checked={eventForm.featured} onChange={(event) => setEventForm((current) => ({ ...current, featured: event.target.checked }))} />
                  Marcar como destaque
                </label>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">{editingIds.event ? "Atualizar evento" : "Criar evento"}</button>
                  {editingIds.event && <button type="button" className="btn-secondary" onClick={() => { setEventForm(eventInitial); resetEditing("event"); }}>Cancelar edição</button>}
                </div>
              </form>

              <div className="grid gap-4">
                {Array.isArray(events) && events.map((item) => (
                  <div key={item?.id || Math.random()} className="rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-jsd-orange">{item?.status || "S/ Estado"}</p>
                        <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">{item?.title || "Sem Título"}</h3>
                        <p className="text-sm text-jsd-black/65 dark:text-white/65">{formatDateTime(item?.date)} • {item?.location || "Local não definido"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary" onClick={() => { setEventForm({ ...(item || {}), date: item?.date && typeof item.date === 'string' ? item.date.slice(0, 16) : "" }); setEditingIds((current) => ({ ...current, event: item?.id })); }}>Editar</button>
                        <button type="button" className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600" onClick={() => deleteEvent(item?.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!events || events.length === 0) && <p className="text-sm text-jsd-black/50 p-4">Sem agenda configurada. Adiciona eventos para aparecerem no calendário.</p>}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {activeSection === "team" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 shadow-md p-8 lg:p-10">
              <div>
                <p className="eyebrow">Estrutura política</p>
                <h2 className="mt-4 font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Editar equipa</h2>
              </div>
              <form className="grid gap-4" onSubmit={handleTeamSubmit}>
                <input className="input" placeholder="Nome" value={teamForm.name} onChange={(event) => setTeamForm((current) => ({ ...current, name: event.target.value }))} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Cargo" value={teamForm.role} onChange={(event) => setTeamForm((current) => ({ ...current, role: event.target.value }))} required />
                  <select className="input" value={teamForm.group} onChange={(event) => setTeamForm((current) => ({ ...current, group: event.target.value }))}>
                    <option>Comissão Política</option>
                    <option>Mesa do Plenário</option>
                  </select>
                </div>
                <input className="input" type="email" placeholder="Email" value={teamForm.email} onChange={(event) => setTeamForm((current) => ({ ...current, email: event.target.value }))} required />
                <input className="input" placeholder="URL ou data URI da foto" value={teamForm.photo} onChange={(event) => setTeamForm((current) => ({ ...current, photo: event.target.value }))} required />
                <textarea className="textarea" placeholder="Mini bio" value={teamForm.bio} onChange={(event) => setTeamForm((current) => ({ ...current, bio: event.target.value }))} required />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">{editingIds.team ? "Atualizar equipa" : "Adicionar elemento"}</button>
                  {editingIds.team && <button type="button" className="btn-secondary" onClick={() => { setTeamForm(teamInitial); resetEditing("team"); }}>Cancelar edição</button>}
                </div>
              </form>

              <div className="grid gap-4">
                {team.map((item) => (
                  <div key={item.id} className="rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-jsd-orange">{item.group}</p>
                        <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">{item.name}</h3>
                        <p className="text-sm text-jsd-black/65 dark:text-white/65">{item.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary" onClick={() => { setTeamForm(item); setEditingIds((current) => ({ ...current, team: item.id })); }}>Editar</button>
                        <button type="button" className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600" onClick={() => deleteTeamMember(item.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
                {team.length === 0 && <p className="text-sm text-jsd-black/50 p-4">Sem elementos de equipa. Popula a secção Adicionar elemento para completares a página Quem Somos.</p>}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {activeSection === "members" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 shadow-md p-8 lg:p-10">
              <div>
                <p className="eyebrow">Base de membros</p>
                <h2 className="mt-4 font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Ver e gerir membros</h2>
              </div>
              <form className="grid gap-4" onSubmit={handleMemberSubmit}>
                <input className="input" placeholder="Nome" value={memberForm.name} onChange={(event) => setMemberForm((current) => ({ ...current, name: event.target.value }))} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" type="email" placeholder="Email" value={memberForm.email} onChange={(event) => setMemberForm((current) => ({ ...current, email: event.target.value }))} required />
                  <input className="input" type="number" min="14" max="35" placeholder="Idade" value={memberForm.age} onChange={(event) => setMemberForm((current) => ({ ...current, age: event.target.value }))} required />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <select className="input" value={memberForm.role} onChange={(event) => setMemberForm((current) => ({ ...current, role: event.target.value }))}>
                    <option value="member">Membro</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input className="input" type="number" min="0" placeholder="Pontos" value={memberForm.points} onChange={(event) => setMemberForm((current) => ({ ...current, points: event.target.value }))} required />
                  <input className="input" type="password" placeholder="Password" value={memberForm.password} onChange={(event) => setMemberForm((current) => ({ ...current, password: event.target.value }))} required />
                </div>
                <textarea className="textarea" placeholder="Motivação" value={memberForm.motivation} onChange={(event) => setMemberForm((current) => ({ ...current, motivation: event.target.value }))} required />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">{editingIds.member ? "Atualizar membro" : "Criar membro"}</button>
                  {editingIds.member && <button type="button" className="btn-secondary" onClick={() => { setMemberForm(memberInitial); resetEditing("member"); }}>Cancelar edição</button>}
                </div>
              </form>

              <div className="grid gap-4">
                {members.map((member) => (
                  <div key={member.id} className="rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-jsd-orange">{member.role}</p>
                        <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">{member.name}</h3>
                        <p className="text-sm text-jsd-black/65 dark:text-white/65">{member.email} • {member.points} pontos</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary" onClick={() => { setMemberForm({ ...member, age: String(member.age), points: String(member.points) }); setEditingIds((current) => ({ ...current, member: member.id })); }}>Editar</button>
                        <button type="button" className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600" onClick={() => deleteMember(member.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
                {members.length === 0 && <p className="text-sm text-jsd-black/50 p-4">A tua base de dados está em branco.</p>}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {activeSection === "requests" && (
          <ScrollReveal>
            <Card className="space-y-8 border-black/5 shadow-md p-8 lg:p-10">
              {!viewingRequestId ? (
                <>
                  <div>
                    <p className="eyebrow">Captação</p>
                    <h2 className="mt-4 font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Pedidos para “Junta-te”</h2>
                  </div>
                  <div className="grid gap-4">
                    {joinRequests.map((request) => (
                      <div key={request.id} className="rounded-[1.25rem] flex items-center justify-between border border-black/5 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-white/5">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-bold text-jsd-blue-dark dark:text-white">{request.name}</h3>
                          <p className="text-sm text-jsd-black/60 dark:text-white/60">{request.email} • {formatDateTime(request.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold uppercase tracking-widest text-jsd-orange">{request.status}</span>
                          <button type="button" className="btn-secondary whitespace-nowrap" onClick={() => setViewingRequestId(request.id)}>
                            Abrir Processo &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                    {joinRequests.length === 0 && <p className="text-sm text-jsd-black/50 p-4">Ainda não há nenhum pedido de adesão.</p>}
                  </div>
                </>
              ) : (
                (() => {
                  const req = joinRequests.find((r) => r.id === viewingRequestId);
                  if (!req) return null;
                  return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <button onClick={() => setViewingRequestId(null)} className="text-sm font-bold text-jsd-orange hover:text-jsd-blue-dark transition-colors uppercase tracking-widest flex items-center gap-2">
                        &larr; Voltar à lista
                      </button>
                      
                      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-black/10 pb-6">
                        <div>
                          <h2 className="font-display text-4xl font-black text-jsd-blue-dark dark:text-white">{req.name}</h2>
                          <p className="text-jsd-black/60 dark:text-white/60 mt-2 text-lg">{req.email}</p>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <label className="text-xs font-bold uppercase tracking-widest text-jsd-black/50">Estado do Processo</label>
                          <select className="input" value={req.status} onChange={(event) => updateJoinRequestStatus(req.id, event.target.value)}>
                            {requestStatuses.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
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
                        <div className="rounded-[1.25rem] bg-black/[0.02] p-6 dark:bg-white/5 border border-black/5">
                          <p className="text-xs font-bold uppercase tracking-widest text-jsd-orange mb-3">Motivação</p>
                          <p className="text-sm leading-relaxed text-jsd-black/80 dark:text-white/80">{req.motivation}</p>
                        </div>
                      )}

                      <div className="flex flex-col gap-4 border-t border-black/10 pt-6">
                        <p className="text-sm font-semibold text-jsd-black/70">Documento de Identificação Anexado:</p>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs bg-jsd-black/5 px-3 py-2 rounded-lg">{req.documentName || "Sem documento"}</span>
                          {req.documentDataUri && (
                            <a 
                              href={req.documentDataUri} 
                              download={req.documentName} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn-primary"
                            >
                              Baixar / Ver Cartão
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </Card>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

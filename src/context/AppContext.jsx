import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { createAvatarPlaceholder, generateId, sortByNewest } from "../services/helpers";

const AppContext = createContext(null);

const sortContent = (items, key) => sortByNewest(items, key);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [team, setTeam] = useState([]);
  const [members, setMembers] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);

  // Fetch all data from Supabase DB on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [newsRes, eventsRes, teamRes, membersRes, joinRes] = await Promise.all([
          supabase.from("news").select("*").order("publishedAt", { ascending: false }),
          supabase.from("events").select("*").order("date", { ascending: false }),
          supabase.from("team").select("*"),
          supabase.from("members").select("*"),
          supabase.from("join_requests").select("*").order("createdAt", { ascending: false })
        ]);

        if (newsRes.data) setNews(newsRes.data);
        if (eventsRes.data) setEvents(eventsRes.data);
        if (teamRes.data) setTeam(teamRes.data);
        if (membersRes.data) setMembers(membersRes.data);
        if (joinRes.data) setJoinRequests(joinRes.data);
      } catch (err) {
        console.error("Erro a descarregar base de dados:", err);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (!notifications.length) return undefined;
    const timeout = window.setTimeout(() => {
      setNotifications((current) => current.slice(1));
    }, 3200);
    return () => window.clearTimeout(timeout);
  }, [notifications]);

  const pushNotification = (message, tone = "info") => {
    setNotifications((current) => [...current, { id: generateId("notice"), message, tone }]);
  };

  const toggleTheme = () => {};

  // -- NEWS --
  const createNews = async (payload) => {
    const item = { featured: false, publishedAt: new Date().toISOString(), ...payload };
    const { data, error } = await supabase.from("news").insert(item).select().single();
    if (error) { pushNotification("Erro a criar notícia", "error"); return null; }
    
    setNews((current) => sortContent([data, ...current], "publishedAt"));
    pushNotification("Notícia criada com sucesso.", "success");
    return data;
  };

  const updateNews = async (id, payload) => {
    const { error } = await supabase.from("news").update(payload).eq("id", id);
    if (!error) {
      setNews((current) => sortContent(current.map((item) => (item.id === id ? { ...item, ...payload } : item)), "publishedAt"));
      pushNotification("Notícia atualizada.", "success");
    }
  };

  const deleteNews = async (id) => {
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (!error) {
      setNews((current) => current.filter((item) => item.id !== id));
      pushNotification("Notícia removida.", "warning");
    }
  };

  const createEvent = async (payload) => {
    const item = { ...payload };
    const { data, error } = await supabase.from("events").insert(item).select().single();
    if (error) { 
      pushNotification("Erro da BD: " + error.message, "error"); 
      alert("ERRO SUPABASE: " + error.message);
      return null; 
    }

    setEvents((current) => sortContent([data, ...current], "date"));
    pushNotification("Evento criado com sucesso.", "success");
    return data;
  };

  const updateEvent = async (id, payload) => {
    const { error } = await supabase.from("events").update(payload).eq("id", id);
    if (!error) {
      setEvents((current) => sortContent(current.map((item) => (item.id === id ? { ...item, ...payload } : item)), "date"));
      pushNotification("Evento atualizado.", "success");
    }
  };

  const deleteEvent = async (id) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      setEvents((current) => current.filter((item) => item.id !== id));
      pushNotification("Evento removido.", "warning");
    }
  };

  // -- TEAM --
  const createTeamMember = async (payload) => {
    const { data, error } = await supabase.from("team").insert(payload).select().single();
    if (error) return null;
    
    setTeam((current) => [...current, data]);
    pushNotification("Elemento da equipa adicionado.", "success");
    return data;
  };

  const updateTeamMember = async (id, payload) => {
    const { error } = await supabase.from("team").update(payload).eq("id", id);
    if (!error) {
      setTeam((current) => current.map((item) => (item.id === id ? { ...item, ...payload } : item)));
      pushNotification("Equipa atualizada.", "success");
    }
  };

  const deleteTeamMember = async (id) => {
    const { error } = await supabase.from("team").delete().eq("id", id);
    if (!error) {
      setTeam((current) => current.filter((item) => item.id !== id));
      pushNotification("Elemento removido da equipa.", "warning");
    }
  };

  // -- JOIN REQUESTS --
  const submitJoinRequest = async (payload) => {
    const request = { status: "Pendente", ...payload };
    const { data, error } = await supabase.from("join_requests").insert(request).select().single();
    if (error) { pushNotification("Erro a submeter pedido.", "error"); return null; }

    setJoinRequests((current) => [data, ...current]);
    pushNotification("Recebemos o teu pedido. Vamos entrar em contacto em breve.", "success");
    return data;
  };

  const updateJoinRequestStatus = async (id, status) => {
    const { error } = await supabase.from("join_requests").update({ status }).eq("id", id);
    if (!error) {
      setJoinRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
      pushNotification("Estado do pedido atualizado no servidor.", "info");
    }
  };

  // -- MEMBERS --
  const registerMember = async (payload) => {
    const emailInUse = members.some((member) => member.email?.toLowerCase() === payload.email?.toLowerCase());
    if (emailInUse) return { ok: false, error: "Já existe uma conta com este email." };

    const member = { role: "member", points: 30, avatar: payload.avatar || createAvatarPlaceholder(payload.name), ...payload };
    const { data, error } = await supabase.from("members").insert(member).select().single();
    if (error) return { ok: false, error: "Erro na BD." };

    setMembers((current) => [data, ...current]);
    pushNotification("Membro registado na base de dados com sucesso.", "success");
    return { ok: true, member: data };
  };

  const updateMember = async (id, payload) => {
    const { error } = await supabase.from("members").update(payload).eq("id", id);
    if (!error) {
      setMembers((current) => current.map((member) => (member.id === id ? { ...member, ...payload } : member)));
      pushNotification("Perfil de membro atualizado na BD.", "success");
    }
  };

  const deleteMember = async (id) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) {
      setMembers((current) => current.filter((member) => member.id !== id));
      pushNotification("Membro removido da BD Principal.", "warning");
    }
  };

  const participateInEvent = () => { return { ok: false, error: "Modo avançado de evento em manutenção na migração." }; };

  const stats = useMemo(() => ({
    members: members.length, events: events.length, news: news.length,
    pendingRequests: joinRequests.filter((request) => request.status === "Pendente").length
  }), [events.length, joinRequests, members.length, news.length]);

  const value = useMemo(() => ({
    theme, toggleTheme, notifications, pushNotification,
    news, events, team, members, joinRequests, stats,
    createNews, updateNews, deleteNews,
    createEvent, updateEvent, deleteEvent,
    createTeamMember, updateTeamMember, deleteTeamMember,
    submitJoinRequest, updateJoinRequestStatus,
    registerMember, updateMember, deleteMember, participateInEvent
  }), [events, joinRequests, members, news, notifications, stats, team, theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp tem de ser usado dentro de AppProvider");
  return context;
};

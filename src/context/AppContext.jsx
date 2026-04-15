import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { seedData } from "../data/seed";
import { createAvatarPlaceholder, generateId, sortByNewest } from "../services/helpers";
import { ensureSeedData, readStorage, storageKeys, writeStorage } from "../services/storage";

const AppContext = createContext(null);

const sortContent = (items, key) => sortByNewest(items, key);

export function AppProvider({ children }) {
  ensureSeedData();

  const [theme, setTheme] = useState(() => readStorage(storageKeys.theme, "light"));
  const [notifications, setNotifications] = useState([]);
  const [news, setNews] = useState(() => readStorage(storageKeys.news, seedData.news));
  const [events, setEvents] = useState(() => readStorage(storageKeys.events, seedData.events));
  const [team, setTeam] = useState(() => readStorage(storageKeys.team, seedData.team));
  const [members, setMembers] = useState(() => readStorage(storageKeys.members, seedData.members));
  const [joinRequests, setJoinRequests] = useState(() => readStorage(storageKeys.joinRequests, seedData.joinRequests));

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => writeStorage(storageKeys.news, news), [news]);
  useEffect(() => writeStorage(storageKeys.events, events), [events]);
  useEffect(() => writeStorage(storageKeys.team, team), [team]);
  useEffect(() => writeStorage(storageKeys.members, members), [members]);
  useEffect(() => writeStorage(storageKeys.joinRequests, joinRequests), [joinRequests]);

  useEffect(() => {
    if (!notifications.length) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setNotifications((current) => current.slice(1));
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [notifications]);

  const pushNotification = (message, tone = "info") => {
    setNotifications((current) => [...current, { id: generateId("notice"), message, tone }]);
  };

  const toggleTheme = () => {
    // Modo escuro inativo.
  };

  const createNews = (payload) => {
    const item = {
      id: generateId("news"),
      featured: false,
      publishedAt: new Date().toISOString(),
      ...payload
    };

    setNews((current) => sortContent([item, ...current], "publishedAt"));
    pushNotification("Notícia criada com sucesso.", "success");
    return item;
  };

  const updateNews = (id, payload) => {
    setNews((current) =>
      sortContent(
        current.map((item) => (item.id === id ? { ...item, ...payload } : item)),
        "publishedAt"
      )
    );
    pushNotification("Notícia atualizada.", "success");
  };

  const deleteNews = (id) => {
    setNews((current) => current.filter((item) => item.id !== id));
    pushNotification("Notícia removida.", "warning");
  };

  const createEvent = (payload) => {
    const item = {
      id: generateId("event"),
      attendees: [],
      featured: false,
      ...payload
    };

    setEvents((current) => sortContent([item, ...current], "date"));
    pushNotification("Evento criado com sucesso.", "success");
    return item;
  };

  const updateEvent = (id, payload) => {
    setEvents((current) =>
      sortContent(
        current.map((item) => (item.id === id ? { ...item, ...payload } : item)),
        "date"
      )
    );
    pushNotification("Evento atualizado.", "success");
  };

  const deleteEvent = (id) => {
    setEvents((current) => current.filter((item) => item.id !== id));
    setMembers((current) =>
      current.map((member) => ({
        ...member,
        participations: member.participations.filter((eventId) => eventId !== id)
      }))
    );
    pushNotification("Evento removido.", "warning");
  };

  const createTeamMember = (payload) => {
    const item = { id: generateId("team"), ...payload };
    setTeam((current) => [...current, item]);
    pushNotification("Elemento da equipa adicionado.", "success");
    return item;
  };

  const updateTeamMember = (id, payload) => {
    setTeam((current) => current.map((item) => (item.id === id ? { ...item, ...payload } : item)));
    pushNotification("Equipa atualizada.", "success");
  };

  const deleteTeamMember = (id) => {
    setTeam((current) => current.filter((item) => item.id !== id));
    pushNotification("Elemento removido da equipa.", "warning");
  };

  const submitJoinRequest = (payload) => {
    const request = {
      id: generateId("join"),
      status: "Novo",
      createdAt: new Date().toISOString(),
      ...payload
    };

    setJoinRequests((current) => [request, ...current]);
    pushNotification("Recebemos o teu pedido. Vamos entrar em contacto em breve.", "success");
    return request;
  };

  const registerMember = (payload) => {
    const emailInUse = members.some((member) => member.email.toLowerCase() === payload.email.toLowerCase());

    if (emailInUse) {
      return { ok: false, error: "Já existe uma conta com este email." };
    }

    const member = {
      id: generateId("member"),
      role: "member",
      points: 30,
      joinedAt: new Date().toISOString(),
      participations: [],
      activityLog: [
        {
          id: generateId("activity"),
          label: "Registo na plataforma JSD Alcochete",
          points: 30,
          date: new Date().toISOString()
        }
      ],
      avatar: payload.avatar || createAvatarPlaceholder(payload.name),
      ...payload
    };

    setMembers((current) => [member, ...current]);
    setJoinRequests((current) =>
      current.map((request) =>
        request.email.toLowerCase() === payload.email.toLowerCase() ? { ...request, status: "Convertido" } : request
      )
    );
    pushNotification("Conta criada com sucesso. Bem-vindo à JSD Alcochete.", "success");
    return { ok: true, member };
  };

  const updateMember = (id, payload) => {
    setMembers((current) => current.map((member) => (member.id === id ? { ...member, ...payload } : member)));
    pushNotification("Perfil atualizado.", "success");
  };

  const deleteMember = (id) => {
    setMembers((current) => current.filter((member) => member.id !== id));
    setEvents((current) =>
      current.map((event) => ({
        ...event,
        attendees: event.attendees.filter((attendeeId) => attendeeId !== id)
      }))
    );
    pushNotification("Membro removido.", "warning");
  };

  const participateInEvent = (eventId, memberId) => {
    const targetEvent = events.find((event) => event.id === eventId);
    const targetMember = members.find((member) => member.id === memberId);

    if (!targetEvent || !targetMember) {
      return { ok: false, error: "Não foi possível concluir a inscrição." };
    }

    if (targetEvent.attendees.includes(memberId)) {
      return { ok: false, error: "Já estás inscrito neste evento." };
    }

    setEvents((current) =>
      current.map((event) => (event.id === eventId ? { ...event, attendees: [...event.attendees, memberId] } : event))
    );

    setMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? {
              ...member,
              points: member.points + 15,
              participations: [...member.participations, eventId],
              activityLog: [
                {
                  id: generateId("activity"),
                  label: `Inscrição no evento "${targetEvent.title}"`,
                  points: 15,
                  date: new Date().toISOString()
                },
                ...member.activityLog
              ]
            }
          : member
      )
    );

    pushNotification("Inscrição confirmada. A tua voz conta.", "success");
    return { ok: true };
  };

  const updateJoinRequestStatus = (id, status) => {
    setJoinRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
    pushNotification("Estado do pedido atualizado.", "info");
  };

  const stats = useMemo(
    () => ({
      members: members.length,
      events: events.length,
      news: news.length,
      pendingRequests: joinRequests.filter((request) => request.status === "Novo").length
    }),
    [events.length, joinRequests, members.length, news.length]
  );

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      notifications,
      pushNotification,
      news,
      events,
      team,
      members,
      joinRequests,
      stats,
      createNews,
      updateNews,
      deleteNews,
      createEvent,
      updateEvent,
      deleteEvent,
      createTeamMember,
      updateTeamMember,
      deleteTeamMember,
      submitJoinRequest,
      registerMember,
      updateMember,
      deleteMember,
      participateInEvent,
      updateJoinRequestStatus
    }),
    [events, joinRequests, members, news, notifications, stats, team, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp tem de ser usado dentro de AppProvider");
  }

  return context;
};

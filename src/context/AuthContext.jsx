import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useApp } from "./AppContext";
import { generateId, normaliseText } from "../services/helpers";
import { clearAdminShortcut } from "../services/adminAccess";
import { readStorage, removeStorage, storageKeys, writeStorage } from "../services/storage";

const AuthContext = createContext(null);

const createAvatar = (name) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF9900" />
          <stop offset="100%" stop-color="#A84F00" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="48" fill="url(#grad)"/>
      <circle cx="120" cy="90" r="44" fill="rgba(255,255,255,0.18)"/>
      <path d="M54 196c18-34 42-50 66-50s48 16 66 50" fill="rgba(255,255,255,0.12)"/>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="54" font-weight="700">${name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}</text>
    </svg>
  `)}`;

export function AuthProvider({ children }) {
  const { members, registerMember, updateMember, pushNotification } = useApp();
  const [currentUserId, setCurrentUserId] = useState(() => readStorage(storageKeys.session, null)?.userId ?? null);

  const currentUser = useMemo(
    () => members.find((member) => member.id === currentUserId) ?? null,
    [currentUserId, members]
  );

  useEffect(() => {
    if (!currentUserId) {
      removeStorage(storageKeys.session);
      return;
    }

    if (currentUser) {
      writeStorage(storageKeys.session, { userId: currentUser.id });
      return;
    }

    setCurrentUserId(null);
    removeStorage(storageKeys.session);
  }, [currentUser, currentUserId]);

  const login = (email, password) => {
    const user = members.find(
      (member) => normaliseText(member.email) === normaliseText(email) && member.password === password
    );

    if (!user) {
      return { ok: false, error: "Credenciais inválidas. Verifica email e palavra-passe." };
    }

    setCurrentUserId(user.id);
    pushNotification(`Sessão iniciada. Bem-vindo, ${user.name}.`, "success");
    return { ok: true, user };
  };

  const register = ({ name, email, age, motivation, password }) => {
    const response = registerMember({
      name,
      email,
      age: Number(age),
      motivation,
      password,
      avatar: createAvatar(name),
      activityLog: [{ id: generateId("activity"), label: "Conta criada", points: 30, date: new Date().toISOString() }]
    });

    if (!response.ok) {
      return response;
    }

    setCurrentUserId(response.member.id);
    return response;
  };

  const logout = () => {
    setCurrentUserId(null);
    removeStorage(storageKeys.session);
    clearAdminShortcut();
    pushNotification("Sessão terminada.", "info");
  };

  const saveProfile = (payload) => {
    if (!currentUser) {
      return;
    }

    updateMember(currentUser.id, payload);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isAdmin: currentUser?.role === "admin",
      login,
      register,
      logout,
      saveProfile
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth tem de ser usado dentro de AuthProvider");
  }

  return context;
};

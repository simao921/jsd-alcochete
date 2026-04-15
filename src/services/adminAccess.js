export const ADMIN_SHORTCUT_STORAGE_KEY = "jsd-admin-shortcut-unlocked";
export const ADMIN_SECRET_PATH = "/gestao-interna-ctrl-shift-09";

export const unlockAdminShortcut = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ADMIN_SHORTCUT_STORAGE_KEY, "true");
};

export const clearAdminShortcut = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_SHORTCUT_STORAGE_KEY);
};

export const isAdminShortcutUnlocked = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_SHORTCUT_STORAGE_KEY) === "true";
};

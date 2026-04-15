import { seedData } from "../data/seed";

export const storageKeys = {
  news: "jsd-alcochete-news-v2",
  events: "jsd-alcochete-events-v2",
  team: "jsd-alcochete-team-v2",
  members: "jsd-alcochete-members-v2",
  joinRequests: "jsd-alcochete-join-requests-v2",
  theme: "jsd-alcochete-theme",
  session: "jsd-alcochete-session"
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const safeParse = (rawValue, fallback) => {
  try {
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.error("Erro ao processar localStorage", error);
    return fallback;
  }
};

export const readStorage = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  return safeParse(window.localStorage.getItem(key), fallback);
};

export const writeStorage = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
};

export const ensureSeedData = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.localStorage.getItem(storageKeys.news)) {
    writeStorage(storageKeys.news, clone(seedData.news));
  }

  if (!window.localStorage.getItem(storageKeys.events)) {
    writeStorage(storageKeys.events, clone(seedData.events));
  }

  if (!window.localStorage.getItem(storageKeys.team)) {
    writeStorage(storageKeys.team, clone(seedData.team));
  }

  if (!window.localStorage.getItem(storageKeys.members)) {
    writeStorage(storageKeys.members, clone(seedData.members));
  }

  if (!window.localStorage.getItem(storageKeys.joinRequests)) {
    writeStorage(storageKeys.joinRequests, clone(seedData.joinRequests));
  }
};

import Constants from "expo-constants";

import { firebaseAuth } from "@/services/firebase/config";

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;

const resolveBaseUrl = () => {
  if (!apiBaseUrl) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL nao configurado.");
  }

  return apiBaseUrl.replace(/\/$/, "");
};

export const getApiUrl = (path: string) => `${resolveBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

export const apiRequest = async <T>(path: string, init: RequestInit = {}, requiresAuth = false): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (requiresAuth && firebaseAuth.currentUser) {
    const token = await firebaseAuth.currentUser.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path), {
    ...init,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "API request failed.");
  }

  return (await response.json()) as T;
};

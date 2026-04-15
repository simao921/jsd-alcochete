import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ThemePreference } from "@/types";

interface AppState {
  themePreference: ThemePreference;
  favoritePlanIds: string[];
  completedWorkoutIds: string[];
  completedExerciseIds: string[];
  hydrationMl: number;
  xp: number;
  streak: number;
  language: string;
  toggleTheme: () => void;
  setThemePreference: (theme: ThemePreference) => void;
  setLanguage: (language: string) => void;
  toggleFavoritePlan: (id: string) => void;
  toggleExerciseComplete: (id: string) => void;
  toggleWorkoutComplete: (id: string) => void;
  addWater: (ml: number) => void;
  addXp: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themePreference: "system",
      favoritePlanIds: [],
      completedWorkoutIds: [],
      completedExerciseIds: [],
      hydrationMl: 1400,
      xp: 840,
      streak: 12,
      language: "pt",
      toggleTheme: () =>
        set((state) => ({
          themePreference:
            state.themePreference === "dark"
              ? "light"
              : state.themePreference === "light"
                ? "system"
                : "dark"
        })),
      setThemePreference: (themePreference) => set({ themePreference }),
      setLanguage: (language) => set({ language }),
      toggleFavoritePlan: (id) =>
        set((state) => ({
          favoritePlanIds: state.favoritePlanIds.includes(id)
            ? state.favoritePlanIds.filter((planId) => planId !== id)
            : [...state.favoritePlanIds, id]
        })),
      toggleExerciseComplete: (id) =>
        set((state) => ({
          completedExerciseIds: state.completedExerciseIds.includes(id)
            ? state.completedExerciseIds.filter((exerciseId) => exerciseId !== id)
            : [...state.completedExerciseIds, id]
        })),
      toggleWorkoutComplete: (id) =>
        set((state) => ({
          completedWorkoutIds: state.completedWorkoutIds.includes(id)
            ? state.completedWorkoutIds.filter((workoutId) => workoutId !== id)
            : [...state.completedWorkoutIds, id]
        })),
      addWater: (ml) =>
        set((state) => ({
          hydrationMl: Math.max(0, state.hydrationMl + ml)
        })),
      addXp: (amount) =>
        set((state) => ({
          xp: state.xp + amount
        }))
    }),
    {
      name: "nutriai-app-store",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

import { create } from "zustand";

import type { ActivityLevel, Gender, Goal } from "@/types";

interface OnboardingState {
  step: number;
  age: string;
  weight: string;
  height: string;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryPreferences: string[];
  setStep: (step: number) => void;
  updateField: (field: keyof Omit<OnboardingState, "setStep" | "updateField" | "togglePreference" | "reset">, value: string | number | string[]) => void;
  togglePreference: (preference: string) => void;
  reset: () => void;
}

const initialState = {
  step: 0,
  age: "",
  weight: "",
  height: "",
  gender: "prefer-not" as Gender,
  goal: "maintain" as Goal,
  activityLevel: "moderate" as ActivityLevel,
  dietaryPreferences: [] as string[]
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  updateField: (field, value) => set({ [field]: value } as Partial<OnboardingState>),
  togglePreference: (preference) =>
    set((state) => ({
      dietaryPreferences: state.dietaryPreferences.includes(preference)
        ? state.dietaryPreferences.filter((item) => item !== preference)
        : [...state.dietaryPreferences, preference]
    })),
  reset: () => set(initialState)
}));

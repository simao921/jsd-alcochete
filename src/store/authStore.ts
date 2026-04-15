import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthMode, UserProfile } from "@/types";
import { mockUserProfile } from "@/utils/mockData";

type AuthStatus = "loading" | "guest" | "authenticated";

interface AuthState {
  status: AuthStatus;
  authMode: AuthMode;
  hasCompletedOnboarding: boolean;
  userProfile: UserProfile | null;
  firebaseUid: string | null;
  setAuthState: (payload: { uid: string | null; email?: string | null; fullName?: string | null; photoURL?: string | null }) => void;
  enterDemoMode: () => void;
  updateProfile: (payload: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  signOutLocal: () => void;
}

const defaultProfile: UserProfile = {
  age: "",
  weight: "",
  height: "",
  gender: "prefer-not",
  goal: "maintain",
  activityLevel: "moderate",
  dietaryPreferences: []
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: "loading",
      authMode: null,
      hasCompletedOnboarding: false,
      userProfile: defaultProfile,
      firebaseUid: null,
      setAuthState: ({ uid, email, fullName, photoURL }) =>
        set((state) => ({
          status: uid ? "authenticated" : "guest",
          authMode: uid ? "firebase" : null,
          firebaseUid: uid,
          userProfile: {
            ...(state.userProfile ?? defaultProfile),
            email,
            fullName,
            photoURL
          }
        })),
      enterDemoMode: () =>
        set((state) => ({
          status: "authenticated",
          authMode: "demo",
          firebaseUid: "demo-user",
          userProfile: {
            ...(state.userProfile ?? defaultProfile),
            ...mockUserProfile
          }
        })),
      updateProfile: (payload) =>
        set((state) => ({
          userProfile: {
            ...(state.userProfile ?? defaultProfile),
            ...payload
          }
        })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      signOutLocal: () =>
        set({
          status: "guest",
          authMode: null,
          firebaseUid: null,
          userProfile: get().userProfile
        })
    }),
    {
      name: "nutriai-auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        status: state.status,
        authMode: state.authMode,
        firebaseUid: state.firebaseUid,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        userProfile: state.userProfile
      })
    }
  )
);

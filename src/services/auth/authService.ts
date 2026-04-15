import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { firebaseAuth, firebaseReady } from "@/services/firebase/config";
import { useAuthStore } from "@/store/authStore";

const ensureFirebaseReady = () => {
  if (!firebaseReady) {
    throw new Error("Firebase nao configurado. Preencha o .env e reinicie o app.");
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  ensureFirebaseReady();
  const result = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  return result.user;
};

export const registerWithEmail = async (email: string, password: string) => {
  ensureFirebaseReady();
  const result = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
  return result.user;
};

export const signOutCurrentUser = async () => {
  if (!firebaseReady || useAuthStore.getState().authMode === "demo") {
    useAuthStore.getState().signOutLocal();
    return;
  }

  await signOut(firebaseAuth);
};

export const subscribeToAuthChanges = (
  callback: (payload: { uid: string | null; email?: string | null; fullName?: string | null; photoURL?: string | null }) => void
) =>
  onAuthStateChanged(firebaseAuth, (user: User | null) => {
    callback({
      uid: user?.uid ?? null,
      email: user?.email,
      fullName: user?.displayName,
      photoURL: user?.photoURL
    });
  });

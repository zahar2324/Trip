import { create } from "zustand";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));


onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});

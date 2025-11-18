import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

interface AuthState {
  session: any | null;
  user: any | null;
  setSession: (session: any) => void;
  fetchSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
    });
  },

  fetchSession: async () => {
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
    });
  },
}));

import { supabase } from "@/lib/supabase";

export const authService = {
  login: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signup: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),

  logout: () => supabase.auth.signOut(),
};

import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase-auth";
import { AppLanguage } from "@/lib/types";

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
  onboarding_completed: boolean;
  language?: AppLanguage | null;
  child_notifications_enabled?: boolean | null;
  parent_notifications_enabled?: boolean | null;
};

const getProfile = async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return profile as Profile;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}

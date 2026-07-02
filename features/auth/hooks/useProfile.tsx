import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase-auth";

const getProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return profile;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}

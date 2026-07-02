import { supabase } from "./supabase";

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
};

export const getRequiredCurrentUser = async () => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not found");

  return user;
};

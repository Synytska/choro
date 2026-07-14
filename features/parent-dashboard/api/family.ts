import { supabase } from "@/lib/supabase";

export type FamilyRow = {
  id: string;
};

type ChildIdRow = {
  id: string;
};

export const getFamilyIds = async (parentId: string) => {
  const { data, error } = await supabase.from("families").select("id").eq("parent_id", parentId);

  if (error) throw error;

  return ((data ?? []) as FamilyRow[]).map((family) => family.id);
};

export const getOrCreateFamily = async (parentId: string) => {
  const { data: existingFamily, error: existingFamilyError } = await supabase
    .from("families")
    .select("id")
    .eq("parent_id", parentId)
    .limit(1)
    .maybeSingle();

  if (existingFamilyError) throw existingFamilyError;
  if (existingFamily) return existingFamily as FamilyRow;

  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({
      parent_id: parentId,
    })
    .select("id")
    .single();

  if (familyError) throw familyError;

  return family as FamilyRow;
};

export const getOwnedChildIds = async (childIds: string[], familyIds: string[]) => {
  const { data, error } = await supabase
    .from("children")
    .select("id")
    .in("id", childIds)
    .in("family_id", familyIds);

  if (error) throw error;

  return ((data ?? []) as ChildIdRow[]).map((child) => child.id);
};

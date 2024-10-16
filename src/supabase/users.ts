import { supabase } from "@/supabase/supabase";

export const fetchUser = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();
  return { data, error };
};

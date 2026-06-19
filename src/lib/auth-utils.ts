import { supabase } from "@/integrations/supabase/client";

export type AppRole = "organizer" | "jury" | "participant";

export async function fetchRole(userId: string): Promise<AppRole | null> {
  // If running tests, allow overriding role using TEST_USER_ROLE in localStorage
  if (typeof window !== 'undefined' && import.meta.env.VITE_TEST_AUTH === 'true') {
    const r = localStorage.getItem('TEST_USER_ROLE');
    if (r === 'organizer' || r === 'jury' || r === 'participant') return r as AppRole;
  }
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (!data || data.length === 0) return null;
  const roles = data.map((r: any) => r.role as AppRole);
  if (roles.includes("organizer")) return "organizer";
  if (roles.includes("jury")) return "jury";
  return "participant";
}

export async function ensureUserRole(userId: string): Promise<AppRole | null> {
  return fetchRole(userId);
}

import "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

const { createClient } = supabase;

const _supabase = createClient(
  "https://zdppcgenxcjixpqokutc.supabase.co",
  "sb_publishable_xIqfCY-G4fWKAnLvIUgpcg_xRzqfv9N"
);

export { _supabase as supabase };

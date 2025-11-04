import 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'

const { createClient } = supabase

const _supabase = createClient(
  'https://atshuwgsazgjeydqvywr.supabase.co',
  'sb_publishable_vdYguT3-RbWGhZu-pnCpYw_3bETLrsD'
)

export { _supabase as supabase }

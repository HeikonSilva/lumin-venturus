import { createClient } from '@supabase/supabase-js'

const _supabase = createClient(
  'https://atshuwgsazgjeydqvywr.supabase.co',
  'sb_publishable_vdYguT3-RbWGhZu-pnCpYw_3bETLrsD'
)

export { _supabase as supabase }

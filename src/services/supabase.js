import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://uatfviycqqinxhjrzfje.supabase.co',
  import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_mUZ01PQE_oI137pavuSwRA_2qyO0mUI'
)

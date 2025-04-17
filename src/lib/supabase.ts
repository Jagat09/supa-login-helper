
import { createClient } from '@supabase/supabase-js'

// These values should be replaced with your actual Supabase URL and anon key
// after connecting your project to Supabase using Lovable's integration
const supabaseUrl = 'https://your-supabase-url.supabase.co'
const supabaseAnonKey = 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

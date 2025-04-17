
import { createClient } from '@supabase/supabase-js'

// Using the actual Supabase URL and anon key from our connected project
const supabaseUrl = 'https://okowpojqlredwewbenzq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rb3dwb2pxbHJlZHdld2JlbnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NzYyMTIsImV4cCI6MjA2MDM1MjIxMn0.psDXOLYLjytp9FhXdW7BNjVijh-qe9SmPaT45-ohF5s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

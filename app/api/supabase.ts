// ! THIS IS CLIENT-SIDE CODE!!
// ! NO .server
// ! or IT WILL NOT RUN!!!!!

import { createClient } from '@supabase/supabase-js'

const isServer = typeof window === 'undefined';

const supabaseKey = isServer
  ? process.env.SUPABASE_KEY!
  : window.env.SUPABASE_KEY!

const supabaseUrl = isServer 
  ? process.env.SUPABASE_URL!
  : window.env.SUPABASE_URL!  


export default createClient(supabaseUrl, supabaseKey)

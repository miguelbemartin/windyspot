import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function createAuthClient() {
  const { getToken } = await auth()
  const supabaseToken = await getToken({ template: 'supabase' })

  return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseToken}`,
      },
    },
  })
}

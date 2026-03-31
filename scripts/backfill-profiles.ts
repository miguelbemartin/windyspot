import { createClient } from '@supabase/supabase-js'
import { createClerkClient } from '@clerk/backend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const clerkSecretKey = process.env.CLERK_SECRET_KEY!

async function backfill() {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const clerk = createClerkClient({ secretKey: clerkSecretKey })

    let offset = 0
    const limit = 100
    let total = 0

    while (true) {
        const users = await clerk.users.getUserList({ limit, offset })

        if (users.data.length === 0) break

        for (const user of users.data) {
            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    user_id: user.id,
                    username: user.username || user.id,
                    full_name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
                    avatar_url: user.imageUrl || null,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id' })

            if (error) {
                console.error(`Skipped ${user.username || user.id}: ${error.message}`)
            } else {
                total++
            }
        }
        console.log(`Processed batch (total synced: ${total})`)

        if (users.data.length < limit) break
        offset += limit
    }

    console.log(`Done. ${total} profiles synced.`)
}

backfill().catch(console.error)

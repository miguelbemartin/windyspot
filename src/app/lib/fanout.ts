import { createAdminClient } from './supabase-server'

export async function fanoutToFollowers(
    supabase: ReturnType<typeof createAdminClient>,
    actorId: string,
    type: string,
    referenceId: string,
    createdAt: string
) {
    const { data: followers } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('following_id', actorId)

    const userIds = [actorId, ...(followers || []).map(f => f.follower_id)]

    const rows = userIds.map(uid => ({
        user_id: uid,
        actor_id: actorId,
        type,
        reference_id: referenceId,
        created_at: createdAt,
    }))

    await supabase.from('feed_items').insert(rows)
}

import { createAdminClient } from './supabase-server'

export async function createNotification(
    supabase: ReturnType<typeof createAdminClient>,
    userId: string,
    actorId: string,
    type: 'like' | 'comment' | 'follow',
    feedItemId?: string
) {
    if (userId === actorId) return
    await supabase.from('notifications').insert({
        user_id: userId,
        actor_id: actorId,
        type,
        feed_item_id: feedItemId || null,
    })
}

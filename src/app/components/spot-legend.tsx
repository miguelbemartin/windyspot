import Image from 'next/image'
import Link from 'next/link'
import { createAdminClient } from '../lib/supabase-server'

interface SpotLegendProps {
  createdBy: string
}

async function getCreatorProfile(userId: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('user_profiles')
    .select('username, full_name, avatar_url')
    .eq('user_id', userId)
    .single()
  return data
}

export default async function SpotLegend({ createdBy }: SpotLegendProps) {
  const profile = await getCreatorProfile(createdBy)
  if (!profile) return null

  return (
    <div className="listingSingleblock mb-4" id="spot-legend">
      <div className="SingleblockHeader">
        <h4 className="listingcollapseTitle">Spot Legend</h4>
      </div>
      <div className="card-body p-4 pt-2">
        <Link href={`/u/${profile.username}`} className="d-flex align-items-center gap-3 text-decoration-none" style={{ color: '#333' }}>
          {profile.avatar_url && (
            <Image
              src={profile.avatar_url}
              width={48}
              height={48}
              className="rounded-circle"
              alt={profile.full_name || profile.username}
            />
          )}
          <div>
            <div className="fw-semibold">{profile.full_name || profile.username}</div>
            <div className="text-muted" style={{ fontSize: '13px' }}>@{profile.username}</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

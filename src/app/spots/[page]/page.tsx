import SpotsList from '../spots-list'
import { getSpots, getLocations } from '../../lib/spots'

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
    const { page } = await params
    const [spots, locations] = await Promise.all([getSpots(), getLocations()])
    return <SpotsList page={Number(page) || 1} spots={spots} locations={locations} />
}

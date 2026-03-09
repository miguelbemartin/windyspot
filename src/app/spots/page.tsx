import SpotsList from './spots-list'
import { getSpots, getLocations } from '../lib/spots'

export default async function Page() {
    const [spots, locations] = await Promise.all([getSpots(), getLocations()])
    return <SpotsList page={1} spots={spots} locations={locations} />
}

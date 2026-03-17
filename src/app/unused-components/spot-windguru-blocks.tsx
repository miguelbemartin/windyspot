import Link from 'next/link'
import { getSpotBySlug } from '../lib/spots'
import WindguruWidget from '../components/windguru-widget'
import WindguruLive from '../components/windguru-live'

export default async function SpotWindguruBlocks({ slug, forecastExtra }: { slug: string, forecastExtra?: React.ReactNode }) {
    const spot = await getSpotBySlug(slug)
    if (!spot) return null

    return (
        <>
            {spot.windguru_forecast_id && (
                <div className="listingSingleblock mb-4" id="forecast">
                    <div className="SingleblockHeader">
                        <Link data-bs-toggle="collapse" data-bs-target="#forecastPanel" aria-controls="forecastPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Forecast</h4></Link>
                    </div>
                    <div id="forecastPanel" className="panel-collapse collapse show">
                        <div className="card-body p-4 pt-2">
                            <WindguruWidget spotId={spot.windguru_forecast_id} uid={spot.windguru_forecast_id} />
                            {forecastExtra}
                        </div>
                    </div>
                </div>
            )}

            {spot.windguru_live_station_id && (
                <div className="listingSingleblock mb-4" id="livestation">
                    <div className="SingleblockHeader">
                        <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                    </div>
                    <div id="livestationPanel" className="panel-collapse collapse show">
                        <div className="card-body p-4 pt-2">
                            <WindguruLive spotId={spot.windguru_live_station_id} uid={spot.windguru_live_station_id} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

import Link from 'next/link'
import { spots } from '../data/data'
import WindguruWidget from './windguru-widget'
import WindguruLive from './windguru-live'

export default function SpotWindguruBlocks({ slug, forecastExtra }: { slug: string, forecastExtra?: React.ReactNode }) {
    const spot = spots.find((s) => s.slug === slug)
    if (!spot) return null

    return (
        <>
            {spot.windguruForecastId && (
                <div className="listingSingleblock mb-4" id="forecast">
                    <div className="SingleblockHeader">
                        <Link data-bs-toggle="collapse" data-bs-target="#forecastPanel" aria-controls="forecastPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Forecast</h4></Link>
                    </div>
                    <div id="forecastPanel" className="panel-collapse collapse show">
                        <div className="card-body p-4 pt-2">
                            <WindguruWidget spotId={spot.windguruForecastId} uid={spot.windguruForecastId} />
                            {forecastExtra}
                        </div>
                    </div>
                </div>
            )}

            {spot.windguruLiveStationId && (
                <div className="listingSingleblock mb-4" id="livestation">
                    <div className="SingleblockHeader">
                        <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                    </div>
                    <div id="livestationPanel" className="panel-collapse collapse show">
                        <div className="card-body p-4 pt-2">
                            <WindguruLive spotId={spot.windguruLiveStationId} uid={spot.windguruLiveStationId} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

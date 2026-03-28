import { FaWind, FaLocationDot } from 'react-icons/fa6'
import { BsBell, BsCloudSun } from 'react-icons/bs'

export default function ForecastPromo() {
    return (
        <section className="pt-5 mt-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-10 col-12 text-center">

                        <div className="secHeading-wrap text-center mb-5">
                            <h3 className="sectionHeading">Your Wind <span className="text-primary">Forecast</span></h3>
                            <p>Set your location and get real-time wind forecasts for the spots closest to you. <br />Never miss a windy day again.</p>
                        </div>

                        <div className="row g-3 mb-5 text-start">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <FaWind className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Wind Conditions</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            See current wind speed, gusts, and direction for your area. Know exactly when conditions are right to get on the water.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <FaLocationDot className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Nearby Spots</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Discover windsurf spots near you with detailed forecasts, live stations, and webcams for each one.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsCloudSun className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Hourly Forecast</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Plan your sessions with hour-by-hour wind, temperature, and weather data. See exactly when the wind picks up.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsBell className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Wind Alerts</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Get a day-by-day overview of which spots will be windsurfable. Spot the best days at a glance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

import { BsWind, BsCamera, BsPeople, BsGlobe } from 'react-icons/bs'

export default function CommunityPromo() {
    return (
        <section className="pt-5 mt-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-10 col-12 text-center">

                        <div className="secHeading-wrap text-center mb-5">
                            <h3 className="sectionHeading">Join the <span className="text-primary">Community</span></h3>
                            <p>Connect with wind lovers around the world. <br />Share your sessions, post photos, and follow riders whose spots inspire you.</p>
                        </div>

                        <div className="row g-3 mb-5 text-start">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsWind className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Share Sessions</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Post your sessions with stats, GPS tracks, and spot info. Let others see where and how you ride.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsCamera className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Photos & Posts</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Share photos from the water, write about conditions, or just tell the story of a great day on the board.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsPeople className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Follow Riders</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Follow other riders and build your feed. Discover new spots through the sessions others share.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsGlobe className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Spot Guides & Forecasts</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            See spot guides and wind forecasts shared by the community. Learn from locals who know the conditions best.
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

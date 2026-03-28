import Link from 'next/link'
import { BsGraphUp, BsUpload, BsSpeedometer, BsMap } from 'react-icons/bs'

export default function TrackSessionsPromo() {
    return (
        <section className="pt-5 mt-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-10 col-12 text-center">

                        <div className="secHeading-wrap text-center mb-5">
                            <h3 className="sectionHeading">Track Your <span className="text-primary">Sessions</span></h3>
                            <p>Log every session, import GPX tracks, and watch your progress grow over time. <br />Your personal windsurf journal, all in one place.</p>
                        </div>

                        <div className="row g-3 mb-5 text-start">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsGraphUp className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Activity Graph</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Visualize your windsurf activity with a contribution-style heatmap. See your consistency at a glance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsUpload className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">GPX Import</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Import sessions from your GPS watch or tracker. We extract speed, distance, heart rate, and route data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsSpeedometer className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Session Stats</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Track total time on the water, distance covered, max speed, and the number of spots you have visited.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <BsMap className="text-primary mb-2" size={24} />
                                        <h6 className="fw-semibold">Route Playback</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Relive your sessions with GPS track maps. See exactly where you sailed and how fast you were going.
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

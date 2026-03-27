interface WindguruLiveProps {
  spotId: string
  uid: string
}

export default function WindguruLive({ spotId, uid }: WindguruLiveProps) {
  const src = `https://www.windguru.cz/wglive-iframe.php?s=${spotId}&wj=knots&tj=c&m=3&ai=0&gsize=400&msize=400&show=n,g,c&direct=1`

  return (
    <iframe
      id={`wglive-iframe-${uid}`}
      src={src}
      scrolling="no"
      seamless
      style={{ width: '100%', border: 'none', height: '530px' }}
    />
  )
}

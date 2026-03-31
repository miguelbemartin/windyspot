import sharp from 'sharp'
import crypto from 'crypto'
import type { GeoJsonTrack } from './gpx-parser'

const WIDTH = 760
const HEIGHT = 440
const TILE_SIZE = 256
const LINE_WIDTH = 3

const TEAM_ID = process.env.APPLE_TEAM_ID || 'C7HGT5JX2Q'
const KEY_ID = process.env.MAPKIT_KEY_ID || ''
const PRIVATE_KEY = process.env.MAPKIT_PRIVATE_KEY || ''

/**
 * Generate a PNG thumbnail of a GPS track overlaid on a map background.
 * Uses Apple Maps Web Snapshots if configured, otherwise falls back to OSM tiles.
 */
export async function generateTrackThumbnail(track: GeoJsonTrack): Promise<Buffer> {
    const feature = track.features[0]
    const coords: [number, number][] = feature.geometry.coordinates
    const speeds: number[] = feature.properties.speeds

    // Compute bounds with ~15% padding
    const lons = coords.map(c => c[0])
    const lats = coords.map(c => c[1])
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)

    const lonPad = (maxLon - minLon) * 0.15 || 0.002
    const latPad = (maxLat - minLat) * 0.15 || 0.002
    const padMinLon = minLon - lonPad
    const padMaxLon = maxLon + lonPad
    const padMinLat = minLat - latPad
    const padMaxLat = maxLat + latPad

    const centerLat = (padMinLat + padMaxLat) / 2
    const centerLon = (padMinLon + padMaxLon) / 2
    const zoom = Math.max(1, calculateZoom(padMinLat, padMaxLat, padMinLon, padMaxLon, WIDTH, HEIGHT) - 1)

    // Fetch map background
    let mapBackground: Buffer
    let useApple = false
    if (KEY_ID && PRIVATE_KEY) {
        try {
            mapBackground = await fetchAppleMapSnapshot(centerLat, centerLon, zoom)
            useApple = true
        } catch (err) {
            console.error('Apple Maps snapshot failed, falling back to OSM:', err)
            mapBackground = await fetchOsmBackground(padMinLat, padMaxLat, padMinLon, padMaxLon, zoom)
        }
    } else {
        mapBackground = await fetchOsmBackground(padMinLat, padMaxLat, padMinLon, padMaxLon, zoom)
    }

    // Calculate pixel mapping for track overlay
    // Apple snapshot @2x: the requested size is (WIDTH/2 x HEIGHT/2) but the image
    // returned is (WIDTH x HEIGHT). Each Mercator pixel at this zoom = 2 image pixels.
    // OSM path: we crop and resize to exactly WIDTH x HEIGHT so 1 Mercator pixel = 1 image pixel
    // after our resize, but we need to account for the crop-to-resize scaling.
    const centerPx = latLonToPixel(centerLat, centerLon, zoom)

    // For Apple: the snapshot covers (WIDTH/2) Mercator pixels wide, rendered to WIDTH image pixels
    // So scale factor = 2 (the @2x). For OSM: we need to compute from the crop dimensions.
    let pixelScale: number
    if (useApple) {
        pixelScale = 2
    } else {
        // OSM: the cropped area spans pxWidth Mercator pixels, resized to WIDTH image pixels
        const topLeftPx = latLonToPixel(padMaxLat, padMinLon, zoom)
        const bottomRightPx = latLonToPixel(padMinLat, padMaxLon, zoom)
        const pxWidth = bottomRightPx.x - topLeftPx.x
        pixelScale = WIDTH / pxWidth
    }

    function toSvgPos(lon: number, lat: number): [number, number] {
        const px = latLonToPixel(lat, lon, zoom)
        return [
            WIDTH / 2 + (px.x - centerPx.x) * pixelScale,
            HEIGHT / 2 + (px.y - centerPx.y) * pixelScale,
        ]
    }

    // Speed range
    const nonZeroSpeeds = speeds.filter(s => s > 0)
    const maxSpeed = nonZeroSpeeds.length > 0 ? Math.max(...nonZeroSpeeds) : 1

    // Build SVG track overlay
    const svgLines: string[] = []
    const step = Math.max(1, Math.floor(coords.length / 500))

    for (let i = 0; i < coords.length - step; i += step) {
        const [x1, y1] = toSvgPos(coords[i][0], coords[i][1])
        const nextIdx = Math.min(i + step, coords.length - 1)
        const [x2, y2] = toSvgPos(coords[nextIdx][0], coords[nextIdx][1])
        const speed = speeds[i] || 0
        const ratio = Math.min(speed / maxSpeed, 1)

        svgLines.push(
            `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${speedColor(ratio)}" stroke-width="${LINE_WIDTH}" stroke-linecap="round"/>`
        )
    }

    const [sx, sy] = toSvgPos(coords[0][0], coords[0][1])
    const [ex, ey] = toSvgPos(coords[coords.length - 1][0], coords[coords.length - 1][1])

    const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  ${svgLines.join('\n  ')}
  <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="6" fill="#22c55e" stroke="white" stroke-width="2"/>
  <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="6" fill="#ef4444" stroke="white" stroke-width="2"/>
</svg>`

    return sharp(mapBackground)
        .resize(WIDTH, HEIGHT, { fit: 'cover' })
        .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
        .png()
        .toBuffer()
}

/**
 * Fetch an Apple Maps Web Snapshot using a signed URL.
 */
async function fetchAppleMapSnapshot(lat: number, lon: number, zoom: number): Promise<Buffer> {
    // Request at @2x so Apple returns WIDTH x HEIGHT pixels
    // Apple max is 640x640 per dimension before scaling
    // Request extra height so we can crop out the Apple logo at the bottom
    const LOGO_CROP = 40
    const snapshotWidth = Math.min(640, Math.floor(WIDTH / 2))
    const snapshotHeight = Math.min(640, Math.floor((HEIGHT + LOGO_CROP) / 2))

    const queryParams = new URLSearchParams({
        center: `${lat},${lon}`,
        z: String(zoom),
        size: `${snapshotWidth}x${snapshotHeight}`,
        scale: '2',
        t: 'standard',
        colorScheme: 'light',
        teamId: TEAM_ID,
        keyId: KEY_ID,
    })

    const snapshotPath = `/api/v1/snapshot?${queryParams.toString()}`

    // Sign the URL path with the private key
    const signature = crypto
        .createSign('SHA256')
        .update(snapshotPath)
        .sign(PRIVATE_KEY, 'base64')
    // URL-safe base64
    const urlSafeSignature = signature
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

    const url = `https://snapshot.apple-mapkit.com${snapshotPath}&signature=${urlSafeSignature}`

    const res = await fetch(url)
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        console.error(`Apple Maps snapshot failed (${res.status}): ${text}`)
        throw new Error(`Apple Maps snapshot failed: ${res.status}`)
    }

    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
}

/**
 * Fallback: fetch OpenStreetMap tiles and stitch them together.
 */
async function fetchOsmBackground(
    minLat: number, maxLat: number,
    minLon: number, maxLon: number,
    zoom: number
): Promise<Buffer> {
    const topLeftPx = latLonToPixel(maxLat, minLon, zoom)
    const bottomRightPx = latLonToPixel(minLat, maxLon, zoom)
    const pxWidth = bottomRightPx.x - topLeftPx.x
    const pxHeight = bottomRightPx.y - topLeftPx.y

    const tileMinX = Math.floor(topLeftPx.x / TILE_SIZE)
    const tileMaxX = Math.floor(bottomRightPx.x / TILE_SIZE)
    const tileMinY = Math.floor(topLeftPx.y / TILE_SIZE)
    const tileMaxY = Math.floor(bottomRightPx.y / TILE_SIZE)

    const tilePromises: Promise<{ x: number; y: number; buffer: Buffer | null }>[] = []
    for (let tx = tileMinX; tx <= tileMaxX; tx++) {
        for (let ty = tileMinY; ty <= tileMaxY; ty++) {
            tilePromises.push(fetchOsmTile(zoom, tx, ty))
        }
    }
    const tiles = await Promise.all(tilePromises)

    const stitchWidth = (tileMaxX - tileMinX + 1) * TILE_SIZE
    const stitchHeight = (tileMaxY - tileMinY + 1) * TILE_SIZE

    const composites = tiles
        .filter(t => t.buffer !== null)
        .map(t => ({
            input: t.buffer!,
            left: (t.x - tileMinX) * TILE_SIZE,
            top: (t.y - tileMinY) * TILE_SIZE,
        }))

    const stitchedMap = await sharp({
        create: {
            width: stitchWidth,
            height: stitchHeight,
            channels: 3,
            background: { r: 220, g: 220, b: 220 },
        },
    }).composite(composites).png().toBuffer()

    const cropLeft = Math.max(0, Math.floor(topLeftPx.x - tileMinX * TILE_SIZE))
    const cropTop = Math.max(0, Math.floor(topLeftPx.y - tileMinY * TILE_SIZE))
    const cropWidth = Math.min(Math.ceil(pxWidth), stitchWidth - cropLeft)
    const cropHeight = Math.min(Math.ceil(pxHeight), stitchHeight - cropTop)

    return sharp(stitchedMap)
        .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
        .resize(WIDTH, HEIGHT, { fit: 'cover' })
        .toBuffer()
}

async function fetchOsmTile(zoom: number, x: number, y: number): Promise<{ x: number; y: number; buffer: Buffer | null }> {
    try {
        const url = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
        const res = await fetch(url, {
            headers: { 'User-Agent': 'WindySpot/1.0 (track-thumbnail)' },
        })
        if (!res.ok) return { x, y, buffer: null }
        const arrayBuffer = await res.arrayBuffer()
        return { x, y, buffer: Buffer.from(arrayBuffer) }
    } catch {
        return { x, y, buffer: null }
    }
}

function latLonToPixel(lat: number, lon: number, zoom: number): { x: number; y: number } {
    const n = Math.pow(2, zoom)
    const x = ((lon + 180) / 360) * n * TILE_SIZE
    const latRad = (lat * Math.PI) / 180
    const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * TILE_SIZE
    return { x, y }
}

function calculateZoom(
    minLat: number, maxLat: number,
    minLon: number, maxLon: number,
    width: number, height: number
): number {
    for (let z = 18; z >= 1; z--) {
        const topLeft = latLonToPixel(maxLat, minLon, z)
        const bottomRight = latLonToPixel(minLat, maxLon, z)
        if (bottomRight.x - topLeft.x <= width && bottomRight.y - topLeft.y <= height) {
            return z
        }
    }
    return 1
}

function speedColor(ratio: number): string {
    if (ratio < 0.5) {
        const r = Math.round(255 * (ratio * 2))
        return `rgb(${r}, 200, 50)`
    } else {
        const g = Math.round(200 * (1 - (ratio - 0.5) * 2))
        return `rgb(255, ${g}, 50)`
    }
}

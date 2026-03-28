# Task: Wind Map

## Goal

Add a visual wind forecast map (similar to Windguru/Windy) giving users a spatial overview of wind conditions across regions.

## Requirements

- Choose a map/visualization library
- Find a wind data source (GFS/ECMWF gridded data, or proxy from Windguru API)
- Render animated wind particles on a map
- Show color overlays for wind speed (at minimum)
- Integrate existing spot locations as markers on the map
- Ensure acceptable mobile performance

## Research: Windguru's Tech Stack (windguru.cz/map)

- **MapLibre GL** — WebGL-based map rendering (open-source Mapbox GL JS fork)
- **Custom particle system** — wind animation via canvas/WebGL with configurable detail
- **Web Workers** — offloads weather data processing for smooth animation
- **Custom color palettes** — gradients for wind speed, temperature, pressure, clouds, precipitation, waves
- **Overlay types** — wind barbs, isobars, animated particles
- **WebSockets** — real-time data updates
- **Forecast API** (`windguru.net/int/iapi.php`) — serves gridded weather model data
- **Firebase** — auth/data services

## Open-Source Options

| Library | Approach | Complexity | Notes |
|---------|----------|------------|-------|
| **MapLibre GL JS** | WebGL map + custom particle layer | High | What Windguru uses; most performant, most work |
| **Leaflet + leaflet-velocity** | Canvas-based wind particle plugin | Medium | Simpler integration, good enough for most cases |
| **deck.gl** | Uber's WebGL framework with particle layer | Medium-High | Good ecosystem, works with MapLibre |

## Notes

- Start by picking the library and data source, then prototype
- The approach is similar to earth.nullschool.net — rendering thousands of particles moving along wind vectors on a canvas overlay

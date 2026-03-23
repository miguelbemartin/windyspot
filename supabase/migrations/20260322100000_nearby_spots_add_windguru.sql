DROP FUNCTION IF EXISTS nearby_spots(float, float, int);

CREATE OR REPLACE FUNCTION nearby_spots(user_lat float, user_lon float, max_results int DEFAULT 10)
RETURNS TABLE (id bigint, slug text, title text, image text, lat float, lon float, distance_km float, location_name text, windguru_forecast_id text, windguru_live_station_id text)
AS $$
  SELECT s.id, s.slug, s.title, s.image, s.lat::float, s.lon::float,
         ST_Distance(s.geog, ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography) / 1000.0 AS distance_km,
         l.name AS location_name,
         s.windguru_forecast_id,
         s.windguru_live_station_id
  FROM spots s
  LEFT JOIN locations l ON l.id = s.location_id
  WHERE s.geog IS NOT NULL
  ORDER BY s.geog <-> ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
  LIMIT max_results;
$$ LANGUAGE sql STABLE;

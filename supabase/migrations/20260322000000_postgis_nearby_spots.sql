CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE spots ADD COLUMN IF NOT EXISTS geog geography(Point, 4326);

UPDATE spots SET geog = ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography
  WHERE lat IS NOT NULL AND lon IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_spots_geog ON spots USING GIST (geog);

CREATE OR REPLACE FUNCTION update_spots_geog() RETURNS trigger AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lon IS NOT NULL THEN
    NEW.geog := ST_SetSRID(ST_MakePoint(NEW.lon, NEW.lat), 4326)::geography;
  ELSE
    NEW.geog := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_spots_geog
  BEFORE INSERT OR UPDATE OF lat, lon ON spots
  FOR EACH ROW EXECUTE FUNCTION update_spots_geog();

CREATE OR REPLACE FUNCTION nearby_spots(user_lat float, user_lon float, max_results int DEFAULT 10)
RETURNS TABLE (id bigint, slug text, title text, image text, lat float, lon float, distance_km float, location_name text)
AS $$
  SELECT s.id, s.slug, s.title, s.image, s.lat::float, s.lon::float,
         ST_Distance(s.geog, ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography) / 1000.0 AS distance_km,
         l.name AS location_name
  FROM spots s
  LEFT JOIN locations l ON l.id = s.location_id
  WHERE s.geog IS NOT NULL
  ORDER BY s.geog <-> ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
  LIMIT max_results;
$$ LANGUAGE sql STABLE;

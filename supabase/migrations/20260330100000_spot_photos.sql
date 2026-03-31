-- User-contributed photos for spots
CREATE TABLE spot_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spot_id INT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_spot_photos_spot ON spot_photos (spot_id, created_at DESC);

ALTER TABLE spot_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON spot_photos FOR SELECT USING (true);

CREATE TYPE webcam_type AS ENUM ('youtube', 'image', 'iframe');

CREATE TABLE spot_webcams (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    spot_id integer NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    type webcam_type NOT NULL,
    url text NOT NULL,
    title text,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_spot_webcams_spot_id ON spot_webcams(spot_id);

ALTER TABLE spot_webcams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read spot webcams"
    ON spot_webcams FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert spot webcams"
    ON spot_webcams FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete spot webcams"
    ON spot_webcams FOR DELETE
    USING (true);

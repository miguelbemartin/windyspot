CREATE TABLE spot_videos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    spot_id integer NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    youtube_id text NOT NULL,
    title text,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_spot_videos_spot_id ON spot_videos(spot_id);

ALTER TABLE spot_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read spot videos"
    ON spot_videos FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert spot videos"
    ON spot_videos FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can delete their own spot videos"
    ON spot_videos FOR DELETE
    USING (true);

-- Add GPS track columns to sessions table for GPX import feature
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS track_url TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS start_lat DECIMAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS start_lon DECIMAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS avg_speed_kts DECIMAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS max_hr INT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS avg_hr INT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS source_file_name TEXT;

-- Index for deduplication: find existing sessions by user + start time
CREATE INDEX IF NOT EXISTS idx_sessions_dedup ON sessions (user_id, start_time)
WHERE start_time IS NOT NULL;

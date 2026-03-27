-- Add track thumbnail URL column to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS track_thumbnail_url TEXT;

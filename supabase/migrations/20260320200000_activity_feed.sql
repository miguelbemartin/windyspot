-- Activity Feed tables
-- Phase 1: user_profiles, sessions, user_posts, spot_guide_events, forecast_events,
--          user_follows, feed_items, reactions, comments

-- User profiles (synced from Clerk)
CREATE TABLE user_profiles (
    user_id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sessions (windsurf, kitesurf, etc.)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    spot_id INT REFERENCES spots(id),
    type TEXT NOT NULL CHECK (type IN ('windsurfing', 'kitesurfing', 'windfoiling', 'wingfoiling', 'parawing')),
    duration_minutes INT,
    avg_wind_kts DECIMAL,
    max_speed_kts DECIMAL,
    distance_km DECIMAL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User posts (text, image, video)
CREATE TABLE user_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spot guide events (system-generated)
CREATE TABLE spot_guide_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spot_id INT REFERENCES spots(id),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forecast events (system-generated)
CREATE TABLE forecast_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spot_id INT REFERENCES spots(id),
    title TEXT NOT NULL,
    forecast_days JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User follows
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id TEXT NOT NULL,
    following_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (follower_id, following_id)
);

-- Feed items (write fanout)
CREATE TABLE feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('session', 'post', 'spot_guide', 'forecast')),
    reference_id UUID NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    comments_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feed_items_user_timeline ON feed_items (user_id, created_at DESC);
CREATE INDEX idx_feed_items_actor ON feed_items (actor_id);
CREATE INDEX idx_feed_items_reference ON feed_items (reference_id);

-- Reactions (likes)
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'like',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (feed_item_id, user_id, type)
);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_feed_item ON comments (feed_item_id, created_at);

-- Triggers: update likes_count on reactions insert/delete

CREATE OR REPLACE FUNCTION update_likes_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE feed_items SET likes_count = likes_count + 1 WHERE id = NEW.feed_item_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE feed_items SET likes_count = likes_count - 1 WHERE id = OLD.feed_item_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_likes_count
    AFTER INSERT OR DELETE ON reactions
    FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- Triggers: update comments_count on comments insert/delete

CREATE OR REPLACE FUNCTION update_comments_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE feed_items SET comments_count = comments_count + 1 WHERE id = NEW.feed_item_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE feed_items SET comments_count = comments_count - 1 WHERE id = OLD.feed_item_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comments_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- Trigger: cascade delete feed_items when source record is deleted
-- Since reference_id is polymorphic, we handle this per source table

CREATE OR REPLACE FUNCTION cascade_delete_feed_items() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM feed_items WHERE reference_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cascade_sessions
    AFTER DELETE ON sessions
    FOR EACH ROW EXECUTE FUNCTION cascade_delete_feed_items();

CREATE TRIGGER trigger_cascade_user_posts
    AFTER DELETE ON user_posts
    FOR EACH ROW EXECUTE FUNCTION cascade_delete_feed_items();

CREATE TRIGGER trigger_cascade_spot_guide_events
    AFTER DELETE ON spot_guide_events
    FOR EACH ROW EXECUTE FUNCTION cascade_delete_feed_items();

CREATE TRIGGER trigger_cascade_forecast_events
    AFTER DELETE ON forecast_events
    FOR EACH ROW EXECUTE FUNCTION cascade_delete_feed_items();

-- RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_guide_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read" ON user_posts FOR SELECT USING (true);
CREATE POLICY "Public read" ON spot_guide_events FOR SELECT USING (true);
CREATE POLICY "Public read" ON forecast_events FOR SELECT USING (true);
CREATE POLICY "Public read" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Public read" ON feed_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON reactions FOR SELECT USING (true);
CREATE POLICY "Public read" ON comments FOR SELECT USING (true);

-- Add image_urls column to support photo carousels on posts
ALTER TABLE user_posts ADD COLUMN image_urls JSONB DEFAULT NULL;

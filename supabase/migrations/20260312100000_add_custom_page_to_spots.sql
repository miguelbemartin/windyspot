ALTER TABLE spots ADD COLUMN custom_page BOOLEAN NOT NULL DEFAULT false;

UPDATE spots SET custom_page = true;

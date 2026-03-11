ALTER TABLE locations ADD COLUMN country TEXT;

UPDATE locations SET country = 'Spain' WHERE id IN (1, 2, 3, 5);
UPDATE locations SET country = 'France' WHERE id = 4;
UPDATE locations SET country = 'Italy' WHERE id = 6;
UPDATE locations SET country = 'Greece' WHERE id = 7;
UPDATE locations SET country = 'United States' WHERE id = 8;
UPDATE locations SET country = 'Switzerland' WHERE id = 9;

ALTER TABLE locations ADD COLUMN slug TEXT;

UPDATE locations SET slug = 'gran-canaria' WHERE name = 'Gran Canaria';
UPDATE locations SET slug = 'tenerife' WHERE name = 'Tenerife';
UPDATE locations SET slug = 'fuerteventura' WHERE name = 'Fuerteventura';
UPDATE locations SET slug = 'south-of-france' WHERE name = 'South of France';
UPDATE locations SET slug = 'tarifa-cadiz' WHERE name = 'Tarifa, Cádiz';
UPDATE locations SET slug = 'garda-lake' WHERE name = 'Garda Lake';
UPDATE locations SET slug = 'crete' WHERE name = 'Crete';
UPDATE locations SET slug = 'maui-hawaii' WHERE name = 'Maui, Hawaii';
UPDATE locations SET slug = 'switzerland' WHERE name = 'Switzerland';

ALTER TABLE locations ALTER COLUMN slug SET NOT NULL;
ALTER TABLE locations ADD CONSTRAINT locations_slug_key UNIQUE (slug);

CREATE INDEX idx_locations_slug ON locations(slug);

create table locations (
  id bigint generated always as identity primary key,
  name text not null unique,
  image text,
  big boolean not null default false,
  featured boolean not null default true,
  created_at timestamptz not null default now()
);

create table spots (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  description text,
  image text,
  featured boolean not null default false,
  location_id bigint not null references locations(id),
  rental_place boolean not null default false,
  tag text,
  windguru_forecast_id text,
  windguru_live_station_id text,
  created_at timestamptz not null default now()
);

create index idx_spots_location_id on spots(location_id);
create index idx_spots_slug on spots(slug);
create index idx_spots_featured on spots(featured);

-- Seed locations
insert into locations (name, image, big, featured) values
  ('Gran Canaria', '/images/joel-rohland-ON5qDh2m-Ro-unsplash.jpg', true, true),
  ('Tenerife', '/images/cities/lina-bob-anCPcwhCQ28-unsplash.jpg', false, true),
  ('Fuerteventura', '/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg', false, true),
  ('South of France', '/images/spots/almanarre.png', false, true),
  ('Tarifa, Cádiz', '/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', true, true),
  ('Garda Lake', '/images/spots/klaus-huber-QfMCwSfmiuc-unsplash.jpg', false, true),
  ('Crete', '/images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg', false, true),
  ('Maui, Hawaii', '/images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg', false, true),
  ('Switzerland', '/images/switzerland.png', true, true);

-- Seed spots
insert into spots (slug, title, description, image, featured, location_id, rental_place, tag, windguru_forecast_id, windguru_live_station_id) values
  ('gran-canaria/pozo-izquierdo', 'Pozo Izquierdo', 'The iconic bump and jump spot in the Canary Islands.', '/images/IMG_2058.jpeg', true, (select id from locations where name = 'Gran Canaria'), true, 'Advanced Spot', '36048', null),
  ('gran-canaria/bahia-de-formas', 'Bahía de Formas', 'Flat water speed paradise', '/images/spots/IMG_1185.jpeg', false, (select id from locations where name = 'Gran Canaria'), false, 'Fitness', '49346', null),
  ('tenerife/el-medano', 'El Médano', 'Year-round trade wind mecca at the foot of Montaña Roja.', '/images/spots/michal-hejmann--oBMHfF2R18-unsplash.jpg', true, (select id from locations where name = 'Tenerife'), false, 'Real Estate', '1279560', '14924'),
  ('central-switzerland/fluelen', 'Flüelen', 'Foehn wind spot on the shores of Lake Uri.', '/images/spots/isleten.jpg', true, (select id from locations where name = 'Switzerland'), false, 'Weddings', '620377', '772'),
  ('south-of-france/gruissan', 'Gruissan', 'Shallow lagoon and open-sea spots powered by the Tramontane wind.', '/images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg', true, (select id from locations where name = 'South of France'), false, 'Restaurant', '242', '14601'),
  ('south-of-france/almanarre', 'Almanarre', 'Long sandy beach with flat water and Mistral-driven side-shore wind.', '/images/spots/almanarre.png', true, (select id from locations where name = 'South of France'), false, 'Education', '501010', null),
  ('garda-lake/torbole', 'Torbole', 'Alpine lake with reliable Ora and Peler thermal winds.', '/images/spots/klaus-huber-QfMCwSfmiuc-unsplash.jpg', true, (select id from locations where name = 'Garda Lake'), false, 'Showroom', '49192', '1202'),
  ('fuerteventura/sotavento', 'Sotavento', 'World-class freestyle and speed spot on Fuerteventura''s south coast.', '/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg', true, (select id from locations where name = 'Fuerteventura'), false, 'Fitness', '559365', '373'),
  ('fuerteventura/matas-blancas', 'Matas Blancas', 'Flat water speed strip on Fuerteventura''s southeast coast.', '/images/spots/matas-blancas-fuerteventura.png', false, (select id from locations where name = 'Fuerteventura'), false, 'Speed Spot', '53632', '3428'),
  ('fuerteventura/costa-calma', 'Costa Calma', 'Popular freestyle and freeride spot on Fuerteventura''s south coast.', '/images/spots/paul-treubrodt-6CIQG_tIQAk-unsplash.jpg', false, (select id from locations where name = 'Fuerteventura'), false, 'Freestyle', '206998', null),
  ('fuerteventura/risco-del-paso', 'Risco del Paso', 'Shallow lagoon with flat water and steady trade winds near Sotavento.', '/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg', false, (select id from locations where name = 'Fuerteventura'), false, 'Freestyle', '207001', '373'),
  ('crete/falasarna', 'Falasarna', 'Sandy Meltemi paradise on the northwest tip of Crete.', '/images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg', false, (select id from locations where name = 'Crete'), false, 'Fitness', '49269', null),
  ('central-switzerland/isleten', 'Isleten', 'Foehn wind spot on Lake Uri in central Switzerland.', '/images/spots/isleten.jpg', false, (select id from locations where name = 'Switzerland'), false, 'Fitness', '988948', null),
  ('central-switzerland/zug', 'Zug', 'Thermal winds on Lake Zug in central Switzerland.', '/images/spots/louis-droege-k6rwCx5oAS8-unsplash.jpg', false, (select id from locations where name = 'Switzerland'), false, 'Fitness', '57008', null),
  ('central-switzerland/sisikon', 'Sisikon', 'Foehn wind spot on the eastern shore of the Urnersee.', '/images/spots/isleten.jpg', false, (select id from locations where name = 'Switzerland'), false, 'Fitness', '57010', null),
  ('central-switzerland/sempach', 'Sempach', 'Thermal and Bise winds on Lake Sempach in central Switzerland.', '/images/spots/marvin-meyer-ua_tu9vqLAU-unsplash.jpg', false, (select id from locations where name = 'Switzerland'), false, 'Fitness', '905886', '2223'),
  ('crete/elafonisi', 'Elafonisi', 'Pink-sand lagoon with Meltemi winds on Crete''s southwest coast.', '/images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg', false, (select id from locations where name = 'Crete'), false, 'Fitness', '49268', '4122'),
  ('cadiz/balneario', 'Balneario', 'Mediterranean-side spot with flat water speed runs and hollow waves in Levante.', '/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', false, (select id from locations where name = 'Tarifa, Cádiz'), false, 'Advanced Spot', '43', '2667'),
  ('cadiz/campo', 'Campo', 'Flat water paradise with a 2 km speed strip along Los Lances beach.', '/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', false, (select id from locations where name = 'Tarifa, Cádiz'), false, 'Speed Spot', '43', '2667'),
  ('cadiz/agua', 'Agua', 'Less offshore than Campo with a shorter beach walk and a small bar for infrastructure.', '/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', false, (select id from locations where name = 'Tarifa, Cádiz'), false, 'All-round Spot', '43', '2667'),
  ('cadiz/arte-vida', 'Arte Vida', 'Beautiful Poniente spot with short car-to-water distance and stunning scenery.', '/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', false, (select id from locations where name = 'Tarifa, Cádiz'), false, 'Poniente Spot', '43', '2667'),
  ('cadiz/valdevaqueros', 'Valdevaqueros', 'Go-to Poniente spot with onshore waves, slalom conditions and beach lifestyle.', '/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', false, (select id from locations where name = 'Tarifa, Cádiz'), false, 'Wave Spot', '48772', '269'),
  ('cadiz/paloma-baja', 'Paloma Baja', 'Last spot in the bay with wave protection from the dune and Poniente acceleration.', '/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', false, (select id from locations where name = 'Tarifa, Cádiz'), false, 'All-round Spot', '43', '2667'),
  ('maui/hookipa', 'Hookipa', 'The world''s most famous wave sailing spot on Maui''s north shore.', '/images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg', true, (select id from locations where name = 'Maui, Hawaii'), false, 'Wave Spot', '26144', '5931'),
  ('central-switzerland/silvaplana', 'Silvaplana', 'Maloja wind funnelling through the Engadin valley onto Lake Silvaplana.', '/images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg', false, (select id from locations where name = 'Switzerland'), false, 'Freestyle', '1584', null);

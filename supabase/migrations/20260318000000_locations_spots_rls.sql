-- Enable RLS on locations and spots
alter table locations enable row level security;
alter table spots enable row level security;

-- Locations: anyone can read
create policy "Public read access on locations"
  on locations for select
  using (true);

-- Locations: only authenticated users can insert
create policy "Authenticated users can insert locations"
  on locations for insert
  with check (auth.role() = 'authenticated');

-- Locations: only authenticated users can update
create policy "Authenticated users can update locations"
  on locations for update
  using (auth.role() = 'authenticated');

-- Spots: anyone can read
create policy "Public read access on spots"
  on spots for select
  using (true);

-- Spots: only authenticated users can insert
create policy "Authenticated users can insert spots"
  on spots for insert
  with check (auth.role() = 'authenticated');

-- Spots: only authenticated users can update
create policy "Authenticated users can update spots"
  on spots for update
  using (auth.role() = 'authenticated');

alter table user_spots enable row level security;

create policy "Users can insert their own spots"
  on user_spots for insert
  with check (user_id = auth.jwt() ->> 'sub');

create policy "Users can read their own spots"
  on user_spots for select
  using (user_id = auth.jwt() ->> 'sub');

create policy "Users can delete their own spots"
  on user_spots for delete
  using (user_id = auth.jwt() ->> 'sub');

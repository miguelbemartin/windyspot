create table user_spots (
  user_id text not null,
  spot_id bigint not null references spots(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, spot_id)
);

create index idx_user_spots_user_id on user_spots(user_id);
create index idx_user_spots_spot_id on user_spots(spot_id);

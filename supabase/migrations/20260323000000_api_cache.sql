create table if not exists api_cache (
    cache_key text primary key,
    data jsonb not null,
    cached_at timestamptz not null default now()
);

create index idx_api_cache_cached_at on api_cache (cached_at);

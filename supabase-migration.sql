-- Run this in your Supabase SQL editor (supabase.com → your project → SQL Editor)

-- 1. User study data (synced key-value pairs)
create table if not exists user_data (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  data_key text not null,
  data_value jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  unique (user_id, data_key)
);

-- 2. Secure API key storage
create table if not exists user_secrets (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  claude_api_key text,
  updated_at timestamptz not null default now()
);

-- Row Level Security: users can only access their own data
alter table user_data enable row level security;
alter table user_secrets enable row level security;

create policy "Users can read own data" on user_data
  for select using (auth.uid() = user_id);

create policy "Users can insert own data" on user_data
  for insert with check (auth.uid() = user_id);

create policy "Users can update own data" on user_data
  for update using (auth.uid() = user_id);

create policy "Users can delete own data" on user_data
  for delete using (auth.uid() = user_id);

create policy "Users can read own secrets" on user_secrets
  for select using (auth.uid() = user_id);

create policy "Users can insert own secrets" on user_secrets
  for insert with check (auth.uid() = user_id);

create policy "Users can update own secrets" on user_secrets
  for update using (auth.uid() = user_id);

create policy "Users can delete own secrets" on user_secrets
  for delete using (auth.uid() = user_id);

-- Index for fast lookups
create index if not exists idx_user_data_user_id on user_data(user_id);
create index if not exists idx_user_data_key on user_data(user_id, data_key);

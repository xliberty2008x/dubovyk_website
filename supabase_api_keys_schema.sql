-- Enable necessary extensions if not already enabled (like uuid-ossp for uuid_generate_v4)
-- You might need to run this separately if you get an error about uuid_generate_v4
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the api_keys table
create table api_keys (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references auth.users not null,
  name text not null check (char_length(name) > 0), -- Ensure name is not empty
  key text not null unique check (char_length(key) > 0), -- Ensure key is not empty and unique
  scopes text[] default array[]::text[], -- e.g., ['posts:read', 'posts:write']
  expires_at timestamp with time zone,
  last_used_at timestamp with time zone,
  is_active boolean default true not null
);

-- Add comments to columns for clarity
comment on column api_keys.user_id is 'The user who owns this API key.';
comment on column api_keys.name is 'A user-friendly name for the API key.';
comment on column api_keys.key is 'The actual secret API key string.';
comment on column api_keys.scopes is 'Permissions associated with the key.';
comment on column api_keys.expires_at is 'Optional expiration timestamp for the key.';
comment on column api_keys.last_used_at is 'Timestamp of the last time the key was used.';
comment on column api_keys.is_active is 'Whether the key is currently active and usable.';

-- Create indexes for faster lookups
create index idx_api_keys_user_id on api_keys(user_id);
create index idx_api_keys_key on api_keys(key); -- Index for quick key lookup during auth

-- Enable Row Level Security (RLS)
alter table api_keys enable row level security;

-- Grant permissions to the authenticated role
-- Adjust 'authenticated' if your role name is different
grant select, insert, update, delete on table api_keys to authenticated;

-- RLS Policies: Restrict access to the key owner
create policy "Users can manage their own API keys" on api_keys
  for all -- Covers SELECT, INSERT, UPDATE, DELETE
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: Grant usage for the sequence if using serial primary key (not needed for UUID)
-- grant usage, select on sequence api_keys_id_seq to authenticated;

-- Grant execute permission on uuid_generate_v4 function if needed (usually public)
-- GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO authenticated;

select 'api_keys table created and RLS policies applied successfully.';

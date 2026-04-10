-- PetHealth Hub Database Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Create custom enum type
create type task_type as enum ('fed', 'walked', 'medicated');

-- Households table
create table households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  clerk_org_id text unique not null,
  created_at timestamptz default now()
);

-- Pets table
create table pets (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  name text not null,
  species text not null,
  breed text,
  photo_url text,
  notes text
);

-- Medications table
create table medications (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references pets(id) on delete cascade not null,
  name text not null,
  dosage text not null,
  frequency_hours integer not null,
  instructions text,
  is_active boolean default true
);

-- Status logs table
create table status_logs (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references pets(id) on delete cascade not null,
  task_type task_type not null,
  med_id uuid references medications(id) on delete set null,
  completed_at timestamptz default now(),
  completed_by_name text not null
);

-- Create indexes for common queries
create index idx_pets_household on pets(household_id);
create index idx_medications_pet on medications(pet_id);
create index idx_status_logs_pet on status_logs(pet_id);
create index idx_status_logs_completed_at on status_logs(completed_at);
create index idx_households_clerk_org on households(clerk_org_id);

-- Enable Row Level Security
alter table households enable row level security;
alter table pets enable row level security;
alter table medications enable row level security;
alter table status_logs enable row level security;

-- RLS Policies
-- For this MVP, we use the Supabase anon key and handle auth via Clerk on the app side.
-- These policies allow all operations for authenticated requests passing through our API routes.
-- In production, you'd use Supabase Auth + JWT verification for tighter RLS.

create policy "Allow all operations on households" on households
  for all using (true) with check (true);

create policy "Allow all operations on pets" on pets
  for all using (true) with check (true);

create policy "Allow all operations on medications" on medications
  for all using (true) with check (true);

create policy "Allow all operations on status_logs" on status_logs
  for all using (true) with check (true);

-- Enable Realtime for status_logs
alter publication supabase_realtime add table status_logs;

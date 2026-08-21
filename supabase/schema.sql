-- ====================================================================
-- AFFAN ER TONG - DATABASE SCHEMA, RLS POLICIES, INDEXES & FUNCTIONS
-- ====================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'user'
    check (role in ('user', 'admin')),
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended', 'disabled')),
  suspended_reason text,
  suspended_by uuid references public.profiles(id),
  suspended_at timestamptz,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. ADMIN ROLE HELPER FUNCTION
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and account_status = 'active'
  );
$$;

-- 3. LEARNING MODULES TABLE
create table if not exists public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  module_number integer not null,
  slug text not null unique,
  title text not null,
  summary text not null,
  level text check (
    level is null or
    level in ('Beginner', 'Intermediate', 'Advanced')
  ),
  duration text,
  source_name text,
  youtube_url text,
  youtube_id text,
  thumbnail_url text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'coming_soon', 'archived')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. VIDEO RESOURCES TABLE
create table if not exists public.video_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category text not null,
  youtube_url text not null,
  youtube_id text not null,
  thumbnail_url text,
  source_name text not null,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. ADMIN AUDIT LOGS TABLE
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  entity_title text,
  changes jsonb,
  created_at timestamptz not null default now()
);

-- 6. AUTOMATIC PROFILE CREATION TRIGGER FOR AUTH USERS
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role, account_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'user',
    'active'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.learning_modules enable row level security;
alter table public.video_resources enable row level security;
alter table public.admin_audit_logs enable row level security;

-- PROFILES POLICIES
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update non-role profile fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and account_status = (select account_status from public.profiles where id = auth.uid())
  );

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- LEARNING MODULES POLICIES
create policy "Public/Users can view published and coming_soon modules"
  on public.learning_modules for select
  using (status in ('published', 'coming_soon') or public.is_admin());

create policy "Only admins can insert modules"
  on public.learning_modules for insert
  with check (public.is_admin());

create policy "Only admins can update modules"
  on public.learning_modules for update
  using (public.is_admin());

create policy "Only admins can delete modules"
  on public.learning_modules for delete
  using (public.is_admin());

-- VIDEO RESOURCES POLICIES
create policy "Public/Users can view published video resources"
  on public.video_resources for select
  using (status = 'published' or public.is_admin());

create policy "Only admins can insert video resources"
  on public.video_resources for insert
  with check (public.is_admin());

create policy "Only admins can update video resources"
  on public.video_resources for update
  using (public.is_admin());

create policy "Only admins can delete video resources"
  on public.video_resources for delete
  using (public.is_admin());

-- AUDIT LOGS POLICIES
create policy "Only admins can view audit logs"
  on public.admin_audit_logs for select
  using (public.is_admin());

create policy "Only admins can insert audit logs"
  on public.admin_audit_logs for insert
  with check (public.is_admin() and admin_id = auth.uid());

-- ====================================================================
-- HIGH PERFORMANCE QUERY INDEXES
-- ====================================================================
create index if not exists idx_learning_modules_status_sort on public.learning_modules (status, sort_order);
create index if not exists idx_video_resources_status_sort on public.video_resources (status, sort_order);
create index if not exists idx_profiles_role_status on public.profiles (role, account_status);
create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs (created_at desc);

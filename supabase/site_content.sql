create table if not exists public.site_content (
  slug text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.site_content enable row level security;
alter table public.site_content replica identity full;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
using (true);

drop policy if exists "Authenticated can insert site content" on public.site_content;
create policy "Authenticated can insert site content"
on public.site_content
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update site content" on public.site_content;
create policy "Authenticated can update site content"
on public.site_content
for update
to authenticated
using (true)
with check (true);

insert into public.site_content (slug, payload)
values ('main', '{}'::jsonb)
on conflict (slug) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'site_content'
  ) then
    alter publication supabase_realtime add table public.site_content;
  end if;
end
$$;
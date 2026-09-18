create table if not exists public.warmtodo_records (
  store_name text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (store_name, id)
);

create index if not exists warmtodo_records_store_name_idx
  on public.warmtodo_records (store_name);

create index if not exists warmtodo_records_updated_at_idx
  on public.warmtodo_records (updated_at);

alter table public.warmtodo_records enable row level security;

drop policy if exists "WarmTodo anon read records" on public.warmtodo_records;
drop policy if exists "WarmTodo anon insert records" on public.warmtodo_records;
drop policy if exists "WarmTodo anon update records" on public.warmtodo_records;
drop policy if exists "WarmTodo anon delete records" on public.warmtodo_records;

create policy "WarmTodo anon read records"
  on public.warmtodo_records
  for select
  to anon
  using (true);

create policy "WarmTodo anon insert records"
  on public.warmtodo_records
  for insert
  to anon
  with check (true);

create policy "WarmTodo anon update records"
  on public.warmtodo_records
  for update
  to anon
  using (true)
  with check (true);

create policy "WarmTodo anon delete records"
  on public.warmtodo_records
  for delete
  to anon
  using (true);

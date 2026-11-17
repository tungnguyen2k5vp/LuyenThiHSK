-- Target: Supabase PostgreSQL 15+. Apply to a dedicated project, then run integration/RLS QA.
begin;
revoke create on schema public from public, anon, authenticated;
create table if not exists public.learning_records (
 owner_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('profile','target','study_plan','vocabulary','grammar','srs_events','mistakes','attempts','results','bookmarks','settings')),
 id text not null check(length(id) between 1 and 160),
 payload jsonb not null check(jsonb_typeof(payload)='object'),
 version bigint not null check(version>0),
 deleted_at timestamptz,
 updated_at timestamptz not null default clock_timestamp(),
 primary key(owner_id,kind,id)
);
create index if not exists learning_records_owner_updated on public.learning_records(owner_id,updated_at,kind,id);
create table if not exists public.sync_receipts (
 owner_id uuid not null references auth.users(id) on delete cascade,
 op_id text not null,
 request_hash text not null,
 result jsonb not null,
 created_at timestamptz not null default clock_timestamp(),
 primary key(owner_id,op_id)
);
create table if not exists public.learning_audit (
 id bigint generated always as identity primary key,
 owner_id uuid not null references auth.users(id) on delete cascade,
 action text not null, kind text not null, entity_id text not null,
 created_at timestamptz not null default clock_timestamp()
);
alter table public.learning_records enable row level security;
alter table public.learning_records force row level security;
alter table public.sync_receipts enable row level security;
alter table public.sync_receipts force row level security;
alter table public.learning_audit enable row level security;
alter table public.learning_audit force row level security;
do $$ begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='learning_records' and policyname='read_own_learning') then
  create policy read_own_learning on public.learning_records for select to authenticated using(owner_id=(select auth.uid()));
 end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='sync_receipts' and policyname='read_own_receipts') then
  create policy read_own_receipts on public.sync_receipts for select to authenticated using(owner_id=(select auth.uid()));
 end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='learning_audit' and policyname='read_own_audit') then
  create policy read_own_audit on public.learning_audit for select to authenticated using(owner_id=(select auth.uid()));
 end if;
end $$;
revoke all on public.learning_records,public.sync_receipts,public.learning_audit from anon,authenticated;
grant select on public.learning_records,public.sync_receipts,public.learning_audit to authenticated;

create or replace function public.hsk_apply_operation(p_operation jsonb) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
 actor uuid := auth.uid(); k text:=p_operation->>'kind'; entity text:=p_operation->>'id'; op text:=p_operation->>'opId';
 payload_value jsonb:=p_operation->'payload'; base_revision bigint; is_deleted boolean;
 fingerprint text:=encode(sha256(convert_to(p_operation::text,'UTF8')),'hex');
 old public.learning_records%rowtype; receipt public.sync_receipts%rowtype; answer jsonb; next_revision bigint;
begin
 if actor is null then raise exception 'AUTHENTICATION_REQUIRED' using errcode='42501'; end if;
 if jsonb_typeof(p_operation)<>'object' or exists(select 1 from jsonb_object_keys(p_operation) key where key not in ('opId','kind','id','baseVersion','payload','deleted'))
  or op is null or op !~ '^[a-zA-Z0-9_-]{8,100}$' or k is null or k not in ('profile','target','study_plan','vocabulary','grammar','srs_events','mistakes','attempts','results','bookmarks','settings')
  or entity is null or entity !~ '^[a-zA-Z0-9_:.-]{1,160}$' or jsonb_typeof(payload_value)<>'object' or octet_length(payload_value::text)>500000
  or coalesce(p_operation->>'baseVersion','') !~ '^[0-9]{1,15}$' or jsonb_typeof(p_operation->'deleted')<>'boolean'
 then raise exception 'INVALID_OPERATION' using errcode='22023'; end if;
 base_revision:=(p_operation->>'baseVersion')::bigint; is_deleted:=(p_operation->>'deleted')::boolean;
 if payload_value->>'contentEnvironment'='PREVIEW' or payload_value->'examSnapshot'->>'contentEnvironment'='PREVIEW' then raise exception 'PREVIEW_EXCLUDED' using errcode='22023'; end if;
 if k='srs_events' and (coalesce(payload_value->>'quality','') !~ '^[0-5]$' or coalesce(payload_value->>'cardId','')='' or coalesce(payload_value->>'at','')='') then raise exception 'INVALID_SRS_EVENT' using errcode='22023'; end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text||':op:'||op,0));
 select * into receipt from public.sync_receipts where owner_id=actor and op_id=op;
 if found then
  if receipt.request_hash<>fingerprint then return jsonb_build_object('status','CONFLICT','reason','OPERATION_ID_REUSED'); end if;
  return receipt.result||jsonb_build_object('status',case when receipt.result->>'status'='APPLIED' then 'REPLAYED' else receipt.result->>'status' end);
 end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text||':'||k||':'||entity,0));
 select * into old from public.learning_records where owner_id=actor and kind=k and id=entity for update;
 if found and k in ('attempts','srs_events') then
  answer:=case when old.payload=payload_value and not is_deleted then jsonb_build_object('status','REPLAYED','version',old.version) else jsonb_build_object('status','IMMUTABLE','version',old.version) end;
 elsif coalesce(old.version,0)<>base_revision then
  answer:=jsonb_build_object('status','CONFLICT','reason',case when k='vocabulary' then 'SRS_RECONCILIATION_REQUIRED' else 'STALE_VERSION' end,'current',to_jsonb(old));
 else
  next_revision:=coalesce(old.version,0)+1;
  insert into public.learning_records(owner_id,kind,id,payload,version,deleted_at,updated_at)
   values(actor,k,entity,payload_value,next_revision,case when is_deleted then clock_timestamp() else null end,clock_timestamp())
   on conflict(owner_id,kind,id) do update set payload=excluded.payload,version=excluded.version,deleted_at=excluded.deleted_at,updated_at=excluded.updated_at;
  answer:=jsonb_build_object('status','APPLIED','version',next_revision);
  insert into public.learning_audit(owner_id,action,kind,entity_id) values(actor,case when is_deleted then 'TOMBSTONE' else 'APPLY' end,k,entity);
 end if;
 insert into public.sync_receipts(owner_id,op_id,request_hash,result) values(actor,op,fingerprint,answer);
 return answer;
end $$;
revoke all on function public.hsk_apply_operation(jsonb) from public,anon;
grant execute on function public.hsk_apply_operation(jsonb) to authenticated;
commit;

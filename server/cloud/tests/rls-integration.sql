-- Run only in an isolated Supabase test project AFTER migration. Transaction rolls fixture data back.
-- psql -v ON_ERROR_STOP=1 -f server/cloud/tests/rls-integration.sql "$TEST_DATABASE_URL"
begin;
insert into auth.users(id) values('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
select public.hsk_apply_operation('{"opId":"fixture-op-0001","kind":"settings","id":"preferences","baseVersion":0,"payload":{"pinyin":"tap"},"deleted":false}');
do $$ begin if(select count(*) from public.learning_records)<>1 then raise exception 'OWNER_READ_FAILED';end if;end $$;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000002',true);
do $$ begin if(select count(*) from public.learning_records)<>0 then raise exception 'CROSS_OWNER_LEAK';end if;end $$;
select public.hsk_apply_operation('{"opId":"fixture-op-0002","kind":"settings","id":"preferences","baseVersion":0,"payload":{"pinyin":"hidden"},"deleted":false}');
do $$ declare result jsonb;begin
 result:=public.hsk_apply_operation('{"opId":"fixture-op-0003","kind":"settings","id":"preferences","baseVersion":0,"payload":{"pinyin":"always"},"deleted":false}');
 if result->>'status'<>'CONFLICT' then raise exception 'CAS_FAILED';end if;
 result:=public.hsk_apply_operation('{"opId":"fixture-attempt-1","kind":"attempts","id":"exam-1","baseVersion":0,"payload":{"finishedAt":"2026-10-16T00:00:00Z","answers":{"0":"A"}},"deleted":false}');
 result:=public.hsk_apply_operation('{"opId":"fixture-attempt-2","kind":"attempts","id":"exam-1","baseVersion":1,"payload":{"answers":{"0":"B"}},"deleted":false}');
 if result->>'status'<>'IMMUTABLE' then raise exception 'ATTEMPT_MUTATED';end if;
end $$;
rollback;

# Backend · Staging preparation

2026-10-18 T03:48:50.865 Z

**NOT_DEPLOYED /live Auth / RLS NOT_VERIFIED**. Local account status thực: NOT_CONFIGURED; Guest available. Không credential/SMTP/resource được cấp, không tạo hoặc mua cloud.

17 static+local HTTPchecks PASS: owner RLS enable/force,auth.uid policies,revoke direct writes,RPC locks/receipts/hashreuse/CAS/immutable attempts+SRSevents,SRS reconciliation; cookies/Origin/HTTPS,loopback admin/auth/buildexclusion. Đây không phải chạy migration trên Postgre SQL. [Evidence](../../data/reports/v11/staging-security.json).

Khi có staging riêng: dùng server-only env và32 byte encryption key,exact HTTPSorigins; backup trước migrate; chạy migration001 và transaction RLSfixture; haiaccountownerisolation/guestmerge/logout/expiry/duplicate-submit; twotabs/twodevices/offlinereconnect/conflict/SRS/history; restore riêng và rollback. Giữ journal/Web Locks/idempotency/CAS/atomic sync. Secure grading adapter có HTTP/SQLite regression nhưng chưa mountproduction.

[Runbook và lệnh chạy](../v10/BACKEND_CLOUD_RUNBOOK.md) · [Env mẫu](../../server/cloud/.env.example) · [SQL](../../server/cloud/migrations/001_learning_sync.sql) · [RLS fixture](../../server/cloud/tests/rls-integration.sql). Không chạy one-off wire/polish/fix/revise như setup.

Nội dung tự tạo giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Automated validation không phải human review, xác minh quyền, phát âm hay chứng nhận chính thức CTI.

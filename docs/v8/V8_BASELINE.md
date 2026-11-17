# V8 · Baseline V7 và bản sao lưu

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

Nguồn thực tế: filesystem V7, editorial core v6-hsk1-r1. Không có Git metadata. Archive TAI_LIEU_TONG_HOP_HSK(6).rar không tìm thấy trong workspace; dùng source hiện tại, docs/v7 và bằng chứng V7 đã lưu trước baseline.

Backup nhất quán WAL bằng VACUUM INTO: `.runtime/backups/before-v8-2026-10-16T11-27-18-488Z`. 2951 revision; integrity ok. Restore sang database tạm: PASS; không khôi phục đè live. Hash/schema/ID/revision và hash báo cáo V7 trong baseline.json. Bản sao gồm source, scripts, config, public/data, staging/editorial; không phải bản sao profile trình duyệt thật.

Baseline 19 scripts: data/reports/v8/baseline/regression.json. V7 evidence giữ riêng tại data/reports/v8/v7-evidence. Giữ schemaVersion3, guest/Preview keys, SM2 và snapshot format. Skills áp dụng: frontend-developer, backend-architect, data-engineer, test-automation-engineer, accessibility-auditor; không gọi sub-agent.

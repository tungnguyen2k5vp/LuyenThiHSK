# V12 · Phạm vi bảo mật đã kiểm

17/17 source/local HTTP checks PASS; V12 API **147 checks** trên SQLite tạm. Kiểm auth/Origin, stale CAS, immutable release/source labels, unauthorized reviewer, private audio, upload/PCM/provenance, production mock refusal và legacy route gate.

Rights attestation cần credential riêng thuộc LICENSE_REVIEW, exact revision/media signature/attestation version, scope/date/evidence hợp lệ. Negative/stale/no-owner/invalid-evidence bị chặn; positive/revocation chỉ dùng danh tính QA trên DB tạm. Không ghi credential vào audit/comment/export. Recording claims bind vào asset signature; claims không tự thành quyền hoặc phát âm approved.

Admin vẫn loopback, Bearer required; Origin ngoài loopback bị chặn. Account BFF dùng exact-origin/cookie/session controls theo source và regression. SQL RLS owner policies/revoke/RPC/immutable/replay có source/integration fixture; chưa chạy trên PostgreSQL thật. Không suy kiểm local thành penetration test/live RBAC certification.

Secure grading DTO/key-leak/replay, owner isolation/expiry/logout/guest merge/multi-tab sync qua regression và transport QA. Private Preview có key để luyện theo chủ đích, không phải anti-cheat production. Không có token/DB/env thật/model trong public/dist hoặc gói bàn giao; source-answer không public từ bản nháp.

Microphone chỉ xin khi bấm; tracks dừng khi kết thúc/rời câu. Draft chứa audio/người thu trên thiết bị, có thao tác bỏ draft; không tự upload hay ghi âm nền.

[api-tests](../../data/reports/v12/api-tests.json) · [staging-security](../../data/reports/v12/staging-security.json) · [data-safety](../../data/reports/v12/data-safety.json)

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.

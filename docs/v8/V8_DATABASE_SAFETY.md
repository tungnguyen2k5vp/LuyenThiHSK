# V8 · Bảo toàn dữ liệu

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

| Kiểm tra | Kết quả |
| --- | --- |
| Before/after revisions | 2951 → 3015 |
| Mất revision cũ | 0 |
| Đổi content fingerprint lịch sử | 0 |
| Technical/review metadata cũ đổi | 40 |
| Schema đổi | false |
| public/data unchanged | true |
| Notes/assignee/disposition cũ đổi | 0 |
| Integrity | {"integrity_check":"ok"} |
| Restore riêng | PASS |
| Source SHA256 | a4f869d5a3dc11dc4a0fb48ce893b50b39c891226a94ad79a5e92ca4994f4540 |

Không reset/drop/delete/recreate DB; không restore live.38 content IDs mới:27HSK2+6HSK1+5banks;3 manual-key revision mới. QA có thể thêm/archived records/revisions riêng; vẫn giữ lịch sử. Không đồng nhất số revision với số content active.

Giữ storage keys guest hsk-study-data-v1/hsk-preparation-v1 và Preview hsk-v4-preview-*. New owner atomic-queue-v8/journal là additive, không xóa legacy keys. QA chỉ profile tạm, không đọc/reset profile người dùng thật; do đó không tuyên bố byte audit dữ liệu trong mọi browser người dùng. Old attempts/snapshots/SM2/guest backup được kiểm qua regression. Dữ liệu raw trong data-safety.json và review-work-safety.json.

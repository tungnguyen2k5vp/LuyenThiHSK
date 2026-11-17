# V15 · Điều kiện phát hành

Ngày 2026-10-20 (Asia/Bangkok). **V15_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. ProductionReady=false. Dữ liệu và bằng chứng định lượng: [release-gates.json](data/reports/v15/release-gates.json).

| Gate kỹ thuật | Kết quả |
| --- | --- |
| snapshotRestore | PASS |
| dataSafety | PASS |
| regression | PASS |
| sourceMatches | PASS |
| logic | PASS |
| security | PASS |
| before | PASS |
| browsers | PASS |
| performance | PASS |
| contentStructure | PASS |
| contracts | PASS |
| v14Fallback | PASS |
| performanceCoreSource | PASS |

Dùng local Preview: http://127.0.0.1:4173/?view=preview&ui=v15. Fallback V14: ?view=preview&ui=v14. V15 mặc định chỉ trong Private Preview; chưa public deploy.

Các điều kiện chưa đủ để phát hành nội dung: human/language/level review; quyền và pronunciation của audio/ảnh; HSK2 Full Mock readiness; production cloud/Auth/RLS; server-authoritative Secure Exam. Nháp mới ở staging không tự xuất hiện trong production catalog. Publication Gate hiện hữu tiếp tục có hiệu lực.

Khôi phục UI bằng query fallback, không restore DB để đổi giao diện. Backup DB/source riêng tại .runtime/backups/before-v15-2026-10-19T16-36-58-946Z; chỉ dùng restore nếu có tình huống phục hồi thực sự và đã kiểm đường dẫn.

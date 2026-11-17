# HSK data validation V3

Ngày15/10/2026. Nguồn trạng thái: [CURRENT_STATE](docs/CURRENT_STATE.md). Kết quả dựa vào release và staging thực, không cộng fixture vào production.

|Loại|Tổng|Đã duyệt production V3|Còn thiếu / cần review|
|---|---:|---:|---|
|Vocabulary|11000|0 nghĩa được thẩm định độc lập trong vòng này|8765 normalized kỹ thuật;2235needsreview;557missingVI;758no-safe-shortmeaning|
|Grammar taxonomy|576|0lesson|8draftlesson;568chưa có draft;17taxonomy staging từV2|
|Hanzi|3088|giữ coverageV2|2989glyph;99missingglyph|
|Questions|20legacy+8draft mới|0|20metadatareview,8grammarpracticeNEEDS_REVIEW|
|Exam audio|0nội dung thi thật|0|Chưa có nguồn audio được duyệt/quyền đầy đủ|
|Full mocks|0|0|Pool/audio/template/học thuật chưa đủ|

Word/level/pinyin facts tiếp tục dùng CTI syllabus2025 với checksumV2, không tự đổi edition. Normalization không thay dữ kiện nguồn và không dịch tự động. Dictionary adaptation/license notices được giữ. Learner trình bày nghĩa ngắn, raw trong trường phục vụ trace và audit nội bộ.

Question metadata/license coverage production: **0/28 đạt Published V3**. Không gán license verified hoặc level cho legacy bằng suy đoán. Audio metadata gate cần source/license/evidence/file/hash/decoder; upload không tự cấp quyền. Grammar draft và câu mới doAIhỗtrợ luônNEEDS_REVIEW; không tự công bố.

Kiểm tra số liệu: `npm run data:audit-v3`; chi tiết `data/reports/content-audit-v3.json`, `vocabulary-cleanup-v3.json`, `question-coverage-v3.json`, [QUESTION_BANK_REPORT](QUESTION_BANK_REPORT.md), [MOCK_READINESS_REPORT](MOCK_READINESS_REPORT.md). Lần audit này phản ánh release/staging; admin Published overrides được kiểm tra riêng qua API và không cộng fixture QA.

[CTI HSK4](https://www.chinesetest.cn/HSK/4) vẫn hiển thị cấu trúc truyền thống, kiểm ngày15/10/2026. Không dùng headerHSK3 trên trang đó để đổi blueprint sang syllabus2025. Fullreference V3 hiện chỉ khóa cấu trúc truyền thốngHSK4; các cấp/edition khác cần reference được duyệt. Không import câu/sample/audio/PDF CTI vào public.

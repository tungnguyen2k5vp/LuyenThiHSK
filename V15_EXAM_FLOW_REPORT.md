# V15 · Luồng thi

Ngày 2026-10-20 (Asia/Bangkok). **V15_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. ProductionReady=false. Dữ liệu và bằng chứng định lượng: [release-gates.json](data/reports/v15/release-gates.json).

1. Mở Preview riêng bằng credential hiện có; V15 không đổi storage keys hoặc reset bài học. Request quá thời gian hiện lỗi và cho thử lại; không tự gửi lại POST tạo bài.
2. Catalog GET /api/admin/v15/catalog lấy metadata, không trả raw question/answer/transcript. V14 endpoint tiếp tục trả tập candidate cũ. HSK2 launch=null khi gate chưa đạt.
3. Intro hiển thị snapshot policy, chọn mode và xác nhận. Builder hiện hữu tạo snapshot; Start có guard chống lặp và tiếp tục session phù hợp.
4. Room dùng timer, lease, CAS/journal/autosave và audio fairness cũ. UI gửi lựa chọn theo ID hiện hành; không tạo timer, attempt store hoặc audio owner mới. Matching chưa đủ dòng không tính đã làm.
5. Practice cho feedback sau check; timed không mở đáp án, transcript hoặc dịch trước nộp. Acknowledgement phần mới phải hoàn tất trước khi owner đổi deadline; reload giữ media-pause credit.
6. Submit giữ idempotency. Manual writing vẫn ungraded; Result cùng engine, detailed review/mistakes/SRS/Study Plan giữ owner.

E2E: chrome: 34 nhóm PASS; edge: 34 nhóm PASS. Bộ bổ sung mở/nộp bài5/10 câu, mô phỏng hung GET rồi retry, reload giữ sáu attempt và kiểm private API không nằm trong service worker cache. Chỉ dùng profile/database thử nghiệm.

> LEGACY / BASELINE trước V3. Trạng thái hiện hành: [CURRENT_STATE](docs/CURRENT_STATE.md).

# FINAL IMPLEMENTATION REPORT V2

Ngày 15/10/2026 · D:/ReactJS/LuyenThiHSK. Bản update tăng khả năng học hằng ngày, giữ engine cũ. Đây chưa phải toàn bộ nền tảng production có nội dung học thuật/thi đầy đủ và cloud.

## 1. Trước update

React/Vite local SPA, 20 câu gốc, không catalog HSK, dashboard metric và từ cá nhân CSV/SM-2. Typecheck/unit/content/build/browser baseline qua; snapshot mã nguồn đã lưu .runtime/backups/before-v2-2026-10-15.

## 2. Features đã thêm

Catalog HSK theo cấp, pipeline CTI/dictionary có provenance, onboarding 4 bước, daily plan/Today, practice hub, lexical quiz, diagnostic từ vựng, weakness engine, grammar index/progress, Hanzi stroke/canvas, writing drafts/rubric, microphone recording/playback và admin API SQLite có import/review/versioning.

## 3. Phần cũ được giữ

Timer, autosave/resume, audio gate/recovery, section handling, answer sheet, scoring, submit idempotent, history/mistakes, SM-2 cá nhân và localStorage schema 3. Bổ sung bảo vệ nhiều tab, không reset dữ liệu cũ.

## 4. UI

Giữ nền sáng/teal/cards. Desktop có 6 mục theo hành trình. Mobile bottom nav 5 mục, ẩn trong exam. Vocabulary mở bộ học theo cấp; CSV cá nhân nằm nâng cao. Readiness thiếu bằng chứng hiển thị rõ, không tạo số giả.

## 5. Database

Preparation schema 1/key mới độc lập với core schema 3; audio lưu IndexedDB. Local content API có SQLite content revisions/import reports/audit, WAL và migration CREATE IF NOT EXISTS. PostgreSQL/Supabase đích chưa được áp dụng.

## 6. Dữ liệu nhập

11.000 mục từ, 576 tên cấu trúc khớp nguồn, 3.088 Hán tự đọc, 169 nhóm topic, 166 task title. Không nhập PDF/sample questions/example passages/answer keys/audio CTI vào public. Mục từ có thể phân biệt đồng tự theo số mục/cách đọc, không gộp sai các homograph.

## 7. Nguồn

Word/level/pinyin facts đối chiếu CTI syllabus 2025 đúng SHA256. Nghĩa từ CVDICT/CC-CEDICT; English dictionary fields từ Complete HSK Vocabulary. Data adaptation CC BY-SA 4.0 kèm MIT notice upstream. Stroke hanzi-writer-data dùng Arphic Public License đầy đủ. Xem HSK_DATA.md và THIRD_PARTY_NOTICES.md.

## 8. Số lượng theo cấp

| Cấp | Từ bổ sung | Grammar source-matched | Hanzi |
|---|---:|---:|---:|
| 1 | 300 | 68 | 246 |
| 2 | 200 | 71 | 125 |
| 3 | 500 | 88 | 284 |
| 4 | 1000 | 95 | 441 |
| 5 | 1600 | 70 | 431 |
| 6 | 1800 | 50 | 413 |
| 7–9 | 5600 | 134 | 1148 |

Số bổ sung riêng từng cấp, không phải tổng tích lũy.

## 9. Grammar coverage

576 mục công thức/category đã đối chiếu chuỗi với nguồn; 17 mục chưa khớp ở data/staging, không vào catalog. Chưa có đủ hướng dẫn Việt, lỗi thường gặp, bài tập và ví dụ đã duyệt cho từng cấu trúc. Browser/progress hoạt động, chưa coi đây là giáo trình grammar hoàn chỉnh.

## 10. Hanzi coverage

3.088 ký tự đọc với nguồn/cấp. 2.989 có stroke paths, 99 chưa có. Animation từng nét, viết mẫu, undo/reset và ghi nhận luyện đã kiểm tra bằng pointer CDP. Không có AI nhận dạng/chấm chữ.

## 11. Questions

Giữ 20 câu độc lập trong ba bank. Lexical quiz tạo theo yêu cầu từ bộ từ, có bốn nghĩa khác nhau và snapshot; không nhân số câu gốc thành kho đề production. Câu hỏi mới từ admin có draft/review/publication, engine kiểm tra payload trước khi nhận.

## 12. Mock catalog

Mini test dùng cùng bank minh họa, thời gian tùy chỉnh, trạng thái đã làm/tiếp tục. 0 full mock đủ điều kiện học thuật/quyền/audio. Admin có builder mini test từ câu PUBLISHED; full exam vẫn cần cấu hình và validator cũ, chưa có wizard đầy đủ từng section/scoring.

## 13. Audio

0 audio mock được cấp quyền. TTS được ghi rõ chỉ phục vụ phát âm và practice minh họa; full gate cần file. Audio metadata có loại quản trị riêng. Microphone recording/playback lưu trên máy, chưa có STT/feedback tự động.

## 14. Backend/auth

Node 24 local API + SQLite tại 127.0.0.1:8787. Admin bearer token, loopback origin, giới hạn payload, prepared statements và audit. Chưa có user account, RBAC nhiều người, cloud source of truth hoặc Supabase runtime.

## 15. Admin

CRUD revision cho vocabulary/grammar/hanzi/questions/exams/audio metadata; JSON editor/templates; CSV mapping/quoted cells, JSON import, validate/preview/apply DRAFT, report/checksum replay. Explicit review rồi publish; archive không delete. Dữ liệu công bố ghép vào catalog. API integration và browser workflow đã qua.

## 16. Study Plan

Rule-based daily tasks theo target/budget/ngày thi/coverage/review due và số câu thật; giữ snapshot ngày, CTA tiếp theo và Skip. Cận thi giảm học mới. Chưa có huấn luyện học thuật dài hạn hoặc tuần mock đã duyệt.

## 17. Weakness engine

Giữ recurrence/last wrong/correct streak/mastery/next review từ lịch sử; lý do lỗi do learner chọn; luyện tương tự từ pool thực có. Hai lượt đúng = củng cố nội bộ, không phải mastery HSK được chuẩn hóa. Legacy thiếu grammar/topic/vocab tags đầy đủ.

## 18. Result analytics

Giữ theo skill và lời giải; thêm dạng câu yếu khi mẫu đủ 3 và next action. Trung bình cả bài chỉ hiện từ 5 câu. Chưa có thời gian từng câu, không tự tạo slow-question insight.

## 19. Readiness

Weights riêng 40/20/15/10/10/5. Cần ít nhất 2 full mock đã duyệt và 30 câu; thiếu thành phần trả null và giải thích. Không gọi độ chính xác minh họa là điểm HSK/khả năng đỗ. Hiện không có đủ full mocks nên UI chủ động giữ trạng thái chưa đủ dữ liệu.

## 20. Tests

Baseline và V2: typecheck, lint TypeScript/unused, unit core, content validation, test:v2, test:admin, browser QA và production build đều qua. Chi tiết TESTING.md. Browser fixture dùng profile riêng; admin QA records được archive.

## 21. Build

Vite build PASS, course/admin/diagnostic/response tách chunk. Catalog/strokes là fetch tĩnh theo cấp/chữ, không vào main JS. Bundle chính: JS 397,46 kB (gzip 121,39 kB), CSS 61,25 kB (gzip 12,67 kB). Course chunk 14,94 kB, admin 13,34 kB, diagnostic 3,32 kB, response 5,61 kB. Chưa chạy Lighthouse/Web Vitals.

## 22. Mobile

Browser QA 9 màn ở 320/375/390/430px, không tràn ngang. Bottom nav 5 mục, không render trong exam. Chưa xác minh mọi thiết bị vật lý hoặc microphone thật.

## 23. Performance

List phân trang, chỉ tải cấp đang chọn, mẫu nét tải từng chữ, SW v4 cache JSON đã mở/lazy chunks. Level 7–9 vẫn là shard lớn 5.600 mục; chưa chuyển sang pagination phía server hoặc virtualized query. Chưa đo p95/Web Vitals.

## 24. Security

Không dùng dangerouslySetInnerHTML cho content. Token không nằm trong bundle; .runtime/raw bị ignore. Revision optimistic conflict và local session lease tránh ghi đè. LocalStorage/IndexedDB không mã hóa. Đáp án tự học vẫn có trên client; không dùng cho thi được giám sát/chống gian lận.

## 25. Giới hạn

Nghĩa Việt cộng đồng có machine assistance, chưa review từng mục; 557 mục thiếu VI. Grammar chưa đủ lesson/bài tập Việt. Không có full mock/audio chuẩn, cloud/account sync, STT/AI grading, RBAC multi-user hoặc admin exam wizard đầy đủ.

## 26. Content gaps

Cần nhà biên soạn duyệt từ/grammar/questions, bổ sung audio có quyền và gắn tag theo syllabus, mở rộng writing/speaking prompts và bộ mock đủ blueprint. Generated editor templates luôn là draft cần review. Không gọi các phần thiếu này là đã hoàn thành.

## 27. Giai đoạn kế tiếp

Ưu tiên duyệt học thuật 17 grammar/557 nghĩa thiếu và xây lesson Việt, bổ sung question bank/audio hợp pháp và full mocks; sau đó triển khai Supabase/auth/sync theo schema/RLS. Các luồng local V2 hiện dùng được mỗi ngày, vẫn cần giai đoạn nội dung và cloud để đạt toàn bộ brief production.

# V7 · Release gates

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

| Gate | Status | Evidence/Blocker |
| --- | --- | --- |
| Engineering | PASS | 19 scripts + six browser jobs + data safety |
| Content validity | PASS | 396 cấu trúc; heuristic không phải language review |
| Linguistic review | BLOCKED | 0 human / 396 câu chờ |
| Exam specification | PARTIAL | HSK1/HSK2 paper types/counts có evidence; IBT/scaled score chưa |
| Media rights | BLOCKED | 80 synthetic voice rights chưa rõ |
| Security | PARTIAL | Foundation tested; live infrastructure và atomic multi-tab capture chưa |
| Accessibility | PARTIAL | DOM/keyboard/contrast mẫu; screen reader chưa |
| Release | BLOCKED | Không publish/deploy production |

- BLOCKED_FOR_HUMAN_REVIEW: ngôn ngữ, pinyin, cấp, đáp án, ảnh và phát âm chưa có người duyệt chuyên môn
- MEDIA_RIGHTS_BLOCKED: 80 giọng huayan synthetic chưa xác minh quyền phân phối production
- EXAM_RULES_NOT_VERIFIED: quy tắc IBT, replay, điều hướng và điểm HSK chính thức
- CLOUD_NOT_DEPLOYED: chưa cấu hình Supabase/PostgreSQL/SMTP/HTTPS/RLS runtime; đa thiết bị thật chưa kiểm
- CLOUD_MULTI_TAB_CAPTURE_NOT_VERIFIED: capture queue dùng localStorage chia sẻ, chưa chứng minh tính nguyên tử giữa nhiều tab; phải khóa production cloud cho tới khi khắc phục/kiểm thử
- PRODUCTION_EXAM_SECRECY_NOT_VERIFIED: adapter server grading mới được kiểm tra cô lập; private offline Preview còn answer keys ở client
- ACCESSIBILITY_PARTIAL: chưa kiểm screen reader/Firefox/WebKit/mobile thật; không chứng nhận WCAG
- HSK2_BLOCKED: chưa có question/audio bank; xung đột đánh số đáp án phần Viết; chưa đủ cơ sở mở mock

Engineering pass không tự chuyển content approved. Content approved không làm đề thành official CTI. BETA không phải production release.

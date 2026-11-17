# V7 · Báo cáo bàn giao

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

## Kết quả

**Engineering PASS. Local/private beta; content pending final human review. Không phát hành production.**

| Loại | Total | Draft | Needs Review | Internal valid | Human | Published |
| --- | --- | --- | --- | --- | --- | --- |
| vocabulary | 300 | 0 | 300 | 300 | 0 | 0 |
| grammar | 68 | 0 | 68 | 68 | 0 | 0 |
| questions | 396 | 0 | 396 | 396 | 0 | 0 |
| audio | 80 | 0 | 80 | 80 | 0 | 0 |
| templates | 1 | 0 | 1 | 1 | 0 | 0 |
| images | 30 | 0 | 30 | 30 | 0 | 0 |
| optionBanks | 8 | 0 | 8 | 8 | 0 | 0 |

## V6 → V7

| Hạng mục | V6 | V7 |
| --- | --- | --- |
| Question bank | 396 | 396; kiểm full registry + heuristic |
| Grammar | 68 ≥5 related | 68 ≥5 related; 2 lesson revision; lọc trùng ví dụ |
| Media fairness | Audio pause; image retry | Audio + image loading/error pause; cap300s; persisted recovery |
| Review | Revision CAS; notes ghi đè cùng revision | Thêm workVersion CAS/export/import/authorized human credential/diff/filters |
| Results | Theo skill | Thêm part thực tế, luyện part/câu trống |
| HSK2 | DATA_ONLY, chưa mở PDF | DATA_ONLY, blueprint9part60q paper; phát hiện xung đột đáp án |
| Account | Foundation double | Thêm concurrent refresh/key validation tests; live chưa deploy |
| Screenshots | V6 gallery | V7 screenshots/manifest/before-after ZIP |
| Production | BLOCKED | BLOCKED; không tự publish |

## Kiểm thử thực tế

| Script | Status | ms |
| --- | --- | --- |
| typecheck | PASS | 729 |
| lint | PASS | 574 |
| test | PASS | 5148 |
| test:v2 | PASS | 5892 |
| test:v3 | PASS | 5728 |
| test:v3-api | PASS | 787 |
| test:v4 | PASS | 6264 |
| test:v5 | PASS | 407 |
| test:v5-api | PASS | 2783 |
| test:v6 | PASS | 5501 |
| test:v6-api | PASS | 6256 |
| test:account | PASS | 896 |
| test:admin | PASS | 568 |
| check:content | PASS | 5628 |
| build | PASS | 2744 |
| test:v7 | PASS | 2454 |
| test:v7-api | PASS | 2477 |
| test:v7-account | PASS | 267 |
| test:v7-sync | PASS | 1979 |

## 60 câu trả lời bàn giao

| # | Hạng mục | Status | Chi tiết |
| --- | --- | --- | --- |
| 1 | Source commit/version | PASS | Không có Git metadata; V7 source SHA eff5cdfad4a6745537afdfd4366868e8e3dd3c6dbc63862ea12ca83263f9016a; editorial v6-hsk1-r1 |
| 2 | Database trước/sau | PASS | 2929 → 2951 historical revisions; integrity ok |
| 3 | Migration | NOT APPLICABLE | Không đổi schema; optional session fields giữ schemaVersion3 |
| 4 | Mất câu hỏi | PASS | 0 mất; active396 |
| 5 | Question IDs | PASS | Giữ toàn bộ |
| 6 | HSK1 vocabulary | PASS | 300 |
| 7 | HSK1 grammar | PASS | 68 |
| 8 | HSK1 questions | PASS | 396 |
| 9 | Exam candidates | PASS | 80 |
| 10 | Guided practice | PASS | 130 |
| 11 | Independent practice | PASS | 186 |
| 12 | Câu bị flag | PARTIAL | 199 heuristic candidates; không đồng nghĩa sai |
| 13 | Câu thực sự sửa | PASS | 0 Q; 2 lesson examples revised |
| 14 | Câu còn cần duyệt | BLOCKED | 396 |
| 15 | Human Reviewed | BLOCKED | 0 |
| 16 | Published | BLOCKED | 0 |
| 17 | Review workflow | PASS | Draft/next/issues/skip/return/diff/media/export/import; expert gate locked until configured |
| 18 | CAS/revision | PASS | Revision+fingerprint+workVersion; 409 stale/import atomic |
| 19 | HSK1 independent mocks | PASS | 2 ×40 |
| 20 | Pool overlap | PASS | 0 first/second; third reuse warning |
| 21 | Matching/shared banks | PASS | Canonical map, partial not correct, bank snapshots fixed |
| 22 | Timer/media | PASS | Common pause/retry/refresh/cap/fallback; platform policy |
| 23 | Audio total | PASS | 80 |
| 24 | Audio rights verified | BLOCKED | 0 |
| 25 | Human pronunciation | BLOCKED | 0 |
| 26 | Images | PARTIAL | 30 hashes and browser load; human0/rights review pending |
| 27 | Grammar coverage | PARTIAL | 68/68 ≥5 related; some have <5 non-overlap independent |
| 28 | Answer leak | PARTIAL | No premature solution UI in tested flows; private client payload still has keys |
| 29 | HSK2 blueprint | PARTIAL | Paper9part60Q; answer numbering conflict; not IBT verified |
| 30 | HSK2 data changed | PASS | No public/data change; only config metadata |
| 31 | Backend configured | BLOCKED | NOT_CONFIGURED |
| 32 | Supabase live | NOT VERIFIED | No credentials/QA project |
| 33 | RLS live | NOT VERIFIED | SQL static + fixture supplied, no PostgreSQL execution |
| 34 | Email recovery live | NOT VERIFIED | Provider double only |
| 35 | Multi-device sync | PARTIAL | Isolated owner/CAS/replay fixtures; live+atomic multi-tab not verified |
| 36 | Guest retained | PASS | Storage keys unchanged; guest/browser regressions |
| 37 | SRS retained | PASS | SM2/unique events tested; no scheduler rewrite |
| 38 | Study plan retained | PASS | Existing services and keys |
| 39 | Historical attempts | PASS | Snapshot/storage regression; no real learner storage reset |
| 40 | Browser tests | PASS | See six-job matrix |
| 41 | Firefox | NOT VERIFIED | Binary unavailable |
| 42 | WebKit/Safari | NOT VERIFIED | Unavailable |
| 43 | Real mobile | NOT VERIFIED | Viewport emulation only |
| 44 | Accessibility | PARTIAL | Keyboard/AX/labels/colors/text scaling; no screen reader |
| 45 | Performance | PASS | Measured20samples; table separate |
| 46 | Typecheck | PASS | Actual npm script |
| 47 | Lint | PASS | Actual npm script |
| 48 | Unit tests | PASS | V7 439 assertions + media12 + existing suites |
| 49 | API tests | PASS | V7 23 assertions + V6/V5/V3 |
| 50 | E2E | PASS | Real Chrome/Edge; isolated profiles |
| 51 | Build | PASS | Actual Vite build |
| 52 | Screenshots | PASS | Actual application captures; manifest/gallery |
| 53 | Before/After | PASS | V6 stored baseline + V7; ZIP/contact sheets |
| 54 | Remaining P0 | PASS | No confirmed P0 in tested local/private flows |
| 55 | Remaining P1 | BLOCKED | Production-only blockers: rights/human/cloud/secrecy/atomic multi-tab, accessibility gaps |
| 56 | Licensing blockers | BLOCKED | huayan rights + content rights review |
| 57 | Human review blockers | BLOCKED | All883 release records pending |
| 58 | Security blockers | BLOCKED | Live infrastructure/RLS/HTTPS/atomic sync; adapter not mounted |
| 59 | Production deployed | NOT APPLICABLE | No deployment requested/performed |
| 60 | Overall readiness | PARTIAL | TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW; private only |

## Các điều kiện chưa hoàn tất

- BLOCKED_FOR_HUMAN_REVIEW: ngôn ngữ, pinyin, cấp, đáp án, ảnh và phát âm chưa có người duyệt chuyên môn
- MEDIA_RIGHTS_BLOCKED: 80 giọng huayan synthetic chưa xác minh quyền phân phối production
- EXAM_RULES_NOT_VERIFIED: quy tắc IBT, replay, điều hướng và điểm HSK chính thức
- CLOUD_NOT_DEPLOYED: chưa cấu hình Supabase/PostgreSQL/SMTP/HTTPS/RLS runtime; đa thiết bị thật chưa kiểm
- CLOUD_MULTI_TAB_CAPTURE_NOT_VERIFIED: capture queue dùng localStorage chia sẻ, chưa chứng minh tính nguyên tử giữa nhiều tab; phải khóa production cloud cho tới khi khắc phục/kiểm thử
- PRODUCTION_EXAM_SECRECY_NOT_VERIFIED: adapter server grading mới được kiểm tra cô lập; private offline Preview còn answer keys ở client
- ACCESSIBILITY_PARTIAL: chưa kiểm screen reader/Firefox/WebKit/mobile thật; không chứng nhận WCAG
- HSK2_BLOCKED: chưa có question/audio bank; xung đột đánh số đáp án phần Viết; chưa đủ cơ sở mở mock

## Mở bản local/private

Tại LuyenThiHSK, chạy `npm run build`, rồi ba terminal: `npm run server`, `npm run account:server`, `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Mở http://127.0.0.1:4173/?view=preview. Dùng mã dòng cuối `.runtime/admin-access.txt`; không chia sẻ mã. Review: `?view=content-review`. Tài khoản chưa cấu hình vẫn học guest được. Không chạy lại các script v7-*-wiring/hardening/fix một lần; chúng chỉ phục vụ triển khai.

[Gallery](SCREENSHOT_GALLERY.html) · [ZIP ảnh](../../data/reports/v7/V7_SCREENSHOTS_BEFORE_AFTER.zip) · [Gói reviewer](../../data/review-packages/v7/reviewer-package.json) · [Readiness](V7_RELEASE_READINESS.md).

Dừng ở V7 để chủ dự án xem kết quả; không mở V8, không publish, không deploy.

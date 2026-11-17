# V8 · Báo cáo bàn giao

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

**TECHNICALLY BETA READY (PRIVATE SCOPE) / CONTENT PENDING FINAL HUMAN REVIEW. Production BLOCKED.**

| Loại | Total | Draft | Needs Review | Automated valid | Human | Published |
| --- | --- | --- | --- | --- | --- | --- |
| vocabulary | 300 | 0 | 300 | 300 | 0 | 0 |
| grammar | 68 | 0 | 68 | 68 | 0 | 0 |
| questions | 429 | 0 | 429 | 429 | 0 | 0 |
| audio | 80 | 0 | 80 | 80 | 0 | 0 |
| images | 30 | 0 | 30 | 30 | 0 | 0 |
| optionBanks | 13 | 5 | 8 | 13 | 0 | 0 |
| templates | 1 | 0 | 1 | 1 | 0 | 0 |

Workflow states: Draft=5, Needs Review=916, Automated valid=921, Human Reviewed=0, Published=0. Technical validation không phải human review. Existing public syllabus-fact datasets không nằm trong các bộ đếm editorial này.

| # | Hạng mục | Status | Bằng chứng/giới hạn |
| --- | --- | --- | --- |
| 1 | Source version | PASS | V8 filesystem; core v6-hsk1-r1; SHA a4f869d5a3dc11dc4a0fb48ce893b50b39c891226a94ad79a5e92ca4994f4540 |
| 2 | DB before/after | PASS | 2951 → 3015 |
| 3 | Schema changed | PASS | false |
| 4 | Vocabulary preserved | PASS | 300HSK1; public/data unchanged |
| 5 | Question IDs preserved | PASS | 396core retained +6HSK1 +27HSK2 |
| 6 | Historical revisions | PASS | 0missing;0changed content |
| 7 | Guest preserved | PASS | Original keys; isolated QA; real user profile not read/reset |
| 8 | SRS unchanged | PASS | SM2 algorithm retained; immutable event queue checks |
| 9 | HSK1 questions | PASS | 402=396core+6supplement |
| 10 | Exam candidates | PASS | 80 |
| 11 | Flags | PARTIAL | 199core +27new draft heuristic candidates |
| 12 | Flags resolved | BLOCKED | 0semantic resolved by human;199triage records prepared |
| 13 | Draft corrections | PASS | 3W2 metadata revisions;6grammar additions;0old core question edit |
| 14 | Human reviewed | BLOCKED | 0 |
| 15 | Published | BLOCKED | 0 |
| 16 | Reviewer workflow | PASS | API +UI; local authorization only |
| 17 | CAS conflicts | PASS | Revision+fingerprint+workVersion; whole transaction reject |
| 18 | HSK2 blueprint | PARTIAL | 9parts60 paper scope |
| 19 | Source numbering | BLOCKED | Sample51–60 vs key54–63 unresolved |
| 20 | HSK2 question count | PASS | 27 |
| 21 | Listening coverage | PARTIAL | 9draft,3parts;0audio |
| 22 | Reading coverage | PASS | 12private draft,4parts |
| 23 | Writing coverage | PARTIAL | 6draft,2parts;W2unscored |
| 24 | HSK2 media | PARTIAL | 0audio;13reused project images pending review |
| 25 | HSK2 human | BLOCKED | 0 |
| 26 | HSK2 mock | BLOCKED | No official/full mock |
| 27 | HSK1 independent sets | PASS | 2×40;0overlap first2 |
| 28 | Reuse warning | PASS | Third set reports repeats |
| 29 | Part practice | PASS | 8HSK1 +available HSK2part drafts |
| 30 | Results/explanations | PASS | Correct/incorrect/blank/ungraded;level maintained |
| 31 | Secure DTO | PASS QA | Nested whitelist; no key in pre-submit HTTP |
| 32 | Server grading | PASS QA | 20assertions;SQLite reopen |
| 33 | Atomic queue | PASS TARGET | Web Locks+durable journal; legacy read-through |
| 34 | Multi-tab E2E | PASS QA | 23checks/browser;10consecutive/browser;HTTP fixture |
| 35 | Idempotency | PASS QA | Same opId replay;no duplicate logical attempt |
| 36 | Audio reviewed | BLOCKED | 0human pronunciation |
| 37 | Audio rights | BLOCKED | Huayan dataset license unknown |
| 38 | Image rights | PARTIAL | 30projectSVG,review pending |
| 39 | Chrome | PASS | Full+extra+sync |
| 40 | Edge | PASS | Full+sync |
| 41 | Firefox | NOT VERIFIED | Binary unavailable |
| 42 | WebKit | NOT VERIFIED | Unavailable |
| 43 | Mobile viewport | PASS | 320/375/390/430/768/1280 |
| 44 | Screen reader | NOT VERIFIED | No NVDA/JAWS/VoiceOver session |
| 45 | Real device | NOT VERIFIED | REAL_MOBILE_NOT_VERIFIED |
| 46 | Accessibility | PARTIAL | Keyboard/AX/labels/text scale/forced colors |
| 47 | Performance | PASS LOCAL | 17metrics×20;approx V7 comparison |
| 48 | Typecheck | PASS | Actual script |
| 49 | Lint | PASS | Actual script |
| 50 | Unit tests | PASS | 287V8 +legacy suites |
| 51 | API tests | PASS | 35V8 +legacy suites |
| 52 | E2E | PASS | Raw browser matrix |
| 53 | Build | PASS | Actual Vite build |
| 54 | Screenshots | PASS | 308 |
| 55 | Before/After | PASS | V7 stored before +V8 actual captures |
| 56 | Remaining P0 | PASS | No confirmed P0 in verified private flows; scoped evidence only |
| 57 | Remaining P1 | PARTIAL | Không có P1 được xác nhận trong scope đã test; production gates và các bề mặt chưa kiểm vẫn còn |
| 58 | Licensing blockers | BLOCKED | Voice/dataset/media/content rights evidence |
| 59 | Human blockers | BLOCKED | 0reviewed;921editorial records pending finalreview |
| 60 | Production readiness | BLOCKED | No deploy,publish,livecloud or official score claims |

## V7 → V8

| Phạm vi | V7 | V8 |
| --- | --- | --- |
| HSK1 | 396Q | 402Q;396old retained+6selective draft |
| Quality | 199flags audit | 199resolution records+4batches;0fakehuman |
| HSK2 | DATA_ONLY blueprint | 27originaldraft9part;18playable/9missing audio |
| Review | CAS/allowlist | Tabs/batches/split preview/checklist/import preflight/V8 gates |
| Sync | Non-atomic shared capture | Durable journal+Web Locks;real tab/profile tests |
| Grading | Map isolated adapter | Nested DTO whitelist,rate/audit hooks,HTTP+SQLite reopen QA |
| Media | 80WAV/30SVG rights blocked | Assets retained,rights stillblocked |
| Production | BLOCKED | BLOCKED; private scope only |

## Mở web local

Trong LuyenThiHSK: `npm run build`; ba terminal `npm run server`, `npm run account:server`, `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Mở http://127.0.0.1:4173/?view=preview; mã riêng là dòng cuối .runtime/admin-access.txt, không đưa lên URL/chia sẻ. Review: ?view=content-review. Chọn Luyện tập / Mini / Mock rồi HSK2 bên dưới. Guest không cần cloud. Không chạy lại scripts v8-*-wiring/fix/hardening như setup; đây là scripts triển khai một lần.

[Danh mục](README.md) · [Gallery](SCREENSHOT_GALLERY.html) · [Reviewer ZIP](../../data/review-packages/v8/HSK1_CONTENT_REVIEW_V8.zip). Dừng ở V8; không tự mở V9.


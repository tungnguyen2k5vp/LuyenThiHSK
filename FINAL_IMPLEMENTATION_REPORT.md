> LEGACY / BASELINE trước V3. Trạng thái hiện hành: [CURRENT_STATE](docs/CURRENT_STATE.md).

# FINAL_IMPLEMENTATION_REPORT

> Báo cáo V1 lưu trữ. Trạng thái hiện hành nằm trong [FINAL_IMPLEMENTATION_REPORT_V2.md](FINAL_IMPLEMENTATION_REPORT_V2.md).

Ngày: 15/10/2026 · Project: `D:\ReactJS\LuyenThiHSK`

Đây là báo cáo cho bản chạy end-to-end hiện tại. Các mục đã xong và chưa xong được ghi riêng để không nhầm một prototype local với nền tảng backend production.

## 1. Những gì đã xây

- Giữ React 19 + TypeScript + Vite và exam engine hiện có.
- Thêm dashboard tiến độ cục bộ, chỉ tổng hợp attempts/từ thực có; số liệu rỗng được biểu diễn là rỗng, không có seed/fake stats.
- Thêm mục **Từ vựng**: từ riêng, CSV import preview/validation, provenance, tìm/lọc, sửa/xóa, xuất CSV/JSON, ôn theo SM-2 và lưu cục bộ.
- Nâng localStorage schema từ 1/2 lên 3, tạo backup trước migration, giữ sessions/attempts/review queue/legacy vocabulary progress.
- Rà soát README, stack, architecture và license cho 15 repository; không copy mã, câu hỏi, audio, dataset hoặc giao diện.
- Đối chiếu CTI syllabus/thông báo và cập nhật tài liệu nguồn, license, architecture, schema đích, quy trình import và báo cáo.

## 2. Architecture

React SPA, local-first; Vite static build; URL query làm route; localStorage schema 3. Không có API/database/auth/cloud. Chi tiết: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 3. Database/schema

Đã thiết kế mô hình normalized PostgreSQL/Supabase cho user/profile, syllabus/levels, vocabulary/meanings/examples, Hanzi, grammar, sources/imports/reports, question bank/exam, attempts, SRS, study plan, analytics, audit và RLS. Schema đích được ghi ở [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md); **chưa có SQL migration backend hoặc database đã áp dụng**.

## 4. Routes

- `?view=dashboard` (mặc định): thống kê cục bộ theo lượt đã nộp và từ đến hạn.
- `?view=exams`: danh sách đề.
- `?view=parts`: luyện theo phần/dạng câu.
- `?view=vocab`: từ cá nhân, import và SRS.
- `?view=mistakes`: câu sai/bỏ trống/đánh dấu.
- `?view=history`: lịch sử bài làm.
- `?view=info`: provenance, license, CTI và 15 repo.
- `session` và `attempt` trong URL mở phiên thi/kết quả đã lưu.

## 5. Features hoàn thành

Dashboard thống kê cục bộ; exam timer/audio gate/autosave/resume/answer sheet/submit một lần, objective scoring, manual self-review, kết quả, mistake queue, history; vocabulary CRUD cục bộ; CSV validation; SM-2; localStorage migration; responsive/mobile; offline app shell.

## 6. HSK data đã import

Từ CTI: **0**. Từ 15 repository: **0**. Không phát hành đề/audio/sample CTI hoặc dữ liệu community. Từ người học nhập qua giao diện chỉ tồn tại trong browser localStorage.

## 7. Nguồn dữ liệu

CTI syllabus PDF phát hành 11/2025, hiệu lực 07/2026; CTI công bố pilot HSK3.0 lần hai ngày 20/09/2026 và thông báo triển khai toàn cầu ngày 13/12/2026. Trang cấp độ 1–6 vẫn hiển thị bảng cấu trúc cũ và có khác biệt với thông báo pilot; không áp cấu trúc cũ cho blueprint HSK3.0. Từng link và ghi chú: [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md).

## 8. Số lượng theo cấp

| Nhóm nội dung hiện có | Câu gốc | Câu CTI/community đã nhập | Từ vựng HSK đã nhập |
|---|---:|---:|---:|
| HSK 2.0 demo | 5 | 0 | 0 |
| HSK 3.0 demo, edition/level chưa xác minh | 10 | 0 | 0 |
| Nhóm 7–9 demo | 5 | 0 | 0 |
| Grammar / Hanzi / sentence dataset | 0 | 0 | 0 |

20 câu là dữ liệu gốc minh họa của dự án. Ba bank chia sẻ nội dung theo chức năng; không tạo thành ba bộ đề độc lập mới.

## 9. Validation đã chạy

- CSV: giới hạn 2 MB/2.000 dòng; header bắt buộc; Hanzi/pinyin/nghĩa; level mapping; edition mismatch HSK 2.0 vs nhóm 7–9; duplicate Hanzi+pinyin; provenance metadata.
- Lưu trữ: kiểm tra record, date, interval, scheduler fields; backup và schema migration.
- Nội dung đề: source metadata, answer/option integrity, rights gate, số đề đủ điều kiện public.
- Browser flow: sáu menu và dashboard mặc định; CSV preview/add, refresh giữ tiến độ, SM-2 update, 375px không tràn, bài thi/audio/offline/section timer/history; không có ngoại lệ runtime.

## 10. Tests đã chạy

- `npm run typecheck` — PASS.
- `npm run check:content` — PASS: 3 bank gốc, 20 câu duy nhất, 0 đề full đủ điều kiện.
- `npm test` — PASS: chấm bài, migration 1/2→3, import/duplicate, SM-2, quota, route.
- `npm run test:browser` — PASS: six menus/default dashboard; exam URL/back/timer/audio/autosave/submit/results/history/mistakes/offline; CSV/SM-2; mobile dashboard/vocabulary/exam tại 375px. Service worker shell cache được nâng lên v3 để cập nhật bản offline.
- `npm run report:web` — PASS: chụp 13 ảnh desktop/mobile và tạo [báo cáo Word 15/10/2026](docs/BAO_CAO_LUYEN_THI_HSK_2026-10-15.docx).

## 11. Build

`npm run build` — PASS với Vite 8.3.3. Bundle hiện tại: JS 355.74 kB / 109.38 kB gzip; CSS 50.15 kB / 10.50 kB gzip.

## 12. Performance

Chưa chạy Lighthouse/Web Vitals. Bundle ở mức trên; cần đo LCP/INP/CLS trên thiết bị thực và đánh giá chi phí localStorage với bộ import lớn. CSV mỗi lượt giới hạn 2 MB/2.000 dòng.

## 13. Security review

- Không có server, tài khoản, API key, payment hoặc endpoint công khai.
- CSV được render qua React text binding, không đưa vào `dangerouslySetInnerHTML`; file size/row count/field length được giới hạn.
- LocalStorage không mã hóa và chỉ tách theo browser profile/origin; người có quyền truy cập profile có thể đọc/xóa dữ liệu.
- Đáp án mẫu nằm trong bundle client, phù hợp tự học; không phù hợp kỳ thi được giám sát/chống gian lận.
- Chưa có admin/RBAC/RLS backend. Hướng dẫn bảo mật khi triển khai server nằm trong schema đích.

## 14. Known limitations

Không có từ/grammar/Hanzi chính thức; không có full mock exam được kiểm chứng; không có thật audio CTI, chấm viết/nói tự động, tài khoản, sync hoặc admin server. Edition/cấp nhập trong từ cá nhân là khai báo. CTI syllabus được liên kết, chưa tái phát hành dữ liệu.

## 15. Chưa hoàn thiện

Admin CRUD server, import staging/rollback, Postgres/RLS, official dataset reconciliation, grammar/Hanzi/listening/reading/writing/speaking curriculum, server analytics và personalized study plan. Dashboard hiện có chỉ chạy cục bộ dựa trên lịch sử thiết bị.

## 16. Vòng tiếp theo

1. Chốt quyền tái phân phối vocab/grammar/Hanzi theo asset; xây import CTI versioned và báo cáo đối chiếu.
2. Tạo Supabase project + migration/RLS, auth guest và account sync có export/delete.
3. Tạo admin theo role, review/publish workflow, audit log và secure server-side answer keys.
4. Mở rộng vocab review sang grammar/Hanzi, mistake-driven practice, study plan/analytics.
5. Chỉ phát hành full exam sau học thuật/rights/audio review độc lập.

## 17. File quan trọng đã thay đổi

- `src/components/dashboard/StudyDashboard.tsx`, `src/components/library/VocabularyWorkspace.tsx`, `src/services/vocabularyImport.ts`, `src/services/sm2.ts` — dashboard cục bộ, từ cá nhân, CSV và lịch ôn.
- `src/services/studyStorage.ts`, `src/services/examRoute.ts`, `src/ExamApp.tsx`, `src/styles/vocabulary.css` — schema 3, route và giao diện.
- `scripts/test-study.mjs`, `scripts/exam-browser-check.mjs` — unit/browser acceptance flows.
- `scripts/create-exam-report.py` — báo cáo Word và ảnh màn hình hiện hành.
- `docs/REFERENCE_REPOSITORIES.md`, `docs/DATA_SOURCES.md`, `docs/CONTENT_LICENSES.md`, `docs/CONTENT_POLICY.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE_SCHEMA.md`, `docs/ADMIN.md`, `README.md`.

## 18. Migration

Đã tạo localStorage migration 1→3 và 2→3. Schema 1 được backup tại `hsk-study-data-v1-backup`; schema 2 tại `hsk-study-data-v1-backup-v2`. Dữ liệu cũ được đọc/lọc theo schema, không gọi `clear()`; vocabulary progress cũ vẫn giữ trong trường `vocabulary`. Chưa có database migration SQL.

## 19. Cách chạy

```powershell
cd D:\ReactJS\LuyenThiHSK
npm install
npm run dev -- --host 127.0.0.1
```

Production preview: `npm run build`, sau đó `npm run preview -- --host 127.0.0.1 --port 4173`; mở `http://127.0.0.1:4173`.

## 20. Admin usage

Không có tài khoản admin trong bản này. Người học quản lý bộ từ cá nhân tại **Từ vựng → Nhập dữ liệu/Danh sách**. Quy trình đầy đủ và giới hạn ở [`docs/ADMIN.md`](docs/ADMIN.md).


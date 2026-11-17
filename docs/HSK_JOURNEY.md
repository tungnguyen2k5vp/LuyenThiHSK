# HSK Journey · 22/10/2026

Giao diện luyện HSK mới nằm ngay trong `LuyenThiHSK`, tham khảo cách tổ chức của [Migii](https://hsk.migii.net/vi/): tổng quan, kho đề, luyện kỹ năng, lộ trình và thư viện kiến thức. Dùng React, CSS và các luồng học có sẵn; không thêm dependency vào ứng dụng.

## Mở website

Mở **http://127.0.0.1:4173/**. Bản production preview và content API đã được khởi chạy local khi bàn giao.

Để chạy lại, tại `D:\ReactJS\LuyenThiHSK`:

```powershell
npm run build
```

Sau đó dùng các terminal riêng:

```powershell
npm run server
```

```powershell
npm run account:server
```

```powershell
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Account server là phần có sẵn, cần cấu hình provider để đăng nhập. Khi chưa cấu hình, học ở chế độ khách và lưu dữ liệu trên thiết bị vẫn dùng được. HTTP `/api/account/session` trả 503 trong trạng thái NOT_CONFIGURED; không phải chứng nhận đăng nhập hoạt động.

| Đường dẫn | Chức năng |
| --- | --- |
| `/` | Tổng quan mới, tiến độ thật, mở tiếp bài đang làm |
| `/?view=plan` | Thiết lập và kế hoạch học cũ |
| `/?view=exams` | Kho đề, Mini Test và bộ lọc cũ |
| `/?view=practice` | Luyện từng kỹ năng |
| `/?view=vocab&level=HSK%202` | Mở đúng bộ từ HSK 2 |
| `/?view=review` | Điểm yếu và câu sai |
| `/?view=progress` | Thống kê bài làm |
| `/?view=settings` | Tài khoản, mục tiêu, xuất dữ liệu, quản trị |
| `/?view=preview` | Private Preview V15 có sẵn; cần mã riêng |

## Những phần được tận dụng

| Source | Trách nhiệm giữ nguyên |
| --- | --- |
| `src/main.tsx`, `App.tsx`, `ExamApp.tsx` | Khởi tạo React, điều hướng, phiên luyện, lưu và hoàn tất bài |
| `src/data` | Ngân hàng câu hỏi, registry, blueprint và điều kiện đề công khai |
| `src/components/exam`, `services/answerScoring.ts`, `examRules.ts` | Phòng thi, dạng câu hỏi, nghe, chấm điểm, điều hướng phần thi |
| `services/studyStorage.ts`, `sessionClock.ts`, `sessionLease.ts` | Snapshot phiên, khôi phục, giới hạn thời gian, bảo vệ phiên |
| `components/preparation`, `studyPlan.ts`, `readiness.ts` | Onboarding, lịch học, bài khởi động và đánh giá có đủ bằng chứng |
| `components/learning`, `curriculum.ts` | Từ vựng, ngữ pháp, Hán tự, tra cứu, bài luyện từ dữ liệu CTI/CVDICT |
| `components/library`, `sm2.ts`, `vocabularyImport.ts` | Bộ từ cá nhân, CSV và lịch ôn cách quãng |
| `weaknessEngine.ts`, `weaknessDimensions.ts`, `reviewQueue.ts` | Phân tích lỗi và lịch ôn câu sai |
| `speechProvider.ts`, `microphoneDraft.ts` | Ghi âm, lưu bản nháp nói trên thiết bị |
| `components/admin`, `server`, `shared` | Nhập nội dung, revision, kiểm duyệt, quyền nội dung và API local |
| `cloudSync.ts`, `server/account` | Owner dữ liệu, hàng đợi đồng bộ, tài khoản và xử lý xung đột |
| `adapters`, `contracts`, `ui-v13`, `ui-v14` | View model và giao diện các phiên bản Preview có sẵn |
| `public/sw.js` | Cache bài/asset; không cache API riêng tư |

Chỉ mục tĩnh tại `.runtime/hsk-source-inventory.json`: **318 file mã/khai báo** trong `src`, `server`, `shared`, gồm hash, imports, exports; không có lỗi phân tích cú pháp. Đây là chỉ mục source hiện hành, không coi các bản bàn giao lưu trữ là những ứng dụng độc lập cần viết lại.

Các file source cũ được sửa: `ExamApp.tsx`, `services/examRoute.ts`, `components/learning/CourseWorkspace.tsx`. Thêm `HskHome.tsx`, `HskNavigation.tsx`, `hsk-portal.css` và bài kiểm tra portal. Browser flow onboarding được đổi điểm vào sang `view=plan`. Không xóa file source cũ; không thay khóa localStorage, schema hay quy tắc chấm điểm. CSS mới có breakpoint, menu điện thoại, focus bàn phím và giảm chuyển động theo cài đặt thiết bị.

## REA và skills

[REA](https://github.com/morluto/rea) được clone tại **`D:\ReactJS\Rea-HSK-Reference`**, commit `d77bc0e8a`, version `6.7.0`. Đã chạy `npm ci`, khôi phục hai artifact Windows đúng version từ gói npm chính thức theo `native/windows/README.md`, rồi build source bằng `npm run build:cached`.

CLI sử dụng được:

```powershell
cd D:\ReactJS\Rea-HSK-Reference
node scripts/rea.mjs --help
```

Áp dụng skills `agency-frontend-developer`, `agency-minimal-change-engineer` và hướng dẫn REA trong `.agents/skills/reverse-engineer-anything/SKILL.md`. REA là công cụ phân tích; không nhập công cụ reverse engineering vào bundle website.

Đã dùng CLI REA khảo sát bản build trung gian và lưu `.runtime/rea-hsk-build-analysis.json`: 3.061 file được lập danh mục, 43 JavaScript được phân tích, không lỗi parse. Kết quả **partial**: bundle entry vượt giới hạn heap 1 GB; phân tích tĩnh không chứng minh hành vi runtime. Bản build cuối có hash khác do chỉnh tiếp menu/focus/màu chữ. Không dùng kết quả này để tuyên bố kiểm thử trình duyệt đã hoàn tất.

## Kiểm tra và giới hạn

- `npm run lint`, `npm run build`: PASS.
- `npm test`, `npm run test:v2`: chưa ổn định do timeout nạp module qua Vite SSR. Có một lần `npm test` PASS, nhưng lần chạy cuối cả hai lệnh đều timeout. Các assertion study/preparation PASS khi chạy bản tạm dùng loader TypeScript có sẵn trong REA để nhập module trực tiếp; kết quả này không được coi là Vite SSR đã được sửa. Thử giới hạn điểm quét không giải quyết được lỗi, nên đã giữ lại cấu hình Vite gốc.
- Kiểm tra mới: `node --import ../Rea-HSK-Reference/node_modules/tsx/dist/loader.mjs scripts/test-hsk-portal.mjs`: PASS. Kiểm tra route, nav đang chọn, markup menu, trạng thái rỗng, link kỹ năng, resume, tiến độ thật và không sửa dữ liệu khi render.
- HTTP preview: `/`, `/?view=plan`, manifest 7 cấp, `/api/health`, `/api/public/content`: 200. Nội dung công khai từ API hiện có 0 record; giữ các ngân hàng minh họa của source.
- Công cụ trình duyệt của phiên làm việc không có Chrome/IAB khả dụng, nên chưa kiểm thử trực quan, thao tác E2E hay chứng nhận accessibility desktop/mobile. Kiểm tra markup không thay thế kiểm tra này.
- Kho công khai vẫn gồm 20 câu minh họa gốc, chưa có full mock đủ điều kiện phát hành. Nội dung Preview và các điều kiện duyệt cũ được giữ lại; chưa triển khai website lên Internet.

## Bản sao trước khi sửa

`.runtime/backups/before-hsk-portal-2026-10-22/` chứa toàn bộ `src` trước thay đổi cùng README, index, package/lock và cấu hình Vite. Đối chiếu source cũ: 3 file thay đổi, **0 file bị xóa**. Không phục hồi DB chỉ để đổi giao diện; bản sao này dành cho source.

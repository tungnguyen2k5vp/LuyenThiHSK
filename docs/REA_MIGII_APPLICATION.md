# REA: phân tích Migii và áp dụng vào LuyenThiHSK

Cập nhật 22/10/2026. [Mở kho luyện trên máy](http://127.0.0.1:4173/?view=practice). Bản cục bộ, chưa triển khai production.

## Kết quả đã áp dụng

Giữ exam engine, curriculum, SM2, từ điển, admin, Private Preview và các khóa lưu tiến độ cũ. Catalog mới tại Luyện tập/Luyện từng phần/Kho bài có giờ cho chọn cấp, phiên bản, kỹ năng, dạng câu, tìm tên, trạng thái, phân trang 12 bộ, độ dài 10/20/tối đa 100 câu. Bài lấy từ câu thật, ưu tiên câu chưa làm trong các lượt gần đây. Dùng lại ExamRoom để trả lời, kiểm tra câu, đánh dấu, tự lưu/tiếp tục, tính giờ, nộp bài, xem kết quả và ôn câu sai.

Kho hiện có 1.563 câu khi API cục bộ hoạt động:

| Nguồn | Số câu | Trạng thái |
|---|---:|---|
| 20 câu minh họa gốc | 20 | Giữ nguyên |
| SQLite HSK 1 đọc/nghe | 355 + 43 | Nội dung AI, luyện cá nhân, chưa duyệt chuyên môn |
| SQLite HSK 2 đọc/viết | 88 + 24 | Nội dung AI, luyện cá nhân, chưa duyệt chuyên môn |
| 12 bộ cộng đồng Mandarin Zone HSK 4 | 1.033 | Khóa đáp án từ nguồn, chưa thẩm định độc lập |

Không đổi revision/trạng thái duyệt/quyền phát hành trong SQLite. Câu thiếu media hoặc quyền nguồn rõ ràng vẫn giữ trong DB nhưng không đưa vào catalog. Audio HSK 4 tải theo yêu cầu, cache ở `.runtime/community-audio/`, phục vụ byte ranges để phát/tua ổn định; chỉ tải URL CDN có trong manifest, khớp SHA-256 của URL.

## REA đã quan sát được gì

REA ở `D:/ReactJS/Rea-HSK-Reference`, phiên bản 6.7.0, commit `d77bc0e8a`. Dùng CLI `node scripts/rea.mjs`, skill `reverse-engineer-anything`, Chrome với profile tạm của công cụ. Không thay cấu hình MCP người dùng.

Lưu HTML và hơn 100 script Migii tại `.runtime/reference-migii/`; `acquisition.json` ghi URL, ngày và hash. REA kiểm kê 102 file liên quan, phân tích **4 file chọn lọc** (main/router, API service, exam module, practice module): 60.209 AST nodes, 471 findings, không lỗi parse; 98 file không được chọn. Đây là phạm vi có giới hạn, không phải toàn bộ source máy chủ.

| Bằng chứng | File trong `.runtime/` | Evidence ID |
|---|---|---|
| JavaScript | `migii-static-evidence.json` | `ev_69d5b65bac3c5fcf4d5e3b3b22f1ad4c606e509d20f14da7dc15cca823204c05` |
| Trang chủ | `migii-browser-evidence.json` | `ev_cc611f983bf4bffd02fc8fc86c44cef14792ab7b89ee43ef026d4169e0068969` |
| Danh mục đề | `migii-exams-evidence.json` | `ev_b57d474692a5d18ec25dfb7c0e83569be8bbf3635cb68e7b4791c9bb9cdc6117` |
| Chi tiết khi chưa đăng nhập | `migii-detail-evidence.json` | `ev_5fa1c24b460de86ddecf58e9467678e0018db79c13b28741413e52d1897ad12d` |

Đã quan sát HTTP 200 từ:

```text
GET https://hsk-api-web.migii.net/question-test/list?page=1&limit=12&level=1&search=&type=1&sort=ASC&language=vi
```

Payload `data.data[]` có `id`, `level`, `title`, `time`, `type`, `score`, `paymentType`, `totalQuestions`, `questionGroups[{name,score,count}]`, `linkPdfEN`, `linkPdfVI`. Đề 359/365 là FREE, 371 là PREMIUM; HSK 1 có 40 câu, nhóm nghe/đọc, 35 phút. UI có cấp độ, loại đề, tìm kiếm, trạng thái, phân trang.

JavaScript chứa route `hsk-1..6/(mock-test|advanced-test|skill-test)` và `(practice-listening|practice-reading|practice-writing)`. API service chứa `question-test/detail/?examId=...&lang=...`, `question-test/list-type?level=...`, `history/detail`, `PUT history/exam`, `scoring/ai-result`; interceptor thêm Bearer từ cookie accessToken. Đây là dấu vết tĩnh, không chứng minh đã gọi thành công hay biết schema server.

Mở `/vi/hsk-1/mock-test/359` ở chế độ khách bị chuyển về danh mục. Không vượt đăng nhập hoặc lấy đề premium. **Không truy cập database nội bộ Migii, không sao chép ngân hàng đề Migii.** Exam, QuestionGroup, Attempt/History, Answer, AccessPlan chỉ là các thực thể suy luận từ UI/API, không phải tên bảng đã xác minh.

## Ánh xạ vào kiến trúc có sẵn

| Luồng tham khảo | Cách triển khai |
|---|---|
| Catalog cấp/loại | `PracticeCatalog.tsx`, `PracticeEntry`; manifest nguồn mở + `GET /api/learner/catalog` |
| Đề/nhóm kỹ năng | `ExamItem`/`ExamQuestion`, `makePracticeSelection`; không thêm database đề thứ hai |
| Phòng làm bài | ExamRoom, exam rules, audio controls, scoring, kết quả có sẵn |
| Lịch sử/tiếp tục | Session/attempt có `examSnapshot` trong `hsk-study-data-v1`; giữ ID câu nguồn |
| Ôn điểm yếu | Review queue/SM2; snapshot giữ bài nguồn ngoài sau reload |
| Nội dung/media | SQLite `content(id,revision,kind,status,payload,...)`, media V5/V6; thêm đường đọc learner |
| Xuất bản | Giữ admin auth/publication gates; nội dung AI vẫn PREVIEW, không tự đổi PUBLISHED |

Server loopback giữ host/origin checks, admin write auth và giới hạn không chạy production. Tiến độ khách ở trình duyệt; không thêm bảng user/history. Backend tài khoản chưa cấu hình; chưa kiểm chứng đồng bộ tài khoản trong đợt này.

File chính: `src/components/preparation/PracticeCatalog.tsx`, `src/services/practiceCatalog.ts`, `src/ExamApp.tsx`, `server/learner-practice.mjs`, `server/community-audio.mjs`, `scripts/import-mandarin-zone.mjs`. Bản sao source trước đợt này: `.runtime/backups/before-learner-catalog-2026-10-22/`; không xóa dữ liệu DB gốc.

## Nguồn HSK 4 và giới hạn

Repo [Make-dream-clear/hsk4-mock-exam](https://github.com/Make-dream-clear/hsk4-mock-exam) tại `D:/ReactJS/HSK4-MandarinZone-Data`, commit `44a0832adc327500b4cc1d6f2dfc6ee90bbe4e92`. Attribution: Mandarin Zone, https://mandarinzone.com. **CC BY-NC-SA 4.0**, phi thương mại, bản dữ liệu chuyển đổi tiếp tục cùng giấy phép.

Chỉ dùng 12 bộ cộng đồng đầu, không nhập 7 bộ mang nhãn chính thức. 1.175 câu nguồn → 1.033 câu hợp lệ; bỏ 142: 19 thiếu nội dung cần thiết, 19 thiếu audio riêng, 59 thiếu/không hợp lệ lựa chọn hoặc khóa đáp án, 45 cần adapter hình/HTML. Nguồn/hash/lý do bỏ/ánh xạ audio ở `public/data/mandarin-zone/manifest.json`. Chạy lại bằng `node scripts/import-mandarin-zone.mjs`.

Giữ `answerVerified:false`, thêm `answerValidation:SOURCE_KEY_NOT_INDEPENDENTLY_REVIEWED`; chấm trắc nghiệm theo khóa nguồn và hiển thị trạng thái này. Một số lời giải tiếng Anh, còn lại chỉ có đáp án. Câu viết nhập được là dạng chọn đáp án; chưa chấm viết tự do. Thời gian tùy chỉnh, không phải đề đầy đủ chính thức, không dự đoán đỗ HSK. Không bổ sung ngân hàng đề cho HSK 3/5/6/7–9 trong lần này; curriculum/từ vựng và các câu minh họa cũ vẫn giữ nguyên.

## Chạy và kiểm tra

```powershell
cd D:/ReactJS/LuyenThiHSK
npm run build
# Hai terminal riêng:
npm run server
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Mở `http://127.0.0.1:4173/?view=practice`. API cổng 8787 cung cấp câu HSK 1–2/media/cache audio HSK 4. Audio HSK 4 cần mạng lần tải đầu; không tải sẵn toàn bộ audio.

PASS: `npm run lint`, `npm run build` và:

```powershell
node scripts/test-community-audio.mjs
node --import ../Rea-HSK-Reference/node_modules/tsx/dist/loader.mjs scripts/test-practice-catalog.mjs
node --import ../Rea-HSK-Reference/node_modules/tsx/dist/loader.mjs scripts/test-hsk-portal.mjs
```

Kiểm tra toàn bộ khóa đáp án 1.033 câu, chọn/lọc/ưu tiên câu mới, schema 510 câu cũ, snapshot bài/review sau reload, route chỉ đọc và dữ liệu editorial không đổi. Audio kiểm tra dedup tải đồng thời, cache, range/tua, HEAD, 416, URL không cho phép, lỗi nguồn. Các assertion study/preparation cũ đã chạy qua TSX trực tiếp; không coi đó là PASS cho harness Vite SSR cũ vốn gặp timeout.

REA kiểm thử trình duyệt bằng profile tạm, không dùng tiến độ cá nhân:

| Luồng hoàn thành | File trong `.runtime/` |
|---|---|
| HSK 4 đọc: trả lời sai → kiểm tra → thoát → reload → tiếp tục giữ đáp án/phiên bản → nộp → ôn câu sai | `local-reading-final-evidence.json`, ID `ev_5dc15c0c3452529068859bc58c2aac7e01ce346cb55de369f62cf3f989aef450` |
| HSK 2 hình, 390×844: chọn/kiểm tra/reload/tiếp tục, hình hiển thị | `local-image-evidence.json` |
| HSK 1 audio sẵn sàng/đang phát | `local-audio-evidence.json` |
| HSK 4 audio sau sửa cache sẵn sàng/đang phát | `community-audio-cached-evidence.json`, ID `ev_a65c2f5b8d9b89c55e4b9b035f0548ee965086ca8a53bfcb5e76df4ee3785165` |
| HSK 4 có giờ: chọn bài → trả lời → nộp → kết quả | `local-timed-evidence.json`, ID `ev_9c2d8fdd37b4cdd2ddcfe2e964446dfecf9782f6d27d49aa296c7e569ac06668` |

Lỗi CDN trước sửa được giữ ở `community-audio-evidence.json`; bản cached mới đã thành công. Công cụ chặn service worker trong profile kiểm thử; không thấy lỗi JavaScript ứng dụng trong các luồng hoàn thành. Chưa kiểm thử hết mọi câu/audio hoặc mọi trình duyệt.

Ảnh catalog hiện tại: `.runtime/local-catalog-current-evidence.json.png` (1.563 câu); ảnh mobile câu hình: `.runtime/local-image-evidence.json.png`.

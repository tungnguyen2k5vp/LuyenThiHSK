# V4 — cách chạy, biên soạn và review HSK 1

## Mở bản hiện tại

1. Chạy `npm run server` trong `D:\ReactJS\LuyenThiHSK`.
2. Giữ preview tại `http://127.0.0.1:4173/` (hoặc `npm run build` rồi `npm run preview -- --host 127.0.0.1 --port 4173`).
3. Vào `http://127.0.0.1:4173/?view=preview` hoặc Tài khoản → HSK 1 Preview / BETA.
4. Nhập mã local trong `.runtime/admin-access.txt`. Mã chỉ lưu sessionStorage của tab; token không nằm URL hoặc bundle.

Nếu port đã chạy, dùng server hiện có. Duplicate API startup không còn ghi đè file token. Không mở file artifact gallery HTML như app chính. Không dùng `file://`. Giữ đúng origin127.0.0.1:4173 để tiếp tục dữ liệu cũ.

## Ba môi trường

| Môi trường | Điều kiện | Đường đi |
|---|---|---|
| DEV / PREVIEW | Nháp AI, NEEDS_REVIEW; có cảnh báo và metadata nguồn | API `/api/admin/v4/*` có bearer; route Preview riêng |
| BETA nội bộ | Schema/reference/checksum hợp lệ và AI internal self-check; chưa expert review | Chọn BETA trong Preview; API trả422 nếu validation hết hiệu lực |
| PRODUCTION | Workflow language/HSK level review + approval + quyền + publication gates | `/api/public/content` chỉ Published, production catalog validator giữ nghiêm |

BETA này dành cho chủ dự án dùng local/private; chưa triển khai public beta với tài khoản nhiều người. Không có người duyệt thật thì humanReview=BLOCKED_FOR_HUMAN_REVIEW. Không tự công bố.

## Nội dung thật đã chuẩn bị

Nguồn biên soạn: `data/editorial/v4/*.tsv` (300 nghĩa/ví dụ,68grammar,60ngữ cảnh). Artifact riêng `data/staging/v4/hsk1-release.json`:300worddraft,68lesson,128question,40audio metadata,1template. Mỗi lesson có một câu grammar;60câu ngữ cảnh gồm40nghe/20đọc. Template không tính là đề Official.

`scripts/build-v4-content.mjs` tạo bundle, gọi pypinyin từ `.runtime/tts/python`; pinyin câu vẫn chờ người kiểm tra. `render-v4-audio.mjs` gọi binary Piper cục bộ, tạo WAV `.runtime/v4-audio`; không đưa model/WAV vào public. `validate-v4-content.mjs` kiểm tra schema, IDs, lựa chọn/đáp án, referential integrity, exact duplicate stems, WAV checksum và fingerprint rồi ghi internalValidation=PASSED. Nó không xác minh sự đúng đắn ngôn ngữ.

Model huayan upstream ghi dataset license Unknown. Binary/model đã tải chỉ để nghiên cứu Preview riêng. Chưa thể dùng audio này trong production; thay voice có quyền hoặc xác minh quyền trước khi phân phối. Không cần tải lại khi dùng bản hiện tại. Muốn dựng lại phải có pypinyin0.55.0 tại `.runtime/tts/python` và Piper/model trong `.runtime/tts`; xem báo cáo license trước mọi thay đổi nhà cung cấp.

Quy trình dựng lại: `npm run data:v4:build` → `npm run data:v4:audio` → `npm run data:v4:validate` → `npm run data:v4:audit`. Đây là tái tạo artifact staging; không ghi đè revision đã sửa trong SQLite. Để cập nhật DB hiện có, reviewer sửa record qua form, tạo revision rồi revalidate. Script synthesize tạo lại ngẫu nhiên WAV; hash phải kiểm tra lại, không thay file dưới cùng metadata DB cũ.

## Review Queue

Nhấn “Đưa V4 vào hàng đợi” lần đầu; thao tác idempotent, không publish. Có lọc loại/trạng thái, tìmID/Hanzi/text, phân trang20, form sửa, revision conflict, tên reviewer/nhận xét/xác nhận. Audio Review Queue có40file kèm provider/voice/duration/license/status. Decode file chỉ cập nhật kiểm tra kỹ thuật, không ghi người nghe duyệt.

Reviewer thật đi qua Language Review → HSK Level Review → APPROVED. Từ vựng V4 cũng phải qua hai bước này. Publication vẫn bị chặn nếu license UNVERIFIED, validation không khớp fingerprint hoặc contentEnvironment=PREVIEW. Cần tạo revision phù hợp production, hoàn thiện nguồn/quyền, kiểm tra lại và duyệt lại; không đổi nhãn để bỏ qua gate.

Sàng lọc cấp nằm `data/reports/v4-level-screening.json`:64draft được đánh dấu bằng longest dictionary match. Đây là heuristic, có false positives như lượng từ 杯 hoặc tên riêng. Tìm ID tương ứng trong Review Queue; không coi64item đều sai. Endpoint private `/api/admin/v4/level-screening` trả cùng báo cáo.

## Engine và dữ liệu học

Preview dùng lại ExamRoom, ExamAudio, AttemptResult, GrammarLessonView, CourseWorkspace, SM2 và WeaknessWorkspace. Full35phút theo platform:20nghe15phút +20đọc20phút; section navigation, autosave, flags, timeout, submit và revision snapshots. Không giả xác minh CTI. Kết quả là phần trăm nội bộ; answerVerified=false vẫn giữ, Preview có nhánh chấm AI riêng.

Storage riêng: `hsk-v4-preview-study-v1` và `hsk-v4-preview-preparation-v1`. Không nhập attempt Preview vào readiness production. File audio cần API local và token; phiên đọc/answer snapshot giữ sau reload. Preview nghe offline cold-start chưa hỗ trợ preload đủ40file; production offline V3 giữ nguyên. Không quảng cáo offline listening Preview.

## Kiểm tra và giới hạn

`npm run test:v4` dùng DB tạm, không review/publish draft thật. `npm run test:browser:v4` dùng Chrome profile QA riêng; có API và preview4173 trước khi chạy. Đổi `HSK_BROWSER_PATH` sang Edge để đối chiếu. Browser test stage các bản nháp V4 thật và ghi browser decode audio, không đánh dấu human review. Test V3 publish fixtures chỉ trong DB tạm hoặc archive các fixture local ngay sau browserQA.

Chưa có expert language/pronunciation review, quyền voice production, official2025examformat, cloudauth, multiuserrevieweridentity hoặc Lighthouse/thiết bị thật. HSK2–3 giữ DATA_ONLY, không làm song song WaveA.

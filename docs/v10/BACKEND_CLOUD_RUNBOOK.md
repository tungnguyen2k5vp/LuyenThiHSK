# V10 · Chạy local và chuẩn bị staging

## Chạy website

Trong folder `D:\ReactJS\LuyenThiHSK`, mở ba terminal:

```powershell
npm run server
npm run account:server
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Sau khi sửa frontend, chạy `npm run build` trước khi mở preview. Website: http://127.0.0.1:4173/?view=preview . Mã local admin ở dòng cuối `.runtime/admin-access.txt`; mã đổi khi API khởi động lại. Chọn HSK 2 trong khu học thử. Không mở `dist/index.html` bằng `file://`.

Không chạy lại các script one-off `v10-wire-*`, `v10-polish-*`, `v10-fix-*` như lệnh cài đặt. Chúng là lịch sử triển khai, không phải migration setup.

## Audio

1. Mở `?view=content-review`, vào hàng đợi bằng mã local.
2. Mở **Chuẩn bị âm thanh HSK 2** → chọn transcript, kiểm revision.
3. Tải PCM16 WAV, khai báo nguồn/provider/voice/quyền và đường dẫn bằng chứng. Chỉ tải file thực sự có quyền sử dụng; không tải waveform QA làm nội dung nghe.
4. Server kiểm header/chunk/frame, dung lượng tối đa 12 MB, 1–90 giây, RMS/clipping/im lặng/hash. File đạt kỹ thuật tạo AudioAsset và revision câu hỏi mới bằng CAS. Transcript phải bằng nguyên văn câu hiện hành.
5. Nghe trên trình duyệt, đối chiếu nội dung/phát âm. PCM/RMS không phải LUFS, ASR hay human review.
6. Reviewer được cấp credential riêng mới ghi LICENSE_REVIEW / PRONUNCIATION_REVIEW cho asset revision và signature hiện hành. Khai báo quyền không tự trở thành xác minh quyền.
7. Quyền dùng riêng không cấp quyền publish production. Production vẫn cần đầy đủ cổng nội dung, quyền, phụ thuộc và human review.

[Env audio mẫu](../../server/cloud/.env.audio.example). Azure giữ tắt và cần đồng ý chi phí từng request. Qwen chỉ nhận endpoint loopback `http://127.0.0.1:PORT/synthesize`, không redirect; đây là contract riêng, chưa cài model/runtime. Request `{text, language:"Chinese", speaker:"Serena", format:"PCM16_WAV"}`; response binary PCM16 WAV. Giấy phép model và quyền voice/data/output phải kiểm riêng. Không clone giọng cá nhân, không tự tải model hoặc gọi paid provider.

## Staging cloud khi có môi trường riêng

1. Giữ bản backup SQLite và bản export tiến độ thiết bị. Không copy DB/token vào thư mục public hoặc gói bàn giao.
2. Dùng [server-only env](../../server/cloud/.env.example) với secrets riêng; không đặt `VITE_` cho credential. Chưa có cấu hình thì account BFF trả Guest / NOT_CONFIGURED.
3. Chạy [migration 001](../../server/cloud/migrations/001_learning_sync.sql) trên staging riêng. Chạy [RLS transaction QA](../../server/cloud/tests/rls-integration.sql) với hai owner; kiểm owner read/write, conflict và idempotency trước khi mở thật.
4. Xác minh HTTPS origin chính xác, cookie HttpOnly/SameSite/Secure, refresh/revocation/logout, SMTP, session expiry và rate limits.
5. Kiểm journal/WebLocks/operation ID/baseVersion/CAS khi offline reconnect, nhiều tab, hai thiết bị thật. Không ghi đè local Guest/Preview vào account khác.
6. Secure grading phải dùng storage bền vững, owner/nonce/expiry/idempotency và DTO không có answer keys trước submit. Adapter HTTP + SQLite hiện được thử trong QA, chưa mount production.
7. Xác minh restore từ backup trên staging riêng; chuẩn bị rollback config/migration có kiểm soát. Không ghi đè dữ liệu thật bằng fixture.
8. Hoàn thành human/media review và approval triển khai riêng trước khi public.

Hiện chưa tạo/deploy/kết nối cloud. Live RLS, email, HTTPS, auth lifecycle và hai thiết bị: **NOT_VERIFIED**. CI và thiết bị không có trong môi trường: **NOT_RUN / NOT_TESTED**, không suy từ fixture.

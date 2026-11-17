# V9 · Hiệu năng

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

Root cause đo bằng20 direct-server runs trên cùng bản SQLite V8: release dựng statement/query review cho từng record và scan tuyến tính; validation file/checksum chạy tuần tự. Đổi thành batch review Map2prepared statements thay884, validation8workers có giới hạn, giữ checksum/schema/order/autosave. Selection không bị tắt hoặc rút validation.

| Profile | Before p50 | Before p95 | After p50 | After p95 |
| --- | --- | --- | --- | --- |
| releaseMs | 61.88 | 76.73 | 41.15 | 58.62 |
| validationMs | 86.56 | 116.36 | 42.55 | 46.17 |
| selectionMs | 17.82 | 21.14 | 18.04 | 19.54 |
| totalMs | 166.32 | 223.53 | 101.19 | 122.93 |
| releasePreparedStatements | 884.00 | 884.00 | 2.00 | 2.00 |

| Metric | n | V8 p50 | V8 p95 | V9 p50 | V9 p95 | Δp95% |
| --- | --- | --- | --- | --- | --- | --- |
| coldDashboardReadyMs | 20 | 346.60 | 349.90 | 342.60 | 357.10 | 2.06 |
| domInteractiveMs | 20 | 13.60 | 20.00 | 15.00 | 19.40 | -3.00 |
| loadEventEndMs | 20 | 25.10 | 42.40 | 26.00 | 35.10 | -17.22 |
| searchPaintMs | 20 | 32.10 | 32.90 | 32.20 | 33.40 | 1.52 |
| questionTransitionPaintMs | 20 | 32.00 | 32.90 | 32.20 | 33.20 | 0.91 |
| examStartRenderMs | 20 | 480.80 | 643.20 | 189.50 | 224.80 | -65.05 |
| audioDownloadMs | 20 | 57.20 | 73.30 | 41.20 | 53.50 | -27.01 |
| imageDownloadMs | 20 | 94.50 | 109.10 | 46.50 | 49.90 | -54.26 |
| warmNavigationPaintMs | 20 | 32.00 | 34.60 | 32.10 | 33.50 | -3.18 |
| catalogPaintMs | 20 | 44.30 | 50.90 | 42.20 | 49.80 | -2.16 |
| matchingPaintMs | 20 | 31.90 | 33.40 | 32.40 | 33.30 | -0.30 |
| autosavePersistMs | 20 | 3.60 | 4.90 | 2.40 | 2.90 | -40.82 |
| resumeRenderMs | 20 | 17.00 | 32.00 | 15.70 | 30.80 | -3.75 |
| resultRenderMs | 20 | 24.50 | 33.80 | 24.90 | 32.90 | -2.66 |
| reviewFilterResponseMs | 20 | 117.50 | 149.00 | 79.20 | 84.50 | -43.29 |
| hsk2ListPaintMs | 20 | 31.90 | 33.80 | 32.40 | 33.10 | -2.07 |
| reviewSaveResponseMs | 20 | 5.50 | 6.20 | 4.40 | 4.90 | -20.97 |

V8 bàn giao ghi p95 mở bài 671,5 ms và lọc review 163,1 ms; baseline V8 đo lại trước V9 là 643,2 ms và 149 ms. V9 đạt 224,8 ms và 84,5 ms. Cả 17 metrics đều trong budget của lượt đo này.

Budget theo dõi: p95 không tăng >max(15%,10ms) so baseline với cùng phương pháp. Nếu vượt phải nêu raw delta/tradeoff; local scheduler/cache/network loopback không phải production scale hay Web Vitals chuẩn. Đo riêng sau QA,20observations/metric; không chọn mẫu tốt nhất. Reviewer-save tạo QAID riêng rồi archive, không sửa notes cũ. [Raw samples](../../data/reports/v9/performance.json), [profile trước](../../data/reports/v9/profile-before.json), [profile sau](../../data/reports/v9/profile-after.json).

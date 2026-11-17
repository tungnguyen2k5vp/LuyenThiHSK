# V12 · Hiệu năng local

Cùng harness legacy **17 metrics ×20 samples**, sau các bài kiểm tra khác; thêm 6 tương tác/API HSK2 ×20. Budget p95 = V11 p95 + max(15%,10ms). Không bỏ validation hoặc rewrite engine để chạy theo một spike.

| Metric | V11 p95 ms | V12 p95 ms | Budget ms | Trạng thái |
| --- | --- | --- | --- | --- |
| coldDashboardReadyMs | 352.8 | 376.2 | 405.7 | WITHIN |
| domInteractiveMs | 16.3 | 36.1 | 26.3 | ATTENTION |
| loadEventEndMs | 31.4 | 62.9 | 41.4 | ATTENTION |
| searchPaintMs | 33.0 | 32.8 | 43.0 | WITHIN |
| questionTransitionPaintMs | 33.3 | 32.7 | 43.3 | WITHIN |
| examStartRenderMs | 201.5 | 364.9 | 231.7 | ATTENTION |
| audioDownloadMs | 45.4 | 68.6 | 55.4 | ATTENTION |
| imageDownloadMs | 56.1 | 129.9 | 66.1 | ATTENTION |
| warmNavigationPaintMs | 33.8 | 33.8 | 43.8 | WITHIN |
| catalogPaintMs | 49.4 | 48.7 | 59.4 | WITHIN |
| matchingPaintMs | 33.3 | 33.2 | 43.3 | WITHIN |
| autosavePersistMs | 2.7 | 3.5 | 12.7 | WITHIN |
| resumeRenderMs | 31.7 | 29.3 | 41.7 | WITHIN |
| resultRenderMs | 31.3 | 32.8 | 41.3 | WITHIN |
| reviewFilterResponseMs | 92.1 | 109.4 | 105.9 | ATTENTION |
| hsk2ListPaintMs | 33.6 | 33.1 | 43.6 | WITHIN |
| reviewSaveResponseMs | 6.4 | 4.9 | 16.4 | WITHIN |

| HSK2 metric | p50 ms | p95 ms |
| --- | --- | --- |
| hsk2TodayPaintMs | 31.5 | 32.3 |
| hsk2VocabularyPaintMs | 31.7 | 33.1 |
| hsk2GrammarPaintMs | 31.7 | 32.8 |
| hsk2PracticeHubPaintMs | 31.4 | 32.6 |
| hsk2PracticeApiMs | 305.3 | 645.5 |
| hsk2MockReadinessApiMs | 233.2 | 242.2 |

V11 có lượt đầu 268,6ms rồi lượt riêng 201,5ms, chưa chứng minh nguyên nhân dao động. Giữ dữ liệu vượt ngân sách nếu có; không biến lần đo lại thành bằng chứng đã tìm nguyên nhân. Mốc V11 được đóng băng trong baseline V12.

Paint metric HSK2 đo hai animation frames sau click; API đo riêng, không phải tải toàn catalog qua mạng thật. Legacy audio đo file HSK1. Audio HSK2/mở mock có nội dung thật: **NOT_MEASURED_NO_ASSETS**. Local headless timings không là load test/production Web Vitals.

[performance](../../data/reports/v12/performance.json) · [Mốc V11](../../data/reports/v12/baseline/v11-performance.json).

## Hai lượt đo V12, không thay mã

| Metric | V11 p95 | V12 lượt đầu | V12 lượt riêng | Ngân sách | Lượt riêng |
| --- | --- | --- | --- | --- | --- |
| coldDashboardReadyMs | 352.8 | 348.1 | 376.2 | 405.7 | WITHIN |
| domInteractiveMs | 16.3 | 16.1 | 36.1 | 26.3 | ATTENTION |
| loadEventEndMs | 31.4 | 34.2 | 62.9 | 41.4 | ATTENTION |
| searchPaintMs | 33.0 | 33.4 | 32.8 | 43.0 | WITHIN |
| questionTransitionPaintMs | 33.3 | 33.6 | 32.7 | 43.3 | WITHIN |
| examStartRenderMs | 201.5 | 238.8 | 364.9 | 231.7 | ATTENTION |
| audioDownloadMs | 45.4 | 56.0 | 68.6 | 55.4 | ATTENTION |
| imageDownloadMs | 56.1 | 60.9 | 129.9 | 66.1 | ATTENTION |
| warmNavigationPaintMs | 33.8 | 33.2 | 33.8 | 43.8 | WITHIN |
| catalogPaintMs | 49.4 | 49.6 | 48.7 | 59.4 | WITHIN |
| matchingPaintMs | 33.3 | 33.0 | 33.2 | 43.3 | WITHIN |
| autosavePersistMs | 2.7 | 2.7 | 3.5 | 12.7 | WITHIN |
| resumeRenderMs | 31.7 | 28.0 | 29.3 | 41.7 | WITHIN |
| resultRenderMs | 31.3 | 32.4 | 32.8 | 41.3 | WITHIN |
| reviewFilterResponseMs | 92.1 | 98.6 | 109.4 | 105.9 | ATTENTION |
| hsk2ListPaintMs | 33.6 | 32.8 | 33.1 | 43.6 | WITHIN |
| reviewSaveResponseMs | 6.4 | 4.7 | 4.9 | 16.4 | WITHIN |

Lượt đầu có 2/17 chỉ số ATTENTION; lượt riêng có 6/17. Exam Start p95: 201,5 → 238,8 → 364,9 ms. Không chọn số tốt hơn để ghi đè số xấu. Chưa xác minh nguyên nhân; khác thời điểm/môi trường có thể ảnh hưởng nhưng chưa có bằng chứng để quy kết. Runner PASS chỉ xác nhận phép đo hoàn tất, không có nghĩa mọi budget đạt. [Dữ liệu lượt đầu](../../data/reports/v12/performance-first.json).

Bước tiếp: chạy A/B snapshot V11 và V12 trên cùng máy/browser/điều kiện, lấy trace giai đoạn mở exam (dựng snapshot, validation, persist, React render) và I/O media, ghi thêm OS CPU/RSS. Giữ validation, CAS và journal; không tối ưu bằng suy đoán. HSK2 API p95 645.5 ms cũng cần theo dõi; chưa có mốc A/B tương đương để tuyên bố mức hồi quy.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.

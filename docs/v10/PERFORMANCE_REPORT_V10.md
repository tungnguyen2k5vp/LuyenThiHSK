# V10 · Hiệu năng

lúc 09:25 Chủ Nhật, 18 tháng 10, 2026 (UTC+7) · Local/private

| Metric | V9 p95 ms | V10 p95 ms | Budget |
| --- | --- | --- | --- |
| coldDashboardReadyMs | 357.1 | 351.0 | WITHIN |
| domInteractiveMs | 19.4 | 16.4 | WITHIN |
| loadEventEndMs | 35.1 | 35.7 | WITHIN |
| searchPaintMs | 33.4 | 33.1 | WITHIN |
| questionTransitionPaintMs | 33.2 | 33.6 | WITHIN |
| examStartRenderMs | 224.8 | 207.8 | WITHIN |
| audioDownloadMs | 53.5 | 50.9 | WITHIN |
| imageDownloadMs | 49.9 | 52.1 | WITHIN |
| warmNavigationPaintMs | 33.5 | 33.2 | WITHIN |
| catalogPaintMs | 49.8 | 49.3 | WITHIN |
| matchingPaintMs | 33.3 | 33.5 | WITHIN |
| autosavePersistMs | 2.9 | 2.9 | WITHIN |
| resumeRenderMs | 30.8 | 31.9 | WITHIN |
| resultRenderMs | 32.9 | 32.4 | WITHIN |
| reviewFilterResponseMs | 84.5 | 87.5 | WITHIN |
| hsk2ListPaintMs | 33.1 | 33.1 | WITHIN |
| reviewSaveResponseMs | 4.9 | 4.4 | WITHIN |

Lượt đo đầu phát hiện p95 mở bài 351,6 ms so với 224,8 ms của V9. Nguyên nhân từ code: panel readiness HSK2 được mount cả khi luyện HSK1 và gửi yêu cầu thừa mỗi lần quay lại danh sách. Chỉ mount panel đó khi cấp đang học là HSK2; không đổi SQL, engine hoặc SRS. Đo lại p95 còn 207,8 ms. [Lượt đo đầu](../../data/reports/v10/performance-first.json) được giữ để đối chiếu.

17 chỉ số ×20 mẫu bằng harness cũ, chạy không đồng thời QA. Budget tăngp95≤max(15%,10ms) so với V9 frozen. Attention: không có. Cache/OS scheduling/local loopback có sai số; không phải benchmark production hay Web Vitals chuẩn. Không refactor SQL/engine/SRS để chạy theo nhiễu; giữ prepared/bounded validation của V9. [Raw samples](../../data/reports/v10/performance.json).

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không phải chứng nhận ngôn ngữ, cấp HSK, quyền hay phát âm của người thật.

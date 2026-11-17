# V7 · Performance

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

| Chỉ số | n | V7 p50 ms | V7 p95 ms | V6 p95 ms |
| --- | --- | --- | --- | --- |
| coldDashboardReadyMs | 20 | 344.00 | 353.90 | 353.50 |
| domInteractiveMs | 20 | 20.30 | 22.80 | 22.70 |
| loadEventEndMs | 20 | 33.30 | 38.30 | 39.50 |
| searchPaintMs | 20 | 32.00 | 32.90 | 33.00 |
| questionTransitionPaintMs | 20 | 32.20 | 33.10 | 33.20 |
| examStartRenderMs | 20 | 481.00 | 571.20 | 622.40 |
| audioDownloadMs | 20 | 60.00 | 66.10 | 65.40 |
| imageDownloadMs | 20 | 81.50 | 106.40 | 102.10 |
| warmNavigationPaintMs | 20 | 32.10 | 33.00 | NOT MEASURED |
| catalogPaintMs | 20 | 38.00 | 49.70 | NOT MEASURED |
| matchingPaintMs | 20 | 32.10 | 33.10 | NOT MEASURED |
| autosavePersistMs | 20 | 2.90 | 5.10 | NOT MEASURED |
| resumeRenderMs | 20 | 17.30 | 30.80 | NOT MEASURED |
| resultRenderMs | 20 | 23.00 | 29.90 | NOT MEASURED |
| reviewFilterResponseMs | 20 | 83.10 | 91.80 | NOT MEASURED |

20 mẫu mỗi chỉ số trên local Chrome/loopback; đo riêng sau regression. Giữ performance-concurrent-regression.json từ lượt có tải kiểm thử đồng thời để không nhầm so sánh. Dashboard ready là upper bound do quan sát CTA, không phải TTI chuẩn. Interaction đo event+2RAF, không đưa sleep của harness vào thời gian phản hồi. Filter là response API, resume là render snapshot lưu trên máy; không phải network cloud. CPU CDP/heap/bundle raw trong JSON; không suy ra OS CPU/RSS, Core Web Vitals field, mobile thật hoặc không memory leak.

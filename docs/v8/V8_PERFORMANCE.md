# V8 · Hiệu năng

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

| Metric | n | p50ms | p95ms |
| --- | --- | --- | --- |
| coldDashboardReadyMs | 20 | 350.40 | 356.50 |
| domInteractiveMs | 20 | 20.40 | 24.70 |
| loadEventEndMs | 20 | 34.70 | 41.80 |
| searchPaintMs | 20 | 32.00 | 33.90 |
| questionTransitionPaintMs | 20 | 31.90 | 33.10 |
| examStartRenderMs | 20 | 555.60 | 671.50 |
| audioDownloadMs | 20 | 60.10 | 66.60 |
| imageDownloadMs | 20 | 96.40 | 113.50 |
| warmNavigationPaintMs | 20 | 31.70 | 35.80 |
| catalogPaintMs | 20 | 41.00 | 47.90 |
| matchingPaintMs | 20 | 32.10 | 32.70 |
| autosavePersistMs | 20 | 3.40 | 4.40 |
| resumeRenderMs | 20 | 17.30 | 29.50 |
| resultRenderMs | 20 | 23.90 | 31.50 |
| reviewFilterResponseMs | 20 | 132.80 | 163.10 |
| hsk2ListPaintMs | 20 | 32.00 | 33.60 |
| reviewSaveResponseMs | 20 | 5.20 | 5.80 |

| Metric | V7 p50 | V7 p95 | V8 p50 | V8 p95 |
| --- | --- | --- | --- | --- |
| coldDashboardReadyMs | 344.00 | 353.90 | 350.40 | 356.50 |
| domInteractiveMs | 20.30 | 22.80 | 20.40 | 24.70 |
| loadEventEndMs | 33.30 | 38.30 | 34.70 | 41.80 |
| searchPaintMs | 32.00 | 32.90 | 32.00 | 33.90 |
| questionTransitionPaintMs | 32.20 | 33.10 | 31.90 | 33.10 |
| examStartRenderMs | 481.00 | 571.20 | 555.60 | 671.50 |
| audioDownloadMs | 60.00 | 66.10 | 60.10 | 66.60 |
| imageDownloadMs | 81.50 | 106.40 | 96.40 | 113.50 |
| warmNavigationPaintMs | 32.10 | 33.00 | 31.70 | 35.80 |
| catalogPaintMs | 38.00 | 49.70 | 41.00 | 47.90 |
| matchingPaintMs | 32.10 | 33.10 | 32.10 | 32.70 |
| autosavePersistMs | 2.90 | 5.10 | 3.40 | 4.40 |
| resumeRenderMs | 17.30 | 30.80 | 17.30 | 29.50 |
| resultRenderMs | 23.00 | 29.90 | 23.90 | 31.50 |
| reviewFilterResponseMs | 83.10 | 91.80 | 132.80 | 163.10 |

Đo sau regression, không chạy benchmark cùng workload tests khác.17 local metrics ×20 quan sát; multi-tab queue20/browser trong sync reports riêng. Có so sánh15 metric V7 từ evidence trước V8, cùng máy/loopback nhưng không bảo đảm cache/OS scheduling giống hệt. Reviewer save dùng QA record mới rồi archived, không sửa notes cũ. Không benchmark production scale, Web Vitals chuẩn hay OS CPU/RSS. Raw samples và comparison trong performance.json.

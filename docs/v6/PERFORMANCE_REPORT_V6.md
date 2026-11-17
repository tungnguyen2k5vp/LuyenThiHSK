# PERFORMANCE REPORT V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

| Chỉ số | n | p50 ms | p95 ms |
| --- | --- | --- | --- |
| coldDashboardReadyMs | 20 | 347.20 | 353.50 |
| domInteractiveMs | 20 | 19.20 | 22.70 |
| loadEventEndMs | 20 | 33.10 | 39.50 |
| searchPaintMs | 20 | 32.20 | 33.00 |
| questionTransitionPaintMs | 20 | 32.20 | 33.20 |
| examStartRenderMs | 20 | 487.70 | 622.40 |
| audioDownloadMs | 20 | 58.00 | 65.40 |
| imageDownloadMs | 20 | 88.90 | 102.10 |

20mẫu/chỉ số, local loopback Chrome; cold cache cleared. “Dashboard ready” là thời điểm đầu tiên quan sát được CTA enabled, upper bound, không phải chuẩn Web Vitals TTI. Tìm kiếm/chuyển câu đo DOM event +2requestAnimationFrame; không dùng delay100ms của harness làm thời gian app. Audio/ảnh đo download thực, response body đọc hết, private no-store.

Heap thực sau workload: {"usedJSHeapSize":8943560,"totalJSHeapSize":9696192,"jsHeapSizeLimit":4395630592}. CDP CPU/task metrics raw lưu trong data/reports/v6/performance.json; không phải OS CPU%. OS CPU/RSS, standard TTI, tải cloud và thiết bị mobile thật NOT_MEASURED. Không chứng minh không có memory leak từ một số heap.

| Asset | Bytes | Gzip offline bytes |
| --- | --- | --- |
| AdminContentForm-C13lkLca.js | 16277 | 6021 |
| AdminWorkspaceV3-BAa2wi6l.js | 21864 | 7383 |
| cloudSync-DS4LcPas.js | 7484 | 2932 |
| ContentReviewV5-ZBtdK18d.js | 18216 | 6058 |
| CourseWorkspace-BfN75R0m.js | 19901 | 6743 |
| Diagnostic--1Rjk-D3.js | 3364 | 1596 |
| examCatalog-CuXgYhKj.js | 47376 | 15854 |
| index-DguUhnVp.css | 68229 | 14044 |
| index-DUUm3Mzi.js | 376321 | 113036 |
| jsx-runtime-Dk72oS4N.js | 8774 | 3327 |
| preview-CELTkWqN.css | 3905 | 1157 |
| PreviewWorkspace-KS4eSuit.js | 20246 | 7547 |
| ResponseCenter-lPc3Sd1s.js | 5692 | 2577 |
| vocabularyQuiz-A4cM8mMI.js | 2202 | 1295 |


Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.

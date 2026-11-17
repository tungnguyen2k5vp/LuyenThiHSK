# V11 · Hiệu năng local

2026-10-18 T03:48:50.865 Z

Cùng legacy harness **17 metrics × 20 samples**, chạy riêng sau regression/repeated browser. Budgetp95≤V10 p95+max(15%,10 ms). Không bỏ validation/refactor SQL/exam/SRS để chạy theo nhiễu.

| Metric | V10 p95 ms | V11 p95 ms | Budget |
| --- | --- | --- | --- |
| cold Dashboard Ready Ms | 351.0 | 352.8 | WITHIN |
| dom Interactive Ms | 16.4 | 16.3 | WITHIN |
| load Event End Ms | 35.7 | 31.4 | WITHIN |
| search Paint Ms | 33.1 | 33.0 | WITHIN |
| question Transition Paint Ms | 33.6 | 33.3 | WITHIN |
| exam Start Render Ms | 207.8 | 201.5 | WITHIN |
| audio Download Ms | 50.9 | 45.4 | WITHIN |
| image Download Ms | 52.1 | 56.1 | WITHIN |
| warm Navigation Paint Ms | 33.2 | 33.8 | WITHIN |
| catalog Paint Ms | 49.3 | 49.4 | WITHIN |
| matching Paint Ms | 33.5 | 33.3 | WITHIN |
| autosave Persist Ms | 2.9 | 2.7 | WITHIN |
| resume Render Ms | 31.9 | 31.7 | WITHIN |
| result Render Ms | 32.4 | 31.3 | WITHIN |
| review Filter Response Ms | 87.5 | 92.1 | WITHIN |
| hsk2 List Paint Ms | 33.1 | 33.6 | WITHIN |
| review Save Response Ms | 4.4 | 6.4 | WITHIN |

Thêm6 HSK2 metrics × 20 samples:

| Metric | p50 ms | p95 ms |
| --- | --- | --- |
| hsk2 Today Paint Ms | 31.5 | 32.3 |
| hsk2 Vocabulary Paint Ms | 31.9 | 32.8 |
| hsk2 Grammar Paint Ms | 31.6 | 32.5 |
| hsk2 Practice Hub Paint Ms | 31.7 | 32.5 |
| hsk2 Practice Api Ms | 179.1 | 345.4 |
| hsk2 Mock Readiness Api Ms | 164.8 | 171.9 |

Audio load cũ đo HSK1 file thật; **HSK2 audio load NOT_MEASURED vì0 assets**. Full Mockcandidate CPU/readiness là lập kế hoạch/gate, không thời gian mở mock nội dung thật. Cache/OS/browser/headless gây sai số; không production Web Vitals. [Rawsamples](../../data/reports/v11/performance.json).

Nội dung tự tạo giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Automated validation không phải human review, xác minh quyền, phát âm hay chứng nhận chính thức CTI.


## Lượt đo đầu và giới hạn so sánh

Lượt đầu: p95 mở bài **268,6 ms**, vượt budget **239,0 ms** so với V10. Khi đo lại đúng harness, không còn kiểm thử khác chạy đồng thời, kết quả **201.5 ms**, nằm trong ngân sách. Không thay mã hiệu năng giữa hai lượt; chưa chứng minh được nguyên nhân spike. Giữ [lượt đầu](../../data/reports/v11/performance-first.json) và [lượt đo lại](../../data/reports/v11/performance.json), không xóa số vượt ngân sách.

Các chỉ số paint HSK 2 đo hai animation frames sau thao tác điều hướng; độ trễ API được đo riêng. Không coi đó là phép đo tải toàn bộ catalog trên mạng thật. Audio HSK 2 và mở Full Mock thật chưa có điều kiện để benchmark.

Node candidate planner: 20 mẫu, p50 5.39 ms / p95 7.52 ms. Chỉ đo chọn 60 ứng viên, không đo mở bài có audio được cấp quyền. [Mẫu CPU](../../data/reports/v11/mock-candidate-performance.json).

# PERFORMANCE_REPORT_V5

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Đo trên máy local, headless

| Chỉ số (ms) | Chrome | Edge |
|---|---:|---:|
| Preview release UI |108|123|
| Search interaction |6|7|
| Practice start |106|108|

Initial page wall=345 ms; DOMload=49.69999998807907 ms; grammaropen=19 ms; mockbuild=228 ms. Slow reconnect=1894 ms với350 mslatency/64KBps. Used JS heap=21640661 bytes. Main JS=364125 bytes raw.

Đây là single observations có chi phí harness, không phải percentile field data. Xem build log để biết gzip. Review UI lazy load và pagination20. Learner chỉ tải audio câu hiện tại; QA decode40 file là bước kiểm tra riêng.

Audio failure→timer pause→reload giữ pause→reconnect retry→resume đã kiểm tra. Autoplay rejection dùng NotAllowedError double có ghi rõ; fetch/decode/file vẫn thực. Blob đã tải có thể phát offline; cold private audio chưa có persistent cache, response no-store.

Lighthouse không cài, NOT_RUN, không gán điểm95. [Measurements](../../data/reports/v5/performance-audio-chrome.json). PCM checks không đo độ tự nhiên của giọng.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.

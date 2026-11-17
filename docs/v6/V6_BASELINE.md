# V6 baseline

2026-10-16T03:50:51.306Z

Backup source và SQLite nhất quán: .runtime/backups/before-v6-2026-10-16. Không reset dữ liệu. Tiến độ học localStorage thuộc trình duyệt người dùng được giữ nguyên; QA dùng profile tạm.

Static counts: {"words":300,"lessons":68,"questions":178,"audio":40,"templates":1}. Live API: {"http":200,"summary":{"counts":{"vocabulary":{"total":300,"draft":0,"needsReview":300,"internallyValidated":300,"humanReviewed":0,"published":0},"grammar":{"total":68,"draft":0,"needsReview":68,"internallyValidated":68,"humanReviewed":0,"published":0},"questions":{"total":178,"draft":0,"needsReview":178,"internallyValidated":178,"humanReviewed":0,"published":0},"audio":{"total":40,"draft":0,"needsReview":40,"internallyValidated":40,"humanReviewed":0,"published":0},"templates":{"total":1,"draft":0,"needsReview":1,"internallyValidated":1,"humanReviewed":0,"published":0}},"total":587,"errors":0,"warnings":0,"renderedAudio":40,"productionPublished":0,"humanReviewed":0}}. Các dòng QA/archive trong SQLite không được tính là content release.

| Script | Exit | ms |
|---|---:|---:|
|typecheck|0|1896|
|lint|0|518|
|test|0|3771|
|test:v2|0|3492|
|test:v3|0|3373|
|test:v3-api|0|742|
|test:v4|0|4431|
|test:v5|0|409|
|test:v5-api|0|2696|
|test:admin|0|565|
|check:content|0|3264|
|build|0|2345|

Bằng chứng JSON: ../../data/reports/v6/baseline.json. Browser baseline ghi riêng.

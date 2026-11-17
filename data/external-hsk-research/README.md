# Kho nghiên cứu HSK — dữ liệu chưa import

Đã tận dụng dữ liệu HocTiengTrungApp bằng đọc/copy sang thư mục này; không sửa dự án đó. Không thay UI, Exam Engine, auth, SRS hay dữ liệu production.

Bắt đầu xem [báo cáo tổng](reports/FINAL_CRAWL_REPORT.md), [xem trước import](reports/DATA_IMPORT_PREVIEW.md), [khoảng trống](reports/DATA_GAP_REPORT.md), [ma trận coverage](reports/DATA_COVERAGE_MATRIX.csv), [giấy phép](reports/LEGAL_AND_LICENSE_AUDIT.md).

- raw/licensed_sources_only: snapshot theo SHA256, giữ nhiều revision; 498 dòng CSV không rõ quyền chỉ ở review_queue/license_review dưới dạng metadata.
- normalized: JSONL và CSV UTF-8 chia theo loại/version/edition/level, tối đa 2.000 dòng/shard. Dictionary/paths không có HSK level được giữ unassigned; không suy đoán level. normalized/relations giữ liên kết từ–chữ–từ điển–ví dụ bằng ID, chưa xác nhận cùng sense hoặc edition.
- Một dictionary entry có thể được nhiều VOCABULARY membership tham chiếu bằng lexemeId; đừng cộng tất cả mapping thành số từ độc lập. Complete newest-* và CSV-aligned edition giữ unverified.
- EXAMPLE_SENTENCE đồng thời dùng làm transcript qua normalized/listening/transcripts/references.json; grammar là tag index có exampleIds, không phải bài giảng chính thức.
- AUDIO_ASSET.localFile là đường dẫn tương đối tới file đã có trong LuyenThiHSK/public; hash/size đã kiểm tra. Kho không tự chứa audio khi di chuyển độc lập.
- QUESTION là bài luyện phái sinh cũ, giữ originalQuestion và nhãn chưa duyệt; không có ngân hàng đề mới được công bố.
- USER_AUTHORIZED_LOCAL_REUSE chỉ đủ quyền dùng cục bộ; giữ riêng quyền phát hành của nội dung nguyên tác. CC BY-SA và Arphic có điều kiện, đọc attribution trước khi chọn import. MDBG CC-CEDICT đã tải trực tiếp; chỉ chuẩn hóa các headword khớp HSK/Hanzi, toàn snapshot licensed vẫn giữ trong raw.

Chạy từ D:\ReactJS (Node 24, chỉ dùng stdlib; parser TypeScript có sẵn tại HocTiengTrungApp/node_modules, không cài gì):

```powershell
node LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs dry-run
node LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs discover-sources
node LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs audit-permissions
node LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs audit-public-policies
node LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs fetch-licensed-datasets
node --max-old-space-size=2048 LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs normalize
node --max-old-space-size=2048 LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs validate
node --max-old-space-size=2048 LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs deduplicate
node --max-old-space-size=2048 LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs build-coverage-report
node --max-old-space-size=2048 LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs build-import-preview
node LuyenThiHSK/data/external-hsk-research/tools/self-check.mjs
node LuyenThiHSK/data/external-hsk-research/tools/pipeline.mjs verify-protected
```

Ba lệnh báo cáo cùng xây bộ báo cáo nhất quán, không tải lại mạng. Audit/fetch dùng checkpoint, revision giữ nguyên; host 401/403/429/challenge sẽ bị dừng và lưu lý do. Giới hạn mỗi lượt: 160 requests, 24 MiB/file, 96 MiB tổng, timeout 22s, không retry, 1 request/hostname/2s, mặc định depth 2; crawl-delay lớn hơn được tôn trọng (MDBG 5s, Tatoeba 8s), xem reports/CRAWLER_POLICY_NOTE.md về lượt đầu. Docs audit chỉ whitelist root hoặc thư mục license (không crawl sâu). Không có lệnh import production.

backups/baseline.json lưu hash của 14.103 file trong phạm vi đã ghi; SQLite backup tạo từ kết nối read-only. Dependency/build/native runtime tree không được đưa vào kiểm tra nội dung; toàn bộ thao tác ghi của pipeline giới hạn trong kho này.

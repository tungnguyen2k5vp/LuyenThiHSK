# Data import report V2

Lệnh: npm run data:import. Raw được giữ tại data/raw, không vào static release. Pipeline idempotent theo ID nguồn và tên shard cố định; checksum drift làm dừng import. PDF CTI đã tải đủ và khớp SHA256 ec74ce0439e837bbb15154be13e747ae798903b2fd3a331629df6c3b45504941.

Mọi mục từ được đối chiếu từ/cách đọc/cấp với snapshot trích PDF chính thức. Số homograph gắn sau từ được chuẩn hóa theo từ gốc CTI. Nhóm 7–9 giữ nguyên nhóm. Dictionary join phân biệt cách đọc; không đoán nghĩa khi không khớp. Kết quả: 11.000 mục từ, 576 grammar source-matched, 3.088 Hanzi, 2.989 glyph, 169 nhóm topic, 166 task title; 0 xung đột vocabulary, 17 grammar staging, 557 thiếu nghĩa Việt, 99 thiếu glyph.

Admin importer CSV có ánh xạ cột, xử lý quoted fields; JSON dùng payload có metadata. Giới hạn 4 MB/2.000 records, preview/dedup/error report, apply vào DRAFT, checksum replay idempotent. Approval và publication là bước riêng có audit. Generated content không được công bố tự động.

Giấy phép từ điển phái sinh CC BY-SA 4.0 với attribution và thông báo thay đổi; MIT notice upstream được giữ. Nét chữ dùng Arphic Public License đầy đủ. Không nhập câu hỏi/audio/deck của repo có license NC hoặc không rõ quyền. Không nhập official PDF/example/question/passages vào public.

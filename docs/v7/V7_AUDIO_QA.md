# V7 · Audio QA

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

80 WAV synthetic giữ nguyên hash; 80 đạt hash/duration PCM checks. Chrome/Edge download và decode 80 WAV thực trong flow V6 dùng lại; không phải URL-only test. 0 người duyệt phát âm.

Checklist riêng trong editor: nghe được, transcript, thiếu âm, méo tiếng, phát âm/thanh điệu, tốc độ/khoảng lặng, speaker labels, part và quyền. Checkbox hỗ trợ ghi nhận nhận xét, không tự tạo approval.

Giữ upload/replace kiểm magic/size/duration/transcript/provider/voice/source/license/hash/CAS; file cũ và historical attempts không bị thay. So sánh player cũ/mới có thật. V7 sửa retry: tạo lại audio element khi blob đổi và đặt lại watchdog 12s cho mỗi lần tải; tránh reuse decoder lỗi trên Edge và tránh loading vô hạn sau retry. Có kiểm 10 vòng retry trong trình duyệt; xem browser log cuối.

[Media audit](../../data/reports/v7/media-audit.json). Decode không chứng minh transcript alignment, phát âm tự nhiên hoặc quyền sử dụng.

# V13 · Kế hoạch tích hợp

Status: V13_QA_PASSED trong phạm vi INTEGRATION_LOG (2026-10-19). Các bước dưới là kế hoạch/lịch sử; xem QA report về giới hạn và artifacts.

1. Snapshot/checksum/SQLite restore → baseline QA. Contract typecheck, adapter tests và declaration review → FROZEN 13.0.
2. Gemini author trong hai vùng được giao. Codex tiếp tục logic/data/media/performance. Không chờ thiết kế toàn bộ.
3. Nhận manifest GEMINI_BATCH_READY; chỉ đọc file đã bàn giao, xác minh hash, imports, dependencies, scoped CSS, assets/license và ownership. Handoff khóa đúng các file đó; không sửa vùng khác của Gemini.
4. Tích hợp batch nhỏ trong Codex-owned host/adapters. Feature flag mặc định off; tắt presentation mới không đổi database/owner/storage key. Không copy toàn bộ src, không duplicate API/autosave/player/grading.
5. Typecheck/build candidate, callback/domain parity, double-submit, autosave/recovery, grammar/SRS IDs, source/gates, critical browser + V12 visual comparison desktop/mobile/tablet/keyboard. Ghi bundle/latency. Chỉ BATCH_INTEGRATED khi đạt toàn bộ.
6. Màn chưa có handoff giữ UI cũ. Không tự làm presentation trùng Gemini.

Thứ tự: tokens/primitives → Today → HSK hub → vocabulary → grammar → practice → question presentation → writing → result → mistakes/progress → exam polish.

Nếu Gemini còn file đang author, logic typecheck/build có phạm vi riêng và được ghi rõ; full build tích hợp không được bỏ qua lỗi của batch đã nhận. Snapshot dùng kiểm thử không chứa credentials và không chia sẻ SQLite được ghi với môi trường chính.

Hai lựa chọn kiến trúc: (A) đổi toàn bộ mixed containers ngay: tích hợp nhanh nhưng dễ thay business behavior/đụng file; (B) DTO/adapters + host nối callback: thêm lớp mapping nhưng kiểm được parity và rollback UI riêng. Chọn B. Giữ framework và engine hiện hành.

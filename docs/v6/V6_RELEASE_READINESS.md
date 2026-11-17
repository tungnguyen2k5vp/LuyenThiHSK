# V6 RELEASE READINESS

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Quyết định

**TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW** cho HSK1 private local, khi regression/E2E PASS. Không phải production launch.

883 mục NEEDS_REVIEW; Draft0, Internally Validated883, Human Reviewed0, Published0. 300từ/68bài/396câu/80audio/30ảnh/8bank/1template. 8part×5 câu;2bộ độc lập. Grammar68/68 có≥5câu liên quan.

## Blockers

- BLOCKED_FOR_HUMAN_REVIEW: nghĩa/pinyin/cấp/đáp án/ngữ pháp/ảnh/phát âm chưa có reviewer thật
- AUDIO_RIGHTS_UNVERIFIED:80 huayan synthetic chỉ private preview
- IBT_RULES_UNVERIFIED: audio replay/navigation/scoring và timing equivalence chưa chính thức
- NOT_DEPLOYED: Supabase/Auth/PostgreSQL/HTTPS/SMTP/RLS runtime/operations còn thiếu cấu hình và QA thật
- PRODUCTION_MEDIA_PENDING: private image delivery và server-side exam secrecy chưa sẵn sàng public
- DEVICE_QA_PENDING: Firefox/Safari/mobile thật/screen reader chưa kiểm

HSK2–9 giữ DATA_ONLY, không đổi cấp từ/không tự publish. Những blocker trên không ngăn học/thử luồng private. Không cần hỏi lại ai là reviewer để tiếp tục công việc kỹ thuật.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.

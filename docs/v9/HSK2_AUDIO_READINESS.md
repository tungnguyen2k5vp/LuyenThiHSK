# V9 · Audio HSK2

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

Transcript original:18. Tác vụ chuẩn bị18. AudioAsset playable0, rendered=0, paid requests0, human pronunciation0, published0. Duration/provider/voice/asset revision chưa có khi chưa render; không ghi duration giả.

Dùng provider abstraction hiện có tại server/speech-providers.mjs. 'node scripts/v9-audio-preflight.mjs' mặc định dry-run, không gửi request. Chỉ '--render' khi cấu hình paid provider rõ ràng mới ghi WAV riêng vào .runtime/v9-audio; output giữ CONTRACT_REVIEW_REQUIRED/NEEDS_REVIEW, không tự stage/publish.

Lưu sourceType/use/provider/voice/transcript/accent/duration/license/evidence/pronunciation review/revision/hash/decode status. Gate practice yêu cầu transcript khớp, quyền VERIFIED, duration1–90s, file URL/hash và PCM validation. Production còn yêu cầu human/rights gates. Kiểm metadata future asset không thay thế file/decode validation trên upload.

Nguồn nghiên cứu: [Qwen3-TTS model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice) Apache2.0 cho model; chưa cài hoặc tạo audio, không suy ra quyền voice/output hay phát âm chuẩn. [Azure TTS](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech) là adapter tùy chọn đã có, chưa cấu hình/gọi trả phí. 80WAV HSK1 Huayan cũ vẫn chưa có bằng chứng quyền phát hành/phát âm chuyên môn.

Listening UI: “Phần nghe đang chuẩn bị âm thanh.” và disable đúng part, Reading/Writing vẫn dùng. [18 jobs](../../data/editorial/v9/audio-review-jobs.json), [dry-run](../../data/reports/v9/audio-readiness.json).

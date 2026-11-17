# HSK2 · Audio workbench và readiness

lúc 09:25 Chủ Nhật, 18 tháng 10, 2026 (UTC+7) · Local/private

18 → 40 jobs, **0 AudioAssets tạo thật / 0 câu nghe khả dụng**. Không lấy waveform kỹ thuật làm audio nghe. Listening giữ BLOCKED_MEDIA.

Đã có upload→metadata→PCM QA→immutable asset/question binding→browser playback→rights/pronunciation queue. Kiểm size/header/chunks/frame alignment/codec/rate/duration/RMS/clipping/silence/SHA256 và revision/transcript declaration. Không có ASR, LUFS hay human pronunciation check. Fixture tone chỉ tồn tại trong test/temporary SQLite, không lưu vào main question bank.

[Qwen model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice) công bố Apache-2.0 cho model; chưa thiết lập đủ quyền voice/data/output của dự án. Chưa tải/chạy model. Adapter loopback dùng contract riêng, không phải official Qwen REST API. [Azure Speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech) giữ tắt, không có key/paid call. Piper Huayan cũ chưa đủ bằng chứng voice-training rights. Không gọi official audio. [Runbook](BACKEND_CLOUD_RUNBOOK.md).

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không phải chứng nhận ngôn ngữ, cấp HSK, quyền hay phát âm của người thật.

# Audio coverage V4

40/40 transcript nghe có WAV thực tế, không dùng file im lặng thay content. Tổng 114.32 giây; 5043456 bytes. Provider Piper local 2023.11.14-2; voice zh_CN-huayan-medium; 22050Hz mono PCM.

Metadata: SYNTHETIC, provider/voice, transcript original AI, durationMs đọc từ RIFF, SHA256, bytes, license/status/evidence URL, questionIds, reviewStatus, humanReview. Header/checksum validation PASS; giải mã 40/40 bằng Web Audio được ghi khi browser test hoàn tất. Playback headless được bật autoplay cho hồ sơ QA; đó không chứng minh đã có người nghe.

Files chỉ ở .runtime/v4-audio; endpoint private có bearer token, no-store, kiểm tra hash. Không đưa WAV/model vào public/dist. Audio Review Queue tải và phát riêng từng file, không ghi human review khi chỉ decode.

Upstream MODEL_CARD: https://huggingface.co/rhasspy/piper-voices/blob/main/zh/zh_CN/huayan/medium/MODEL_CARD — Dataset license Unknown. Giữ UNVERIFIED; chỉ nghiên cứu Preview riêng. Chưa có licensed human recording.

BLOCKED_FOR_HUMAN_REVIEW: ngôn ngữ, pinyin câu, cấp từ hỗ trợ, đáp án và distractors; phát âm/nhịp giọng synthetic. Quyền dữ liệu giọng huayan Unknown phải được giải quyết hoặc thay voice trước production. Format HSK syllabus 2025 chưa xác minh đầy đủ; mock hiện là PLATFORM PRACTICE MOCK / BETA.

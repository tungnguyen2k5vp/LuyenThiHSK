# AUDIO_LINGUISTIC_AUDIT_V5

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

40 audio synthetic riêng, tổng113.81 giây, dài1709–3846 ms. Đo PCM16, sample rate/channels, RMS dBFS, clipping, tỷ lệ mẫu gần im lặng, leading/trailing silence, duration và SHA256. 0 asset có clippedRatio>0.1%. Không tự kết luận chất lượng phát âm từ độ dài hoặc waveform.

3 transcript sửa đã có assetID riêng theo hash transcript/provider/settings; tái build dùng lại file có sẵn. Giữ nguyên40 file V4 cho snapshot lịch sử. QA từng phát hiện tên V5 tạm bị ghi đè khi Piper sinh lại; đã sửa cache/ID bất biến và kiểm tra lại checksum.

40/40 file được giải mã thực trên Chrome và Edge. Chưa có forced alignment/ASR, chưa có người nghe kiểm âm vị, ngữ điệu hay thanh ba. transcriptAlignmentStatus=SYNTHESIS_INPUT_MATCH_ONLY_NOT_ASR và pronunciationReviewStatus=BLOCKED_FOR_HUMAN_REVIEW.

[PCM metrics](../../data/reports/v5/audio-metrics.json) · [CSV transcript](../../data/review-packages/v5/audio.csv). HTML kèm audio nằm .runtime/review-packages/v5/audio.html; giữ riêng. Browser TTS cho từ/ví dụ và file listening synthetic đều không được gọi là audio chính thức.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.

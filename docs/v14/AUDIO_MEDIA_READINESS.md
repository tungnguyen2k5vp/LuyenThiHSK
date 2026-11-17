# Audio/media readiness

HSK2 audit từ live services trong clone:40 audio jobs/transcripts,0 exam-ready audio. Không có grant mới, không tạo hoặc bind file giả. HSK1 media được kiểm checksum bởi V6 validator; đây là technical validation, không human pronunciation/rights review.

[Qwen CustomVoice model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice) ghi Apache2, hỗ trợ tiếng Trung và một số giọng định sẵn. Công cụ web không đọc được file LICENSE cụ thể lần này; chưa pin model/voice và chưa có evidence về quyền output theo deployment hiện tại. Không bật paid provider, tải model hay gọi dịch vụ ngoài để giả rằng blocker đã hết. Model license và human pronunciation review là hai điều kiện riêng.

Zhongdex audio không có URL/output permission kiểm chứng trong [NOTICE](https://raw.githubusercontent.com/saymei/zhongdex/main/NOTICE); không tải audio Migii/CTI. Device/browser TTS chỉ dùng Guided Practice theo flow hiện hữu, không phải exam audio hoặc nguồn thu âm đã duyệt.

PoC tiếp theo khi có provider được cấu hình và đủ evidence: chọn một original transcript → pin provider/model/voice/license → tạo revision mới với transcript/duration/hash/sourceType=SYNTHETIC → decode/check duration → audio review queue → rights/pronunciation decisions qua reviewer gate. Không ghi đè asset đã thuộc attempt cũ; không tự đánh dấu đã nghe duyệt.

Image giữ nguyên original SVG/provenance/revision/hash; không dùng screenshot/watermark Migii. `QuestionImageVM` chỉ là trạng thái từ authenticated image owner. Không có V14 image replacement hoặc mới cấp quyền.

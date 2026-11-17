# AUDIO READINESS V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Tài sản thực tế

80 file synthetic:40 V5 giữ nguyên +40 mới cho L1–L4. 0 có quyền phân phối đã xác minh; 80 còn blocked. Voice huayan có nguồn dữ liệu huấn luyện UNKNOWN, không dùng production. Không có file Azure thật và không có duyệt phát âm người thật.

Piper local tạo file bất biến theo transcript/provider/voice/settings hash; PCM16/duration/RMS/hash được kiểm. Chrome và Edge thực sự decode80WAV, không phải chỉ kiểm URL. Đây không phải đánh giá phát âm, ngữ điệu hoặc ASR. L3 dùng một voice tổng hợp có nhãn người nói, chưa phải hội thoại người thật.

Provider abstraction giữ local/Azure disabled; bổ sung upload LICENSED/HUMAN_RECORDED/SYNTHETIC. Tool upload kiểm signature/max12MB, browser decode0–90s, transcript, voice/provider và bản khai quyền; compare audio hiện tại/mới, ghi feedback trong review notes, tạo asset hash và revision câu mới. File cũ giữ để nghe historical attempts. Bản khai quyền không tự thành VERIFIED. Mọi replacement lại cần technical/human review. Integration upload/replace chạy trong runtime QA riêng, không thêm bản thu fixture vào release.

Practice cho nghe lại/tốc độ/tua, transcript sau kiểm tra. Timed không hiện transcript/lời giải, audio error tạm dừng đồng hồ và khôi phục sau khi nghe xác nhận. Ảnh lỗi có retry và giữ đáp án; chưa tự dừng timer do ảnh lỗi. Cần rà chính sách công bằng này trước production.

Listening question-level QA: 80 dòng trong data/reports/v6/listening-qa.json. Không tự coi Hanzi hiển thị là lỗi nếu thuộc dạng câu; ở pool L1–L4 mới chỉ hiện yêu cầu chung trước kiểm tra.

Nguồn quyền voice: [upstream model card](https://huggingface.co/rhasspy/piper-voices/blob/main/zh/zh_CN/huayan/medium/MODEL_CARD).

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.

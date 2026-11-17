# AUDIO_LICENSE_REPORT_V5

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Quyền hiện có

Giấy phép executable, model và training voice là các lớp khác nhau. Huayan MODEL_CARD ghi nguồn dữ liệu Unknown. 40 audio giữ UNVERIFIED, chỉ dùng Preview riêng, không phân phối production. Transcript tự tạo không lấy từ đề CTI.

## Provider thay thế

[Microsoft Product Terms](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzure/OVOVS), mục TTS, cho phép khách hàng paid-tier dùng output của prebuilt neural voices, gồm mục đích thương mại, với điều kiện có quyền input. Trang kiểm tra thuộc OV/OVS; phải đối chiếu hợp đồng/tier/voice và quyền phân phối thực tế trước khi đặt VERIFIED. Không suy rằng free-tier hoặc custom voice có cùng điều kiện.

Adapter Azure theo [REST documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech) đã có SSML escaping, region/voice validation, key ở server, timeout/12MBcap và PCM metadata. Mặc định tắt; cần enabled=true, paid-tier, region/voice/key. Test chỉ dùng fake HTTP, không có audio Azure thực, không tạo tài khoản hoặc phát sinh phí. Metadata vẫn CONTRACT_REVIEW_REQUIRED và chờ người nghe.

Để thay audio: xác minh hợp đồng → cấu hình secret → sinh assetID mới → QC/align transcript → nghe duyệt → publication gate. Không đưa key vào frontend, gói duyệt hoặc báo cáo.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.

# V11 · Đánh giá nguồn TTS

Đối chiếu ngày 18/10/2026. Đây là đánh giá triển khai và bằng chứng hiện có, không phải ý kiến pháp lý hay chứng nhận phát âm.

| Provider | Mandarin / thanh điệu / tự nhiên | Tài nguyên, độ trễ và cài đặt | Quyền và chi phí | Quyết định |
| --- | --- | --- | --- | --- |
| Qwen 0.6B CustomVoice | Có các giọng Chinese; chưa nghe thử transcript dự án nên độ chính xác thanh điệu, ngữ điệu và tính nhất quán chưa đo | Self-host/offline sau khi cài; ví dụ CUDA; độ trễ máy này NOT_MEASURED; thêm Python/model/tokenizer/runtime cần quản lý phiên bản | Model Apache-2.0; chưa xác minh riêng consent/training/voice/output/redistribution; giữ NOTICE/attribution theo license khi phân phối | Giữ adapter loopback; chưa tải model hoặc tạo audio |
| Azure standard neural | Có zh-CN và SSML điều khiển tốc độ/ngắt; chất lượng thực tế NOT_TESTED | Máy chủ dịch vụ; cần network/resource/key, không offline với adapter hiện tại; latency NOT_MEASURED | Theo hợp đồng Azure và điều khoản sản phẩm áp dụng cho tài khoản; chưa có hợp đồng/key/budget consent. Không mặc định được tái phân phối output | Adapter tắt; không gọi trả phí |
| MeloTTS Chinese | Hỗ trợ Chinese/mixed English theo model card; tone/naturalness NOT_TESTED | Model card mô tả CPU realtime; chưa benchmark máy này, chưa cài weights/BERT/dependencies; offline sau khi cài đủ | Card gắn MIT và mô tả library dùng thương mại; chưa có bằng chứng riêng về toàn bộ voice/training/output quyền của asset cụ thể | Phương án CPU cần đánh giá tiếp; không suy từ MIT thành Rights Verified |
| Piper Huayan hiện có | Đã có file local; chưa có kiểm duyệt phát âm phù hợp HSK2 | ONNX/runtime đã có, CPU/offline; không benchmark hoặc tạo thêm HSK2 | Bằng chứng V10 về training/voice còn UNKNOWN; không có căn cứ nâng thành licensed production audio | Không tái sử dụng cho PoC học nghe mới; giữ hàng đợi thay thế/duyệt |

Không xếp hạng độ tự nhiên bằng số khi chưa có blind listening. Không dùng mức latency quảng cáo làm số đo local. Chi phí self-host vẫn gồm tài nguyên và vận hành; không gọi là miễn phí tuyệt đối. Máy đọc được qua Node: i5-12500H, 16 logical CPU, RAM khoảng 16 GiB; truy vấn Windows xác nhận RTX3050 Laptop khoảng 4GB VRAM. Chưa chứng minh Qwen chạy ổn trên cấu hình này.

## Rights checklist cho từng output

Tách model/code license; giọng cụ thể và consent; điều kiện training khi liên quan; quyền output, commercial use, lưu trữ và redistribution; attribution; phạm vi private/public và bản điều khoản áp dụng. Metadata khai báo không thay quyết định reviewer. Mọi output mới phải qua PCM QA, exact transcript/revision binding và review signature. Study TTS không tự trở thành Exam Simulation Audio.

## Nguồn sơ cấp đã đọc

- [Qwen model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice): checkpoint, giọng và hướng dẫn triển khai.
- [Azure TTS](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech): standard/custom voices, SSML, billing và responsible use; [Azure terms](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzure/OVOVS) cần xác nhận hợp đồng áp dụng, không suy quyền output từ trang overview.
- [MeloTTS Chinese](https://huggingface.co/myshell-ai/MeloTTS-Chinese) và [LICENSE](https://github.com/myshell-ai/MeloTTS/blob/main/LICENSE).
- [Piper voices](https://raw.githubusercontent.com/rhasspy/piper/master/VOICES.md); đường dẫn MODEL_CARD Huayan truy cập web lần này lỗi, không coi là xác minh mới. Bằng chứng local V10 vẫn pending.

Không tải model lớn, không dùng demo công cộng để gửi nội dung, không mua API hoặc clone giọng. Kết luận hiện tại: chuẩn bị 5 transcript PoC và adapter/review contract; chưa có provider thỏa cả runtime và căn cứ quyền asset để chạy PoC hợp lệ trong vòng này.

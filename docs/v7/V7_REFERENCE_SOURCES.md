# Nguồn đối chiếu V7

Kiểm tra ngày 16/10/2026. Chỉ dùng nguồn để xác minh cấu trúc, tiêu chí kiểm thử và provenance; không sao chép đề, ảnh hoặc audio CTI vào sản phẩm.

| Nguồn | Sử dụng và giới hạn |
| --- | --- |
| [CTI syllabus](https://www.chinesetest.cn/syllabus) | Xác nhận liên kết syllabus và sample questions hiện tại. |
| [Kho mẫu CTI](https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip) | Đọc riêng PDF HSK2 bằng HTTP Range; đối chiếu text và ảnh render các phần. PDF ở .runtime/references/v7, không nằm trong public/review package. Hash và trang evidence trong blueprint. |
| [Huayan model card](https://huggingface.co/rhasspy/piper-voices/blob/main/zh/zh_CN/huayan/medium/MODEL_CARD) | Kiểm tra lại upstream: mục Dataset vẫn ghi License Unknown. Nhãn MIT của repository tổng không xác minh quyền dataset/giọng cụ thể. Giữ media rights gate BLOCKED. |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | Đối chiếu grants/RLS/owner policies và yêu cầu chạy test DB. V7 chưa có hạ tầng thật để execute SQL/RLS; test double không chứng minh live isolation. |
| [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Tiêu chí màu chữ: tính tỷ lệ từ opaque computed colors, loại disabled controls; đây chỉ là mẫu tự động. Không tuyên bố audit WCAG đầy đủ. |
| [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Đối chiếu focus, Tab và Escape cho hộp nộp bài. Screen reader thật chưa kiểm. |

Các nguồn GitHub/dataset đã nghiên cứu ở vòng trước tiếp tục được lưu tại docs/REFERENCE_REPOSITORIES.md, docs/DATA_SOURCES.md và docs/CONTENT_LICENSES.md. V7 không clone hoặc ghép thêm code từ những repository đó.

Blueprint HSK2 xác minh trong phạm vi **paper sample**; không suy diễn thành IBT/scoring đã được chứng nhận. Xung đột đánh số đáp án Viết được giữ rõ trong V7_HSK2_BLUEPRINT.md.

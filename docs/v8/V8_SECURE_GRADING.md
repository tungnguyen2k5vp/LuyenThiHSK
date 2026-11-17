# V8 · Chấm phía server và DTO

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

Offline/private practice vẫn có answer keys ở client; không tuyên bố chống gian lận tuyệt đối. Secure adapter chỉ chạy QA, không mount production và không ép guest phụ thuộc cloud.

Whitelist cả nested options/image/audio/matching; loại correctAnswer/correctOptionId/solution/answerBankKey/explanation/transcript khỏi pre-submit DTO. Guard owner/nonce/expiry/input/known IDs, rate limit, immutable submitted result và idempotent replay. Manual items bị từ chối với REQUIRES_HUMAN_GRADING.

20 kiểm tra qua HTTP loopback, QA auth fixture; SQLite riêng được đóng/mở lại để chứng minh durability/replay. Audit callback ghi START/SUBMIT/REPLAY không keys. grading-network.json lưu HTTP payload kiểm tra thực; không chỉ giấu CSS.

Production Security=NOT VERIFIED: chưa auth transport thật/durable deployment/HTTPS/distributed limiter/audit sink. Adapter Map mặc định chỉ phù hợp isolated tests; qa-grading-store không mở live editorial DB.

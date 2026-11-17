# Testing — V5

Xem [TEST_REPORT_V5](v5/TEST_REPORT_V5.md), [CURRENT_STATE](CURRENT_STATE.md) và [bằng chứng](../data/reports/v5/final-regression.json). V5 không thay engine hoặc storage key cũ. Các kết quả V4 bên dưới là lịch sử.

# Testing — hiện hành V4

Xem [TEST_REPORT_V4](../TEST_REPORT_V4.md). Chrome và Edge V4 PASS; V1–V3 regression PASS. [CURRENT_STATE](CURRENT_STATE.md) là trạng thái mới nhất.

## Lịch sử kiểm tra V3/V2

# Testing — hiện hành V3

Xem [TESTING_V3.md](TESTING_V3.md) cho kết quả hiện hành. Nguồn trạng thái: [CURRENT_STATE](CURRENT_STATE.md).

## LEGACY / BASELINE V2

# Testing V2

Baseline và bản V2 đã qua typecheck, kiểm tra static TypeScript/unused (lệnh lint), unit core, kiểm tra content legacy và build. Lệnh lint hiện dùng TypeScript compiler, chưa có ESLint stylistic rules.

Chạy: npm run typecheck; npm run lint; npm test; npm run test:v2; npm run test:admin; npm run check:content; npm run build. Chạy npm run server và preview port 4173 trước npm run test:browser.

test:v2 kiểm tra source counts, search pinyin không dấu, distractors riêng biệt, old-engine validation, daily budget/near-exam, progress, readiness thiếu bằng chứng, adaptive selection, recurring mistakes, quoted CSV mapping và storage độc lập/corrupt backup. test:admin dùng DB/profile tạm, kiểm tra token, validate/dry-run/apply/dedup/replay, review/publish, conflict/revision/archive/audit.

Browser QA dùng Chrome profile tạm: engine regression/audio error/autosave/reload/section timer/submit/offline; tab thứ hai bị chặn ghi phiên; 4 bước onboarding HSK4; vocabulary/search/quiz; grammar; canvas Hanzi; draft viết reload; 12 câu diagnostic; admin import→review→publish→archive; học từ đã cache offline. Kiểm tra 9 màn tại 320/375/390/430px. Speech double chỉ xác minh logic audio, chưa xác minh nghe thật; canvas dùng pointer thực qua CDP. Microphone vật lý/STT và các trình duyệt ngoài Chrome chưa được xác minh.

Ảnh: docs/screenshots/exam-focus/v2-*.png. Dữ liệu admin QA được archive sau bài kiểm tra; không đụng tiến độ browser profile của người dùng.

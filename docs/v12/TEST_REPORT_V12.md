# V12 · Bằng chứng kiểm thử

| Bộ | Kết quả |
| --- | --- |
| Baseline regression / browser | 29/29 · 10/10 PASS |
| Final regression | 32/32 PASS |
| Final browser groups | 12/12 PASS |
| V12 unit | 1155 assertions PASS |
| V12 API | 147 checks PASS |
| Today / grammar mistake planner | 70 assertions /10 consecutive runs PASS |
| 10 lượt unit + 10 API | 20/20 PASS |
| 10 lượt Chrome +10 Edge | 20/20 PASS |
| Internal mock fixture60 | Chrome + Edge PASS; waveform chỉ QA |
| Security source/local HTTP | 17/17 PASS |
| Image decode/pixel check | 46 PNG PASS |
| Real cloud Auth/RLS | NOT_VERIFIED |
| CI | NOT_RUN |
| Firefox/WebKit/physical devices/IME/screen reader | NOT_TESTED |

Không automatic retry trong chuỗi cuối. Các failure trước được giữ ở failures: CDP sandbox; sync baseline timeout khi concurrent warm-up; import/selector harness mới; Edge metadata readiness khi chưa play bản draft. Kiểm tra mới dùng nút nghe native, output headless tắt tiếng và xác nhận currentTime tiến lên; không dựa vào promise play không có hạn chờ. Chưa xác định được nguyên nhân nền của timeout promise trên Edge; không coi đây là kiểm chất lượng phát âm. Không xóa assertions để có PASS.

Phạm vi: cấu trúc/reference validation, explicit metadata NA, canonical vocab/SRS IDs, W1 mastery exclusion, actual availability, guided TTS fallback, mic permission/draft/PCM playback, signed rights scopes/revocation, immutable revisions, mock gate, image success/error/retry/race, writing ungraded/undo/composition/autosave/resume, reviewer notes/CAS/XSS-safe offline export, journal/Web Locks/owner/logout/replay. Fixtures và test credentials chỉ ở DB/profile QA tạm.

[unit-tests](../../data/reports/v12/unit-tests.json) · [api-tests](../../data/reports/v12/api-tests.json) · [Hồi quy](../../data/reports/v12/final/regression.json) · [Matrix](../../data/reports/v12/final/browser/matrix.json) · [Repeated browser](../../data/reports/v12/repeated/browser.json).

Chuỗi lỗi giữ tại [first-aggregate](../../data/reports/v12/failures/first-aggregate/qa.json), [second-aggregate](../../data/reports/v12/failures/second-aggregate/qa.json) và các failure JSON/PNG cùng thư mục. Chuỗi thứ hai qua Chrome 10 lượt và Edge 6 lượt, Edge lượt 7 timeout tại promise play. Lượt chẩn đoán native ban đầu cũng chưa đạt; sau đó harness cuộn tức thời và lấy tọa độ nút nghe sau khi audio nằm trong viewport. Việc sửa harness không chứng minh đã tìm được toàn bộ nguyên nhân timeout media nền. Kết quả chuỗi cuối được ghi riêng, không cộng các lượt từ nhiều chuỗi để đủ 10.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.

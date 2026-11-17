# V7 · Browser & accessibility QA

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

| Suite | Browser | Status |
| --- | --- | --- |
| v7 | Chrome | PASS |
| v7 | Edge | PASS |
| v5 | Chrome | PASS |
| v4 | Chrome | PASS |
| v1-v3 | Chrome | PASS |
| v6-stress | Chrome | PASS |

Chrome/Edge dùng binary thật, loopback private API, profile tạm. Viewport320/375/390/430/768/1280; không phải điện thoại thật. Stress 8 matching rows/options dài, canonical serialization/reload/grading. Existing V1–V5 tests giữ keyboard/timer/snapshot/SM2/guest/CSV/admin.

Các failure logs đầu được giữ: lỗi audio retry Edge và legacy grammar bị lọc hết câu; sửa decoder watchdog/key và nhãn guided/fallback legacy; chạy lại matrix. Không đổi timeout để che lỗi. Browser flow có 10 vòng audio retry.

Accessibility PARTIAL: 70 controls trên màn review được quét, 0 thiếu tên trong mẫu, AX tree và contrast opaque samples; root font200% và forced-colors emulation. Numeric answers,matchingselect,flags,dialogEscape/focus thực thi. Sửa màu primary/header/ghost khi mẫu trước không đủ tương phản. Screen reader/real browser zoom/Firefox/WebKit/real mobile NOT VERIFIED. Không gọi WCAG compliant. Chuẩn đối chiếu: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html và https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/.

Ảnh/checklist/manifest và gallery ghi riêng. Contact sheet asset QA không được gọi là một màn sản phẩm.

# V8 · Browser QA

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

| Luồng | Status |
| --- | --- |
| Chrome V8 +V6/V7 | PASS |
| Edge V8 +V6/V7 | PASS |
| v5-Chrome | PASS |
| v4-Chrome | PASS |
| v1-v3-Chrome | PASS |
| v6-stress-Chrome | PASS |
| Chrome multi-tab | PASS |
| Edge multi-tab | PASS |

Chrome/Edge binary thật, local preview/API, temporary profiles. Viewport320/375/390/430/768/1280. Không dùng điện thoại cá nhân. REAL_MOBILE_NOT_VERIFIED; Firefox/WebKit/Safari unavailable. Native file audio decode là kỹ thuật, không xác nhận người dùng nghe tự nhiên.

V8-only, extra và full flows kiểm pilot/manual scoring/history/review/Save&Next/stale/import; fixture empty/account/sync được ghi rõ trong manifest. Matrix lần đầu connection-refused do preview dừng sau interruption được giữ riêng, sau khởi động lại4suite PASS. Không gọi failure screenshot là màn hoàn thiện.

Ảnh/metadata/contact sheets/ZIP trong docs/screenshots/v8 và data/reports/v8. [Gallery](SCREENSHOT_GALLERY.html).

# Test report V4 — 16/10/2026

## Đã PASS

| Nhóm | Kết quả/phạm vi |
|---|---|
| npm run typecheck | PASS |
| npm run lint | PASS; TypeScript compiler/unused, không phải ESLint |
| npm test | PASS: scoring/storage/migrations/import/license/SM2 |
| npm run test:v2 | PASS: curriculum/search/quiz/plan/diagnostic/weakness |
| npm run test:v3 | PASS: metadata/licenses/seed/revision/media/timing |
| npm run test:admin | PASS: auth/import/review/publish/archive/conflicts |
| npm run test:v3-api | PASS trên DB tạm |
| npm run test:v4 | PASS trên DB tạm:537draft,auth,seed,progressisolation,stageidempotency,fingerprint/revalidation,human/licensegate,duplicate-starttoken |
| npm run check:content | PASS:3legacybanks/20uniquequestions/0productionfull; không tính128draftV4 vào public |
| npm run build | PASS |
| npm run test:browser | PASS hồi quy V1–V3:offline,two-tab,audiorecovery,adminfixturesarchive,layouts |
| npm run test:browser:v4 (Chrome) | PASS |
| HSK_BROWSER_PATH=Edge, browser V4 | PASS |

V4 E2E: onboardingHSK1→hômnay→vocabularysearch/meaning/example/SM2→grammarlesson→practice/result→listeningfileplayback/check/transcript→MiniĐọc/reload/answer/deadline→FullMock40q→sectiontimeout→submit→results→mistakes→weakness→recommendedreview→reviewqueue/humangate→40WAVdecode→mobile320/375/390/430. Production study/preparation keys giữ nguyên trong từng hồ sơ QA.

Fullmocktimeout QA được tăng tốc bằng deadline ngắn trong profile thử sau khi thoát phòng thi rồi mở lại; engine thật tự chuyển phần. Không đợi35phút thực. Test không tự gắn human review vào nội dung V4. Test V3 dùng QA fixtures và archive sau chạy; APIunit dùng SQLite tạm.

## Lỗi gặp trong quá trình và đã xử lý

- Test pinyin sān giả định kết quả đầu tiên là三; search còn tìm nghĩa Việt “sáng”. Sửa test chọn đúng Hanzi trong tập kết quả.
- Runtime click ở Chrome headless thiếu autoplay permission; test profile bật autoplay cho QA, giữ app phát theo tương tác người dùng.40WAVđược decode thực, không dùng speechdouble để chứng minh file này.
- Injectiondeadline khi Room còn mount bị autosave ghi lại: test thoát phiên rồi inject deadline vào QA storage trước khi resume.
- Hằng số557missingVI của V3 lỗi sau cleanup giảm xuống552. Test đọc dataset hiện tại; không nới assertion kết quả khác.
- Stage phát hiện fingerprint thay đổi vì optionalnull; canonical hóa null/undefined. Nghĩa pronoun “họ” không bị lọc như surname ở overlayV4.

## Chưa kiểm/chưa thể xác nhận

Chưa nghe đánh giá giọng và pinyin bởi người thật; browser decode/playback không phải review phát âm. Chưa có calibrated difficulty, expert answer check, rights approval voice, Lighthouse/CWV hoặc thiết bị mobile thật. Chưa kiểm Safari/Firefox, mic vật lý hoặc deployproduction. Previewcoldofflineaudio không được quảng cáo hỗ trợ. Vì vậy PASS kỹ thuật không gỡ BLOCKED_FOR_HUMAN_REVIEW.

Evidence: `data/reports/v4-browser-chrome.json`, `v4-browser-edge.json`, `v4-content-validation.json`, `v4-live-readiness.json`; ảnh `docs/screenshots/exam-focus/v4-*.png`.

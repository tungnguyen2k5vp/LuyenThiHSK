# Exam UX QA scope

Đã mount5 nhóm UI; Chrome/Edge mỗi browser26 nhóm kiểm tra. Scenario practice/timed/catalog/intro, matching/shared-bank, private-rights block và flag fallback được kiểm trong scope local. Không có chứng nhận đề Official/Secure Exam.

| Hành vi | Bằng chứng hiện có | Giới hạn |
| --- | --- | --- |
| Catalog/filter/Intro/start gate | API41 + contract + E2E V14 | Chỉ các candidate tổng hợp đã đăng ký; bài kỹ năng vẫn ở khu Luyện tập |
| Practice/timed feedback | Real question whitelist và command checks | Không phải Secure Exam server-authoritative |
| Navigation/timer/media pause | Owner + E2E acknowledgement/reload/credit invariant | Không reset timer; chỉ credit media hợp lệ |
| Matching partial/group/bank | Registry + dynamic A–F + actual shared-bank E2E | Compound matching dùng renderer đã kiểm tra |
| Writing raw Unicode/IME/Undo | V14 composition, native Undo, offline-save/reload E2E | Giữ textarea owner; chưa physical IME/device validation |
| Submit/reload/mistake/review | V13 Chrome/Edge30 groups mỗi browser | Giữ owner cũ, chưa chuyển V14 |
| Restricted/unreviewed content | Private auth/preview/public gates + security tests | Không có production deploy |

Kiểm tra bổ sung: true/false dùng bài bổ trợ hiện hữu và ánh xạ đúng ID “Đúng/Sai”; không thêm dạng câu vào template Full Mock. Trên mobile, đã sửa nút danh sách câu hỏi bị ẩn và alias CSS overlay/container của hộp thoại. E2E kiểm tra overlay ở vị trí fixed, Escape đóng và trả focus về nút mở. Ảnh chụp cần được xem cùng kết quả chức năng; việc phần tử tồn tại trong DOM chưa đủ để kết luận hiển thị đúng.

`data/reports/v14/browser-regression.json`: Chrome/Edge PASS, private API clone và temporary dist/script copies chỉ đổi local API port. Source sản phẩm không đổi bởi harness. Screenshot compatibility tại `docs/screenshots/v14/compatibility-*`; không coi là gallery UI V14.

Integrated evidence: `integrated-browser.json`, performance Chrome/Edge JSON, screenshots `after-*`. Đã xem ảnh thực tế Catalog mobile, Room có ảnh decode, matching A–F và Result ungraded. Không chấp nhận CSS-hide đáp án làm security gate. Offline test là lưu phiên Writing đã tải; không phải cold boot private Preview khi không có API.

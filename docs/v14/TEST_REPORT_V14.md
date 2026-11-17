# Test report V14

## Đã chạy

- Baseline V13:35/35 jobs PASS trong copy riêng; logs lưu tại baseline-regression JSON.
- Current full handed-off source V14:38/38 jobs PASS trong copy riêng, authoringExclusions=[], gồm typecheck/lint/build, V1–V13 và3 test V14. Product source được đối chiếu với copy đã kiểm tra.
- V14 contract:5.413 assertions, đúng SHA256 của contract freeze.
- V14 API:41 assertions; private catalog/intro, exact builder revisions và unchanged clone tables.
- V14 import:22 assertions; fake grant chỉ dùng trong test, không cấp quyền thật.
- V14 security:14 kiểm tra static/local HTTP, gồm dev deny403 cho private reports/token file.
- Integrated V14 Chrome26 + Edge26 groups PASS; 6 A/B comparisons WITHIN; source product/config khớp workspace38/38, không exclusions.
- Chrome/Edge compatibility:30 nhóm/browser; API clone, temporary profile/dist/script port rewrite; không ghi main DB.
- Main data safety:toàn bộ hàng10 application tables (8 content/2 account), integrity hai DB và media/public bytes unchanged. Không xóa audit cũ.

## Authoring / lỗi đã giữ

Lượt bổ sung đã phát hiện CSS mobile chưa hiện nút mở navigator và class modal chưa khớp stylesheet; đã sửa sản phẩm, thêm assertion vị trí fixed và Escape/focus. Selector QA có chuỗi Unicode hỏng đã được sửa, log lỗi giữ lại. Một lượt A/B tải lại Preview chưa hoàn thành dù token còn nguyên; không coi token tồn tại là bằng chứng API đã tải thành công, và không nâng budget để bỏ qua lỗi. Trạng thái chấp nhận cuối lấy từ báo cáo JSON của lượt chạy sau cùng.

Lượt current full-source snapshot đầu thấy10 lỗi props ở UI V14 Gemini đang viết; giữ log. Chỉ hai vùng authoring chưa tích hợp được loại khỏi copy kiểm tra Codex, không loại UI V13 đã tích hợp. Sau đó full workspace typecheck/lint/build được quan sát PASS khi Gemini tự sửa; chưa có receipt ổn định nên kết quả đó không tự chấp nhận batch.

Bootstrap test từng thiếu audio trong clone; browser clone từng thiếu shared import. Đều sửa setup, giữ log thất bại và chạy lại. Import/contract harness từng có lỗi cú pháp/fixture-shape khi viết test, đã sửa trước kết quả PASS. Không sửa assertion để biến readiness HSK2 thành ready.

Current regression report: `data/reports/v14/current-regression.json`; final gates tại `release-gates.json`. Hai browser thực sự phát audio file, chọn ảnh, shared bank/reload, fixed timed mode, section acknowledgement, double-submit, Unicode/Undo/offline-save và ungraded Result. A/B20 alternating pairs mỗi scenario,6 comparisons trong budget. Không gọi warm paint proxy là production Web Vitals.

Các phép đo A/B cuối lấy từ hai lượt riêng trên cùng build sản phẩm: Chrome và Edge mỗi lượt có 26 nhóm E2E cùng ba probes. Không gộp thành tuyên bố rằng mọi lượt chạy nối tiếp dài đều ổn định. Một số lượt nối tiếp Chrome→Edge dừng khi tải lại Catalog; fetch audit ghi request chưa hoàn tất và token còn nguyên. Kiểm tra Node trực tiếp trong lượt tái hiện thấy API health200 và release200; chưa chứng minh nguyên nhân nằm ở browser hay server trong các lần lỗi khác. Đây là rủi ro độ ổn định cần theo dõi, còn log/timestamp để tái hiện; chưa có xác nhận đã xử lý nguyên nhân tận gốc.

Edge từng timeout Runtime.evaluate và có lần lazy Catalog chưa tải sau phép đo dài; audit xác nhận token vẫn tồn tại, không chứng minh mất quyền hay mất tiến độ. Đã giữ failed logs, thêm focus/probe diagnostics và chạy bằng Vite preview như ứng dụng; lượt cuối cả hai browser PASS. Không kết luận nguyên nhân duy nhất của mọi timeout. Đây là technical local scope, không CI/merge/deploy. Physical microphone/pronunciation/IME/assistive technology, Firefox/WebKit và private offline hard reload vẫn chưa xác minh/hoàn thiện.

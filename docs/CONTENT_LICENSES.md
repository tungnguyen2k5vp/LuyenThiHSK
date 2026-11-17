> CURRENT_STATE: [trạng thái hiện hành](CURRENT_STATE.md). Tài liệu này có các snapshot LEGACY / PRE-V2 bên cạnh bổ sung V2. Những đoạn nói chưa import hoặc chưa có backend chỉ mô tả lịch sử; không dùng làm trạng thái V3.

# Giấy phép nội dung và phần mềm

Rà soát: **15/10/2026**. Đây là inventory kỹ thuật, không phải tư vấn pháp lý. Mã ứng dụng, dataset, dictionary, câu ví dụ, audio, hình ảnh và nét chữ là các loại tài sản riêng.

## Nội dung ứng dụng

- 20 câu hỏi và lời giải minh họa hiện có được biên soạn cho LuyenThiHSK; metadata `rights_status: original`. Không lấy nguyên câu hỏi, đáp án, transcript, audio hay ảnh từ đề CTI hoặc website luyện thi khác.
- Người học nhập/biên soạn nội dung riêng sẽ mang `rights_status: user_supplied` hoặc `unverified`; chỉ nằm trong trình duyệt cục bộ. Trạng thái này không cấp quyền xuất bản hoặc đồng bộ.
- Chưa có vocabulary/grammar/Hanzi dataset công khai được đóng gói. Chưa dùng dữ liệu sample từ CTI, GitHub, PDF hoặc dataset community.
- TTS dùng voice của thiết bị, được gắn nhãn máy; không đóng gói audio ngoài.

## Thư viện

Runtime hiện chỉ có React/React DOM; Vite/TypeScript và plugin React là build/dev dependencies. Kiểm tra phiên bản cụ thể ở `package-lock.json` trước khi phân phối. Không thêm dependency từ 15 repository tham khảo.

## Các repository HSK đã rà soát

- [hsk4-mock-exam](https://github.com/Make-dream-clear/hsk4-mock-exam): README khai báo **CC BY-NC-SA 4.0**; không dùng nội dung trong sản phẩm thương mại. Không nhập câu hỏi/audio/đáp án.
- [open-hsk](https://github.com/jamesjfoong/open-hsk): README còn placeholder về license; không reuse code/data/assets.
- [hsknest](https://github.com/s-mberli/hsknest): mã ứng dụng AGPL-3.0; README nêu license data riêng (vocab MIT, CC-CEDICT CC BY-SA 4.0, Tatoeba CC BY 2.0 FR). Không dùng code/data.
- Các repository khác và ghi chú phạm vi license ở [`REFERENCE_REPOSITORIES.md`](./REFERENCE_REPOSITORIES.md). MIT ở root repo không chứng minh quyền với PDF gốc, câu hỏi chính thức, OCR, transcript, dịch nghĩa, câu ví dụ hoặc audio.

## Nguyên tắc public

Public content cần đồng thời có quyền phân phối và được review nội dung. `official_verified` mô tả đối chiếu học thuật với CTI; `open_license_verified` mô tả quyền theo asset. Hai cờ này độc lập. License MIT của code không làm cho dữ liệu thành MIT. Asset chưa rõ quyền giữ private/unverified, không đưa vào bundle.

## Cập nhật V2 — quyền dữ liệu đã dùng

V2 có dictionary adaptation từ CVDICT/CC-CEDICT, CC BY-SA 4.0, và English fields từ Complete HSK Vocabulary với MIT notice + CC-CEDICT attribution. Không nhập frequency/radicals/POS analysis bên ngoài của bộ complete. Nghĩa Việt cộng đồng có dịch máy, chưa được duyệt riêng từng mục và không phải nghĩa CTI.

Nét chữ từ hanzi-writer-data 2.0.1 / Make Me a Hanzi dùng Arphic Public License, có đầy đủ ARPHICPL.TXT. Từ/cách đọc/cấp và tên cấu trúc/category chỉ đối chiếu facts với PDF CTI; không phát hành PDF, ví dụ CTI, đề, đáp án hoặc audio CTI. Public release có THIRD_PARTY_NOTICES.md và source/edition/license/revision/status theo record. Data adaptation phân phối theo CC BY-SA 4.0; không suy diễn license này áp cho toàn bộ code app.

Các quyết định chưa import bên dưới là snapshot trước V2, được thay thế cho các field nêu trên. Dataset hsk4-mock-exam CC BY-NC-SA và repo không rõ quyền tiếp tục bị loại.


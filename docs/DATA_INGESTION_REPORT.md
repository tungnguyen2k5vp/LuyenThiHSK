# Bản tiếp nối QKT: số liệu hiện hành · 22/10/2026

**169 → 262 bộ bài; 15.862 → 24.542 câu (+8.680).** Thêm 93 phân bộ tối đa 100 câu. Đây là các bài luyện bổ trợ, không phải 93 đề chính thức. Không tải thêm dataset/audio trong lần này: tận dụng nguồn có giấy phép đã nhập, giữ nguyên 150 ngân hàng mở cũ và 19 ngân hàng trước đó.

| Tài nguyên | Trước | Sau |
| --- | ---: | ---: |
| Bộ bài khả dụng | 169 | 262 |
| Câu hỏi hợp nhất | 15.862 | 24.542 |
| Câu từ no7z + HearMandarin | 14.299 | 22.979 |
| Câu Trung chuẩn hóa no7z | 4.352 | 4.352 |
| Bản ghi từ vựng HearMandarin chuẩn hóa | 11.105 | 11.105 |
| Mục syllabus trong thư viện từ cũ | 11.000 | 11.000 |
| MP3 normal + slow, SHA duy nhất | 8.708 | 8.708 |
| Dung lượng MP3 no7z | 159.264.574 byte | 159.264.574 byte |

## Trước/sau theo cấp và phiên bản

| Cấp | Bộ trước | Bộ sau | Câu trước | Câu sau | Tăng |
| --- | ---: | ---: | ---: | ---: | ---: |
| Chưa xác minh | 2 | 2 | 15 | 15 | +0 |
| HSK 1 | 8 | 14 | 960 | 1517 | +557 |
| HSK 2 | 14 | 26 | 1188 | 2264 | +1076 |
| HSK 3 | 16 | 32 | 1454 | 2905 | +1451 |
| HSK 4 | 30 | 47 | 2635 | 4236 | +1601 |
| HSK 5 | 20 | 40 | 1928 | 3854 | +1926 |
| HSK 6 | 22 | 44 | 2082 | 4151 | +2069 |
| HSK 7-9 | 57 | 57 | 5600 | 5600 | +0 |

| Phiên bản / chuẩn | Bộ trước → sau | Câu trước → sau |
| --- | ---: | ---: |
| hsk3 / unverified | 2 → 2 | 15 → 15 |
| hsk2 / unverified | 1 → 1 | 5 → 5 |
| hsk3 / hsk3-2025 | 60 → 60 | 6105 → 6105 |
| hsk2 / hsk2-2015 | 12 → 12 | 1033 → 1033 |
| hsk3 / hsk3-2021 | 94 → 187 | 8704 → 17384 |

Không trộn GF0025-2021 với syllabus 2025. Chưa có nguồn HSK 2.0 mới đủ quyền nhập. Các mẫu cũ chưa xác minh edition giữ nhãn chưa rõ chuẩn.

## Dạng mới và độ tin cậy

- **4.349 câu nghe chép chính tả**: audio bình thường/chậm cũ, transcript nguồn làm đáp án, ô nhập tiếng Trung, chấm đối chiếu văn bản và khoảng trắng/dấu câu thông dụng. Không mở transcript trước khi kiểm tra.
- **4.331 câu sắp xếp từ**: chỉ tạo khi có ít nhất 3 token và chuỗi token ghép khớp câu gốc sau chuẩn hóa. Trộn token ổn định, giữ đủ token kể cả từ lặp; người học gõ lại câu hoàn chỉnh. Đáp án là câu nguồn, chưa chấm mọi trật tự thay thế có thể đúng.
- 21 câu không đủ điều kiện token bị bỏ qua cho dạng sắp xếp; vẫn giữ câu/audio và các bài đọc/nghe cũ. Danh sách ở `report.json.omitted`.
- Giữ `answerVerified:false`, `SOURCE_KEY_NOT_INDEPENDENTLY_REVIEWED`; đây là đối chiếu nguồn bằng máy, chưa phải thẩm định chuyên môn. Không chấm viết tự do bằng quy tắc này.
- Câu MC cũ: 8.704 no7z + 5.595 HearMandarin. Tất cả ID/nội dung cũ giữ nguyên. no7z hiện có 17.384 bài phái sinh; HearMandarin vẫn 5.595.

## Khử trùng, provenance và chạy lại

4.354 câu thô → 4.352 câu chuẩn (2 gộp); 11.147 dòng từ → 11.105 bản ghi (42 gộp), giữ alias/biến thể nguồn. 3 bài chép chính tả trùng hình thức sau chuẩn hóa được loại khỏi manifest, có alias trong `dedupe.json`: HSK5-0938 → HSK5-0666, HSK6-0226 → HSK2-0390, HSK6-0476 → HSK4-0061. Đây là câu nghe cùng nội dung; các bài MC với ngữ cảnh/lựa chọn khác vẫn giữ. 85 nhóm gần trùng chỉ để rà soát; không tự gộp. Không có MP3 trùng SHA.

Lần nhập thật: 93 tệp thêm, 3 tệp metadata sửa, 8.864 tệp không đổi. Lần chạy lặp sau đó: **0 thêm / 0 sửa / 8.960 không đổi**. Dry-run đã chạy trước nhập thật; không sửa DB. Source checksum/commit/giấy phép được khóa như bản trước; nguồn lỗi không xóa dữ liệu cũ.

Backup: `.runtime/backups/before-qkt-compact-1792658417278`. Kiểm tra byte của toàn bộ 150 tệp ngân hàng mở cũ và tất cả hàng của 8 bảng SQLite so với backup đều qua. Storage/session snapshots/SM2/câu sai giữ nguyên; nâng giới hạn snapshot nháp từ 300 lên 500 câu để lưu được toàn bộ ngân hàng đọc cũ 355 câu.

## Hiện trạng chi tiết

| Cấp / phiên bản / chuẩn | Bộ | Câu | Nghe | Đọc | Viết | Câu có audio | Có bản chậm |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Chưa xác minh / hsk2 / unverified | 1 | 5 | 2 | 2 | 1 | 0 | 0 |
| Chưa xác minh / hsk3 / unverified | 1 | 10 | 2 | 5 | 2 | 0 | 0 |
| HSK 1 / hsk3 / hsk3-2021 | 12 | 1119 | 562 | 557 | 0 | 562 | 562 |
| HSK 1 / hsk3 / hsk3-2025 | 2 | 398 | 43 | 355 | 0 | 43 | 0 |
| HSK 2 / hsk3 / hsk3-2021 | 24 | 2152 | 1076 | 1076 | 0 | 1076 | 1076 |
| HSK 2 / hsk3 / hsk3-2025 | 2 | 112 | 0 | 88 | 24 | 0 | 0 |
| HSK 3 / hsk3 / hsk3-2021 | 32 | 2905 | 1454 | 1451 | 0 | 1454 | 1454 |
| HSK 4 / hsk2 / hsk2-2015 | 12 | 1033 | 481 | 476 | 76 | 481 | 0 |
| HSK 4 / hsk3 / hsk3-2021 | 35 | 3203 | 1602 | 1601 | 0 | 1602 | 1602 |
| HSK 5 / hsk3 / hsk3-2021 | 40 | 3854 | 1927 | 1927 | 0 | 1927 | 1927 |
| HSK 6 / hsk3 / hsk3-2021 | 44 | 4151 | 2080 | 2071 | 0 | 2080 | 2080 |
| HSK 7-9 / hsk3 / hsk3-2025 | 56 | 5595 | 0 | 5595 | 0 | 0 | 0 |
| HSK 7-9 / hsk3 / unverified | 1 | 5 | 1 | 1 | 1 | 0 | 0 |

Các kỹ năng khác còn 2 câu Dịch và 1 câu Nói minh họa trong kho cũ. Tổng theo kỹ năng: Nghe 9.230; Đọc 15.205; Viết 104; Dịch 2; Nói 1. Số câu có audio có thể tăng do dùng lại tệp; số tệp duy nhất vẫn 8.708.

## Cập nhật tiếp

Chạy từ `D:/ReactJS/LuyenThiHSK`:

```powershell
npm run data:hsk:fetch -- --offline
npm run data:hsk:import -- --dry-run
npm run data:hsk:import
npm run data:hsk:validate -- --backup=.runtime/backups/before-qkt-compact-1792658417278/hsk-content.sqlite
npm run test:catalog
npm run data:hsk:audio -- --http
npm run lint
npm run build
```

Chạy HTTP audit sau khi build hoàn tất và preview ở 4173 đang phục vụ ổn định. Muốn cập nhật phiên bản nguồn phải rà soát license, backup, thay khóa nguồn có chủ đích rồi chạy lại các kiểm tra; không tự trỏ latest. Báo cáo máy đọc: [manifest](../public/data/open-hsk/manifest.json), [report](../public/data/open-hsk/report.json), [dedupe](../public/data/open-hsk/dedupe.json).

---

## Lịch sử trước bản giao diện gọn

Các số liệu/kiểm thử bên dưới thuộc bản trước; dùng phần đầu tài liệu để xem hiện trạng.

# Báo cáo nhập dữ liệu HSK · 22/10/2026

Kho hợp nhất: **169 bộ bài / 15862 câu**, gồm 19 bộ cũ/1563 câu và **150 bộ bổ trợ mới / 14299 câu phái sinh**. 150 bộ mới là các phần tối đa 100 câu, thời gian luyện tự đặt; **không phải 150 đề thi chính thức**. Số liệu lấy từ [report.json](../public/data/open-hsk/report.json) và [manifest.json](../public/data/open-hsk/manifest.json), UI dùng metadata, không hardcode.

## Phạm vi theo cấp, edition, kỹ năng

| Cấp / phiên bản / edition | Bộ bài | Câu | Nghe | Đọc | Viết | Nói | Dịch | Câu có tệp nghe | Có bản chậm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chưa xác minh / hsk2 / unverified | 1 | 5 | 2 | 2 | 1 | 0 | 0 | 0 | 0 |
| Chưa xác minh / hsk3 / unverified | 1 | 10 | 2 | 5 | 2 | 0 | 1 | 0 | 0 |
| HSK 1 / hsk3 / hsk3-2021 | 6 | 562 | 281 | 281 | 0 | 0 | 0 | 281 | 281 |
| HSK 1 / hsk3 / hsk3-2025 | 2 | 398 | 43 | 355 | 0 | 0 | 0 | 43 | 0 |
| HSK 2 / hsk3 / hsk3-2021 | 12 | 1076 | 538 | 538 | 0 | 0 | 0 | 538 | 538 |
| HSK 2 / hsk3 / hsk3-2025 | 2 | 112 | 0 | 88 | 24 | 0 | 0 | 0 | 0 |
| HSK 3 / hsk3 / hsk3-2021 | 16 | 1454 | 727 | 727 | 0 | 0 | 0 | 727 | 727 |
| HSK 4 / hsk2 / hsk2-2015 | 12 | 1033 | 481 | 476 | 76 | 0 | 0 | 481 | 0 |
| HSK 4 / hsk3 / hsk3-2021 | 18 | 1602 | 801 | 801 | 0 | 0 | 0 | 801 | 801 |
| HSK 5 / hsk3 / hsk3-2021 | 20 | 1928 | 964 | 964 | 0 | 0 | 0 | 964 | 964 |
| HSK 6 / hsk3 / hsk3-2021 | 22 | 2082 | 1041 | 1041 | 0 | 0 | 0 | 1041 | 1041 |
| HSK 7-9 / hsk3 / hsk3-2025 | 56 | 5595 | 0 | 5595 | 0 | 0 | 0 | 0 | 0 |
| HSK 7-9 / hsk3 / unverified | 1 | 5 | 1 | 1 | 1 | 1 | 1 | 0 | 0 |


Cột audio là số câu có tệp normal trong ngân hàng (có thể gồm URL nguồn cũ), không phải số file duy nhất. Riêng dữ liệu no7z có **8708 file MP3 cục bộ duy nhất**, 159264574 byte: 4354 normal +4354 slow; gồm 4 biến thể của hai câu bị gộp. Không tính TTS trình duyệt là file. Tất cả file có SHA-256, MIME, kích thước và thời lượng tính từ frame.

## Đầu vào và chuyển đổi

| Nguồn | Đọc | Chuẩn hóa | Trùng gộp | Kết quả |
| --- | --- | --- | --- | --- |
| no7z | 4354 câu | 4352 câu | 2 | 8704 bài Nghe/Đọc; 8708 MP3 tổng hợp |
| HearMandarin | 11147 dòng | 11105 từ/cách đọc | 42 | 5595 bài từ-nghĩa 7–9; bổ sung nghĩa Anh/POS cho 10954 ID hiện hữu |

Không loại dòng đầu vào mới nào vì lỗi; không mất nguồn/biến thể: sourceIds, sourceVariants, audioVariants và aliases được bảo toàn. 31 xung đột cấp HearMandarin với curriculum hiện tại được gắn cờ; giữ cấp hiện tại, nghĩa Việt và ID học cũ. 11000 từ/576 grammar/3088 Hanzi hiện hữu không bị thay thế; 151 từ không khớp ID vẫn có trong words.json, chưa tạo mới tiến độ học.

no7z gán cấp theo **GF0025-2021**, không đổi nhãn thành syllabus 2025. HearMandarin giữ HSK 2.0 và HSK 3.0 riêng, nhóm 7 là band7–9. Bài phái sinh dùng câu/bản dịch và đáp án nguồn, lựa chọn nhiễu ghép ổn định; answerVerified=false, chưa được duyệt chuyên môn độc lập. Pinyin được hiển thị trong bài từ 7–9 để phân biệt cách đọc. Các bài đọc nghĩa dùng tiếng Anh theo dữ liệu được cấp phép.

12 từ có nhiều band được tạo bài theo đúng nghĩa/từ loại ở band7; sourceRecordId trỏ vào biến thể đó, canonical ID vẫn ổn định. Ví dụ 和 hé ở cấp cao là adjective/gentle; mild. Phần nghĩa bổ sung trong curriculum giữ nhiều nghĩa/POS nguồn; không áp nghĩa cấp thấp cho bài cấp cao chỉ vì cùng chữ/cách đọc.

## Dedupe

Fingerprint toàn kho dựa trên Unicode NFKC, nội dung, kỹ năng/dạng câu, context, ảnh/audio, tập lựa chọn và nội dung đáp án; không dựa vào thứ tự ID lựa chọn. Loại bỏ khác biệt dấu câu/khoảng trắng. Có **0 câu trùng fingerprint còn lại** trong 15862 câu; 44 bản ghi nguồn (2 câu+42 từ) đã gộp trước tạo bài.

Có **85 cặp ứng viên** giữ để duyệt: 65 cùng prompt đã chuẩn hóa nhưng khác context/lựa chọn/key/audio, 20 cặp prompt dài ít nhất 12 ký tự khác một phép sửa. Đây là ứng viên, không khẳng định đồng nghĩa; không gộp tự động. Trùng SHA audio: 0. Phát hiện gần đúng hiện dùng một phép sửa ký tự, chưa dùng mô hình ngữ nghĩa; không tuyên bố đã loại mọi câu tương tự. Xem [dedupe.json](../public/data/open-hsk/dedupe.json).

## Pipeline và tái hiện

Raw bất biến tại data/imports; dữ liệu phục vụ tại public/data/open-hsk. Không cần migration: giữ nguyên schema SQLite, đọc DB bằng readOnly. Backup: .runtime/backups/before-open-datasets-2026-10-22, gồm DB backup nhất quán và code cũ.

Nguồn khóa: [open-hsk.json](../data/sources/open-hsk.json). no7z commit 857dfbab91027ebd97df01260e91b817cb6b4854; source.zip SHA c5b57ebbf844642b27e658ed3df161d44dfefed4db8ee7c399b898462ae21384; sentences JSON SHA 8f8ffd34eee29f395724ce060cad22511eeeabb7af731d5b5879dc0548e01660. Hear metadata version 2026-09-09, generated 2026-09-28; JSON SHA c8b590005c25def132c8401f4414c5b9cc9855a8fb00c9fad8cd22249895d0af. Metadata version và ngày generate khác nhau được giữ nguyên.

    npm run data:hsk:fetch                # 2 nguồn đã khóa; retry 3 lần, timeout/rate limit
    npm run data:hsk:fetch -- --offline   # xác minh raw đã tải, không mạng
    npm run data:hsk:import -- --dry-run  # không ghi dữ liệu phục vụ/DB; có log kiểm tra
    npm run data:hsk:import              # chuẩn hóa, kiểm tra rồi cập nhật file thay đổi
    npm run data:hsk:validate
    npm run data:hsk:audio               # kiểm tra toàn bộ MP3 cục bộ
    npm run build
    npm run data:hsk:audio -- --http     # chạy sau build, preview 4173 đang mở
    npm run data:hsk:audio -- --remote   # kiểm tra thêm URL cũ; không khẳng định giải mã toàn file remote

Importer tái sử dụng TSX loader đã cài trong ../Rea-HSK-Reference, không thêm package production. Nâng version upstream cần kiểm tra license/hash rồi sửa lock có chủ đích; hash thay đổi bất ngờ làm fetch/import dừng, không xóa dữ liệu cũ. Ghi từng file bằng rename, manifest cuối; toàn bộ folder không phải một transaction khi mất điện giữa chừng, cần rerun từ raw đã khóa trước khi phục vụ bản cập nhật.

Log lần chạy và dry-run: .runtime/open-hsk-import-last.json; fetch: .runtime/open-hsk-fetch.json. Chạy lại bản đã nhập: 0 added, 0 updated, 8867 unchanged. Không ghi vào localStorage người dùng, không reset phiên/attempt/câu sai/yêu thích; session snapshot vẫn sử dụng model cũ.

## Khoảng trống còn lại

Chưa thêm đề chính thức đầy đủ; chưa thêm bài Viết hay audio cấp7–9. HSK3/5/6 nay có câu Nghe/Đọc bổ trợ; không coi đó là mock đúng cấu trúc/thang điểm/thời gian CTI. Audio tổng hợp CosyVoice2 được ghi nhãn, không gọi là thu âm người bản ngữ. Khóa đáp án đã kiểm tra máy theo nguồn; cần người có chuyên môn duyệt nghĩa, nhiễu và phân cấp trước khi đánh dấu reviewed. Các nguồn chưa nhập và lý do ở [DATA_SOURCES](DATA_SOURCES.md).

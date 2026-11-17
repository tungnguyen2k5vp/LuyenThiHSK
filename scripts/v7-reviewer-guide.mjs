import {writeFile,mkdir} from 'node:fs/promises';await mkdir('data/review-packages/v7',{recursive:true});await writeFile('data/review-packages/v7/README.md',`# Gói duyệt HSK1 V7

Nội dung private, AI-assisted draft/NEEDS_REVIEW; không có dữ liệu học viên hoặc khóa server. Không tự approve.

## Các file

- reviewer-package.json: đủ 882 bản ghi ngoài template, gồm 396 câu để đối chiếu.
- questions.csv: riêng 80 exam candidates ưu tiên.
- grammar.csv: 68 bài.
- vocabulary.csv: 300 từ.
- audio.csv: 80 metadata/transcripts/references; chưa có quyền phân phối production.
- images.csv: 30 ảnh original chưa human review.
- optionBanks.csv: 8 banks.
- decisions-template.json: định dạng decisions để điền, không tự thực thi.

## Cách duyệt

1. Vào local content-review, nhập mã local riêng. Gói không cấp quyền chuyên môn.
2. Kiểm ID/revision/sourceFingerprint/workVersion. Nghe media bằng authenticated local player; không chia sẻ token.
3. Đọc câu/đáp án/distractors/Vi/pinyin/cấp; kiểm nguồn/quyền; ghi rõ notes theo revision.
4. Quyết định NOTED, NEEDS_CORRECTION, SKIPPED, PENDING chỉ lưu công việc; không phải approval.
5. LANGUAGE_REVIEW → HSK_LEVEL_REVIEW → APPROVED cần reviewer thật đã được chủ dự án cấu hình id/stages/credentialHash ở server env. Vòng này chưa có người duyệt, các nút bị khóa. Không tự điền credential hoặc reviewer giả.
6. Import JSON chỉ chứa items[{id,revision,sourceFingerprint,workVersion,notes,decision}]. Không import nguyên content blob làm decision. File từ export mới nhất; gặp 409 thì tải lại/so sánh, không ghi đè.
7. Publication riêng, không nhập PUBLISHED. Nội dung thay revision phải được duyệt lại.

Audio có checklist phát được/transcript/thiếu âm/méo tiếng/phát âm/thanh điệu/tốc độ/khoảng lặng/speaker/part/quyền. Decode/hash không thay người nghe chuyên môn.

Không gọi bất kỳ bản tự tạo nào Official HSK. Blueprint tham khảo paper CTI không cấp phép tái sử dụng đề/hình/audio.
`);

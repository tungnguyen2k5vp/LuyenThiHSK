# V15 · Chất lượng nội dung

Ngày 2026-10-20 (Asia/Bangkok). **V15_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. ProductionReady=false. Dữ liệu và bằng chứng định lượng: [release-gates.json](data/reports/v15/release-gates.json).

## Kho hiện có

| Phạm vi | Số lượng |
| --- | --- |
| Editorial records | 1359 |
| Questions HSK1 / HSK2 | 435 / 246 |
| Draft / Needs Review trong DB | 5 / 1354 |
| Human Reviewed / Published | 0 / 0 |
| Câu trong review queue | 681 |
| Thiếu trường / registry findings trong queue mới | 0 |
| Điểm ngữ pháp HSK2 chưa đủ5 câu | 40 |
| Nháp V15 riêng: lessons / questions | 2 /10 |
| Nháp V15 đã nhập DB / Human Reviewed / Published | 0 /0 /0 |
| Audio review queue / audio mới | 40 /0 |

Review metadata đủ không có nghĩa ngôn ngữ tự nhiên/đáp án duy nhất/cấp HSK đã được duyệt. 199 cờ chất lượng HSK1 từ audit V7/V14 vẫn giữ, không tự đóng. Hai bài nháp HSK2 về 因为 và 还是 có giải thích tiếng Việt, ví dụ/pinyin và5 câu riêng mỗi bài; registry/reference tests PASS, human/level review vẫn bắt buộc. File gốc: data/staging/v15/original-hsk2-drafts.json. Bản duyệt offline: data/review-packages/v15/REVIEW.html, question-review-queue.json, audio-review-queue.json. Các đường dữ liệu riêng bị Vite dev chặn403 và không nằm trong dist/public.

## Đối chiếu nguồn

Đã kiểm lại [CTI HSK1](https://www.chinesetest.cn/HSK/1), [CTI HSK2](https://www.chinesetest.cn/HSK/2), [syllabus](https://www.chinesetest.cn/syllabus) trong vòng này ngày19/10. Trang HSK1 ghi20 Nghe +20 Đọc; trang HSK2 ghi35 Nghe +25 Đọc. Chỉ số syllabus HSK3.0/2025 trong kho có version riêng; không trộn với bảng trang giới thiệu cũ, không tự đổi template HSK2 của dự án sang “official”. Chi tiết phân biệt phiên bản và license tiếp tục theo docs/v14/OFFICIAL_HSK_SOURCE_AUDIT.md và CONTENT_SOURCE_LICENSE_MATRIX.md.

Không tái sử dụng dữ liệu/đề/audio bên ngoài trong V15. Nháp original ghi AI_GENERATED/NEEDS_REVIEW, không thừa kế nhãn Official hoặc Published từ bản ghi tham chiếu. Không gọi audio tổng hợp là audio chính thức; audio queue chưa có provider/voice/duration/license attestation được để null/pending. HSK2 Full Mock còn các gate audio, quyền, phát âm, language/level/source review và scoring manual từ V14.

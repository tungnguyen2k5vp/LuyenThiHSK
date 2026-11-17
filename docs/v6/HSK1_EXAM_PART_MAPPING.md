# HSK1 EXAM PART MAPPING

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Đối chiếu nguồn

[CTI syllabus](https://www.chinesetest.cn/syllabus) · [archive mẫu CTI](https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip) · [thông báo kỳ thi thử nghiệm](https://admin.chinesetest.cn/gonewcontent.do?id=51236758). PDF mẫu giấy H124169Z lưu riêng tại .runtime/references/v5, SHA256 690eb60e10610788fa32066c9fd5627f0896a7229ed0c62c825d2ec5f63c805f. Không chép câu hỏi, ảnh, audio hoặc đáp án CTI vào sản phẩm.

| Part | Kỹ năng | Dạng | Số câu/bộ | Lựa chọn | Pool | Bộ độc lập |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | listening | picture-choice | 5 | 3 | 10 | 2 |
| L2 | listening | dialogue | 5 | 3 | 10 | 2 |
| L3 | listening | matching | 5 | 6 | 10 | 2 |
| L4 | listening | short-passage | 5 | 3 | 10 | 2 |
| R1 | reading | matching | 5 | 6 | 10 | 2 |
| R2 | reading | shared-options | 5 | 6 | 10 | 2 |
| R3 | reading | shared-options | 5 | 6 | 10 | 2 |
| R4 | reading | short-passage | 5 | 3 | 10 | 2 |

Từng part có order/instructions/mediaPolicy/answerPolicy/timePolicy/sourceEvidence/verificationStatus trong shared/hsk1-parts.mjs và template revision. L3/R1/R2/R3: năm câu dùng chung sáu lựa chọn, chọn cả nhóm; snapshot khóa thứ tự và revision của bank.

## Phần chưa xác minh

Dạng câu và số lượng đối chiếu mẫu giấy; không suy ra mọi quy tắc IBT. Mẫu: 12 phút nghe +20 phút đọc +3 phút chuyển đáp án +khoảng5 phút thủ tục. Nền tảng dùng 15 phút section nghe +20 phút đọc; phần dự trữ3 phút gộp trong section nghe, chưa có phase chuyển đáp án riêng. Hai lượt nghe, khóa section và chấm phần trăm đều là PLATFORM_POLICY. structureVerified=false, rulesVerified=false, simulationClass=PLATFORM_PRACTICE. Không gọi Official hoặc Authentic Simulation, không quy đổi điểm HSK.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.

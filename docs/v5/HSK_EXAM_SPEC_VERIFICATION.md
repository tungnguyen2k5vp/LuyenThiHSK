# HSK_EXAM_SPEC_VERIFICATION

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Nguồn và phiên bản

Ưu tiên [CTI syllabus](https://www.chinesetest.cn/syllabus), [mẫu CTI](https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip) và [thông báo thử nghiệm tháng 9/2026](https://admin.chinesetest.cn/gonewcontent.do?id=51236758). Hai PDF mẫu/đáp án được lưu riêng trong .runtime/references/v5; không đưa câu, ảnh hay audio chính thức vào sản phẩm. Tải bằng HTTP Range khoảng 0,5 MB thay vì tải cả archive 395 MB.

PDF HSK1 có mã H124169Z, SHA256 690eb60e10610788fa32066c9fd5627f0896a7229ed0c62c825d2ec5f63c805f. Mục lục ZIP có file MP3 chính thức nhưng vòng này chưa nghe hoặc phiên âm file đó.

| Quy tắc | Giá trị | Trạng thái |
|---|---|---|
| totalQuestions | 40 | VERIFIED_SAMPLE |
| listeningCount | 20 | VERIFIED_SAMPLE |
| readingCount | 20 | VERIFIED_SAMPLE |
| listeningMinutes | 12 | VERIFIED_SAMPLE |
| readingMinutes | 20 | VERIFIED_SAMPLE |
| paperAnswerTransferMinutes | 3 | VERIFIED_SAMPLE |
| personalInformationMinutes | 5 | VERIFIED_SAMPLE |
| totalApproxMinutes | 40 | VERIFIED_SAMPLE |
| listeningParts | [5,5,5,5] | VERIFIED_SAMPLE |
| readingParts | [5,5,5,5] | VERIFIED_SAMPLE |
| trialModes | ["paper","test-center internet"] | VERIFIED_TRIAL_NOTICE |
| trialDate | "2026-09-20" | VERIFIED_TRIAL_NOTICE |
| audioReplayRules | null | UNVERIFIED |
| onlineNavigationRules | null | UNVERIFIED |
| officialScoringAndPassThreshold | null | UNVERIFIED |

Mỗi mục có sourceUrl, sourceVersion, evidenceDescription, verifiedAt và verificationStatus trong [JSON bằng chứng](../../data/reports/v5/exam-spec-verification.json).

## Ứng dụng còn khác mẫu

Bản mẫu có 4 nhóm nghe và 4 nhóm đọc, mỗi nhóm 5 câu; có ảnh, matching và nhóm lựa chọn dùng chung. App vẫn dùng 40 câu, 35 phút tự chọn: 15 phút nghe +20 phút đọc, không gồm hành chính. App chưa có đầy đủ các dạng câu mẫu. Hai lượt nghe từng câu, không tua và khóa section là quy tắc platform; chưa xác minh đó là quy tắc thi internet chính thức.

Vì vậy giữ PLATFORM PRACTICE MOCK / BETA, structureVerified=false, rulesVerified=false. Không quy đổi phần trăm thành điểm hoặc xác suất đỗ HSK. Danh sách 300 từ syllabus2025 không bị ghi đè bằng trang HSK1 cũ nêu 150 từ. Thông báo trial không chứng minh mọi kỳ thi tương lai đều có cùng quy tắc.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.

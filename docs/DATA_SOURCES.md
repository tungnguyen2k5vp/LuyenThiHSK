# Nguồn dữ liệu · cập nhật tiếp nối 22/10/2026

Lần này **không nhập thêm nguồn bên ngoài**: mở rộng 8.680 bài phái sinh từ câu/audio no7z đã được cấp phép. Câu, audio và bài phái sinh no7z giữ **CC BY-SA 4.0**, attribution no7z/Jayoung và CC-CEDICT; audio tổng hợp CosyVoice2, không phải băng thi chính thức. HearMandarin word dataset giữ **CC BY 4.0**, không nhập audio/bài đọc/đề thi của website. Mandarin Zone cũ giữ **CC BY-NC-SA 4.0**, có giới hạn phi thương mại. [Thông báo và ghi công](../public/data/open-hsk/LICENSES.md).

Khảo sát gốc gồm 41 URL: 35 reference_only, 1 official_sample_review (CTI), 4 import_allowed theo phạm vi và 1 restricted_or_unknown. **4 mục có điều kiện sử dụng rõ không đồng nghĩa 4 dataset được nhập**: no7z, HearMandarin words, công cụ REA MIT và AllSet grammar có điều kiện NC/SA (không nhập). Hai dataset mở no7z/HearMandarin thực sự có trong kho; Mandarin Zone là nguồn cũ riêng. Kho 24.542 câu không bao gồm câu/asset QKT hoặc Migii.

## Kiểm tra thêm 13 nền tảng đề thi

[exam-platform-review.json](../data/sources/exam-platform-review.json) lưu timestamp/URL cuối/trích metadata giới thiệu công khai và hạn chế. 13 phản hồi HTTP200; đọc được phần nội dung 12 nguồn, CTI trả header200 nhưng timeout khi đọc body. Không gọi đây là kiểm toán đầy đủ 13 kho đề. Các mô tả dưới đây là **công bố trên trang**, chưa xác minh toàn bộ dữ liệu hay chuẩn chấm:

| Nguồn | Metadata công khai quan sát | Quyết định |
| --- | --- | --- |
| QKT | HSK2.0/3.0, cấp1–6, số câu/thời gian theo card; REA đọc/nghe/kết quả/trọn bài; Viết cần tài khoản | Tham khảo UX, không nhập |
| HSKZen | HSK1–6, audio một lượt, đồng hồ/điểm/đáp án theo giới thiệu | Tham khảo, chưa có quyền phân phối |
| thi-hsk | Luyện thi/lộ trình/từ điển/viết, nghe-nói-đọc-viết theo giới thiệu | Tham khảo, chưa xác minh phiên bản/kho audio |
| HSKClub | Luyện HSK3.0, nghe bốn chế độ, từ/ngữ pháp, Pro | Tham khảo, không lấy nội dung Pro |
| Học Tư Đạt | Menu HSK1–6/HSKK, so sánh2.0–3.0, All rights reserved | Tham khảo, không nhập |
| HiHSK | HSK1–6, menu HSK3.0, chép chính tả/đọc hiểu/luyện thi | Tham khảo, chưa xác minh quyền/audio |
| hsk.training | HSK1–6/3.0, các phần thi, nhận xét viết AI theo giới thiệu | Tham khảo; chưa kiểm chứng cơ chế AI |
| HSKAce | Test/điểm tự động, từ vựng, từ điển/viết, thử miễn phí HSK1 | Tham khảo, chưa có giấy phép dữ liệu |
| CTI | Lần đọc body mới timeout; bằng chứng mẫu/de cương và điều kiện cũ giữ nguyên | official_sample_review/reference_only, không phân phối mẫu chưa có quyền |
| HSKMock | Mô tả nghe/đọc/viết cấp3+, số câu/thời gian theo cấp1–6 | Tham khảo; không tự gắn các mô tả này thành chuẩn3.0 |
| VisionChinese | Trang giới thiệu công bố HSK1–9/YCT | Tham khảo; chưa xác minh từng bộ/audio |
| SuperTest/HSKOnline | Từ vựng, luyện nghe/đọc/viết, học phụ đạo | Tham khảo; không nhập audio/bài độc quyền |
| SishuMandarin | Công bố 20+ mock tests/ngữ pháp cấp1–6 cho công chúng | Công khai truy cập chưa phải quyền tái phân phối; không nhập |

Các nguồn từ vựng/đọc/nghe khác trong yêu cầu vẫn giữ phân loại và bằng chứng ở bảng lịch sử dưới; không có thay đổi quyền mới. Repo HSK3.0-Collection không có LICENSE đủ rõ nên tiếp tục không nhập. Không tái kiểm toán toàn bộ API/đề của 41 website trong bản tiếp nối.

## Chất lượng và khoảng trống

Chép chính tả chấm transcript; sắp xếp chấm đúng câu gốc. Có thể có trật tự khác hợp ngữ pháp chưa được chấp nhận. Giữ nhãn chưa duyệt độc lập; không tạo rubric/chấm viết tự do giả. Chưa có thêm đề thi chính thức đủ điều kiện, chưa có audio nâng cao7–9 mới; không thêm nút Viết/Nghe nếu bộ bài không có dữ liệu tương ứng.

---

## Lịch sử trước bản giao diện gọn

Các số liệu/kiểm thử bên dưới thuộc bản trước; dùng phần đầu tài liệu để xem hiện trạng.

## Cập nhật kho mở ngày 22/10/2026

Đây là trạng thái hiện hành; các mục phía dưới là lịch sử. Đã rà soát **41 URL đầu vào** (HTTP 200 tại thời điểm khảo sát), không phải kiểm toán toàn bộ nội dung/API của 41 website. Với trang chỉ kiểm tra HTML giới thiệu, chưa xác minh phiên bản/kỹ năng/tệp tải/audio được đánh dấu rõ; không suy diễn từ tên HSK thành dữ liệu được cấp phép. Bằng chứng máy đọc: [reference-survey.json](../data/sources/reference-survey.json). Quyền được đánh giá theo từng thành phần.

Nguồn thực sự bổ sung: no7z **CC BY-SA 4.0** (câu, bài tập phái sinh và audio tổng hợp); HearMandarin **CC BY 4.0** (từ và bài ghép nghĩa, không gồm audio website). Attribution và thay đổi: [LICENSES](../public/data/open-hsk/LICENSES.md), [no7z attribution](../public/data/open-hsk/NO7Z_ATTRIBUTION.md), [thông báo chung](../public/THIRD_PARTY_NOTICES.md). CC BY-SA áp dụng phần dữ liệu phái sinh tương ứng, không tự động áp dụng mã ứng dụng. Mandarin Zone cũ vẫn có điều kiện **phi thương mại** CC BY-NC-SA 4.0.

| Nguồn / mô tả quan sát | Phân loại | License / phạm vi | Nhập / lý do |
| --- | --- | --- | --- |
| [hskqkt.com](https://hskqkt.com/) — HSK QKT — Thi thử HSK 3.0 miễn phí, đề mô phỏng chuẩn cấu trúc mới | reference_only | Mọi quyền được bảo lưu; Danh mục HSK 2.0/3.0, luồng đọc/nghe/kết quả công khai; chi tiết đáp án yêu cầu tài khoản. | Không nhập. UI reference via REA only. No questions, recordings, branding or internal database copied. |
| [hskzen.com/vi](https://hskzen.com/vi) — Thi thử HSK online miễn phí 1-6, có đáp án / HSKZen | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.thi-hsk.com](https://www.thi-hsk.com/) — Thi Thử HSK Online Miễn Phí - Lộ Trình Học &amp; Tự Học Tiếng Trung Toàn Diện | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hskclub.com](https://hskclub.com/) — HSK Club - Luyện thi HSK online miễn phí cho người Việt | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hsk.hoctudat.com](https://hsk.hoctudat.com/) — Học &amp; Luyện HSK Online — Học Tư Đạt | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hihsk.com](https://hihsk.com/) — HiHSK.com - Học Tiếng Trung Online Miễn Phí / Luyện Thi HSK 1-6 Dễ Dàng | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hsk.training](https://hsk.training/) — HSK Practice Online — Exam Exercises &amp; Free Level Test · HSK Training | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hskace.com](https://hskace.com/) — Practice HSK Exams Online — HSK Ace | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.chinesetest.cn](https://www.chinesetest.cn/) — 中文考试服务网 | official_sample_review | Chưa xác minh quyền phân phối lại tài liệu mẫu; HSK 1–9; /syllabus có Syllabus, Sample Questions, Competency Profile và demo. | Không nhập. Official links only; distinguish 2021 grading, 2025 syllabus and pilot exam format. No official questions/PDF/audio redistributed. |
| [www.hskmock.com/en/index.html](https://www.hskmock.com/en/index.html) — HSK Mock - FAQs & Blog | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hsk.visionchinese.com](https://hsk.visionchinese.com/) — 免费 HSK 模拟考试在线练习 / HSK 1–9 / YCT 每日题库 / hsk101.com | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.hskonline.com/vi](https://www.hskonline.com/vi/) — Không thể thiếu cho kỳ thi HSK - SuperTest | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [sishumandarin.com/hsk-online-practices-and-mock-tests](https://sishumandarin.com/hsk-online-practices-and-mock-tests) — HSK Online Practices and Mock Tests &mdash; Sishu Mandarin Chinese Language School | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [tiengtrungpanda.vn](https://tiengtrungpanda.vn/) — Học tiếng Trung online miễn phí theo HSK cho người Việt / Tiếng Trung Panda | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.byehsk.org](https://www.byehsk.org/) — Bye HSK / Học giao tiếp tiếng Trung cho người đi làm | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.chinesezerotohero.com](https://www.chinesezerotohero.com/) — Home - Chinese Zero To Hero | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [learnchinese.ai](https://learnchinese.ai/) — LearnChinese.ai - Free HSK Course, Character Course, and Spaced Repetition Practice / LearnChinese.ai | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [haohsk.com](https://haohsk.com/) — Learn Chinese Online: Listening, Reading, Vocab &amp; HSK 1–9 Prep / HaoHSK | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.legchinese.com](https://www.legchinese.com/) — Master HSK Chinese — Free Vocabulary &amp; Flashcards · LegChinese | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.hskzi.online](https://www.hskzi.online/) — HSKZI - Learn Chinese Vocabulary (HSK 1-9) | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hsk.cards/en](https://hsk.cards/en/) — Baozi — learn 10,990 words of HSK 1–9 in 5 minutes a day | reference_only | Giấy phép theo thành phần; không cấp phép toàn website; Baozi HSK 1–9; audio-cmn CC BY-SA; Baozi tự tạo audio HSK 2–9, minh họa/ví dụ riêng. | Không nhập. https://hsk.cards/en/licenses/ checked HTTP 200. CC-CEDICT, Arphic, wordfreq and audio-cmn have upstream licenses; obtain upstream directly if needed. No Baozi content imported. |
| [mandarinchinesesystem.com](https://mandarinchinesesystem.com/) — Learn Mandarin Chinese Online with Free HSK Flashcards – MandarinChineseSystem.com | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.hanzipress.com](https://www.hanzipress.com/) — Chinese Flashcards &amp; Printable Worksheets / HanziPress | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [mandarinflash.com](https://mandarinflash.com/) — MandarinFlash — Free HSK Flashcards, Quizzes & Chinese Dictionary | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [mandarinbean.com](https://mandarinbean.com/) — Mandarin Bean: Learn and Practice Chinese / High Quality Resources | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hskreading.com](https://hskreading.com/) — Chinese Reading and Comprehension - HSKReading.com | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [readmandarin.com](https://readmandarin.com/) — Read Mandarin — Free graded Chinese readings (HSK 1-6) | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [realhsk.com/vi](https://realhsk.com/vi) — Luyện đọc tiếng Trung theo HSK 3.0 / RealHSK | reference_only | CC BY-SA ở footer không xác lập quyền với toàn bộ bài đọc; Đọc HSK 3.0; điều khoản dùng học cá nhân, chống thu thập/phát tán gây hại. | Không nhập. https://realhsk.com/vi/terms HTTP 200; no explicit redistribution grant for stories verified. Reference only. |
| [hsk.fulinlabs.com](https://hsk.fulinlabs.com/) — Free Chinese Text Reader &amp; Vocabulary Practice / HSK Studio | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [mandachinese.com](https://mandachinese.com/) — Learn Chinese by Reading / Manda | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [duchinese.net](https://duchinese.net/) — Du Chinese / Read and Learn Mandarin | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.thechairmansbao.com](https://www.thechairmansbao.com/) — The Chairman's Bao: Chinese Reading with News-Based Lessons | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [chenximandarin.com](https://chenximandarin.com/) — Chenxi Mandarin / Beginner to HSK 5 reading practice | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [hearmandarin.com](https://hearmandarin.com/) — HearMandarin: Learn Mandarin by Ear, Free HSK 3.0 Words, Stories, Tones | reference_only | Không áp dụng giấy phép dataset cho toàn website; Trang học/nghe; quyền nội dung/audio riêng chưa xác minh. | Không nhập. Reference only; word dataset imported separately from /datasets/. |
| [resources.allsetlearning.com/chinese/grammar](https://resources.allsetlearning.com/chinese/grammar/) — Chinese Grammar Wiki | import_allowed | CC BY-NC-SA 3.0; trừ mục có ghi khác; Ngữ pháp HSK/CEFR; chỉ dùng phi thương mại, kể cả không có doanh thu quảng cáo; ghi tên và link trên từng view. | Không nhập. Copyrights page with underscore fetched HTTP 200 after earlier encoded-space URL returned 403. No grammar imported: existing grammar retained, avoid adding NC material unnecessarily. License https://creativecommons.org/licenses/by-nc-sa/3.0/ ; https://resources.allsetlearning.com/chinese/grammar/Chinese_Grammar_Wiki:Copyrights |
| [www.purpleculture.net](https://www.purpleculture.net/) — Purple Culture, Online Chinese Bookstore for Chinese Language Learning, Culture Studying, Statistics & Yearbooks and More | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [www.digmandarin.com](https://www.digmandarin.com/) — Your Guide To The Chinese Learning Jungle / DigMandarin | reference_only | Chưa xác minh giấy phép tái phân phối; Trang giới thiệu HTML; chưa xác minh toàn kho, phiên bản, kỹ năng, định dạng tải hay quyền audio. | Không nhập. Public page checked; no redistribution permission verified for questions/audio. |
| [github.com/morluto/rea](https://github.com/morluto/rea) — GitHub - morluto/rea: Reverse engineer anything with agents, from app behavior down to native binaries. · GitHub | import_allowed | MIT (code); Công cụ REA 6.7.0; không phải dataset HSK. | Không nhập. Installed in ../Rea-HSK-Reference; public browser scenarios used; no target source/database copied. |
| [github.com/no7z/hsk-sentences-audio](https://github.com/no7z/hsk-sentences-audio) — GitHub - no7z/hsk-sentences-audio: HSK-graded Chinese sentence dataset: sentences + pinyin + English + per-word glosses + official grammar-point tags + normal/slow audio. Verified zero out-of-level words and wordlist coverage per level (HSK 3.0, GF0025-2021). · GitHub | import_allowed | CC BY-SA 4.0 (dist); MIT (code); 4354 câu nguồn HSK 1–6 GF0025-2021; JSON + 8708 MP3 tổng hợp normal/slow. | Đã nhập. Pinned 857dfbab91027ebd97df01260e91b817cb6b4854; canonical sentences 4352; derived tasks 8704; attribution retained. |
| [hearmandarin.com/datasets](https://hearmandarin.com/datasets/) — HSK 3.0 Word List Dataset: Free CSV and JSON Download (CC BY 4.0) | import_allowed | CC BY 4.0 (word dataset only); 11147 dòng JSON/CSV; 11000 mục syllabus 2025 +147 mục chỉ HSK2; không audio. | Đã nhập. Version metadata 2026-09-09, generated 2026-09-28; canonical words 11105; excludes site readers, tests and recordings. |
| [github.com/wuerling520/HSK3.0-Collection-2026](https://github.com/wuerling520/HSK3.0-Collection-2026) — GitHub - wuerling520/HSK3.0-Collection-2026: A Compilation of Official and Publicly Available HSK 3.0 Resources for Chinese Learners · GitHub | restricted_or_unknown | Không có LICENSE ở commit đã kiểm tra; 15 tệp PDF/ZIP, gồm tài liệu thi chính thức bên thứ ba. | Không nhập. Commit 814c7f927c2d5b6c76d6af58d0a24145d9e9a5ae; README third-party/removal-on-request is not a reuse grant; not imported. |


Không nhập thêm đề chính thức CTI/Collection vì chưa xác minh quyền phân phối. Không lấy dữ liệu sau đăng nhập/paywall/CAPTCHA. AllSet có giấy phép phi thương mại có điều kiện nhưng chưa cần nhập: giữ 576 mục ngữ pháp có sẵn. REA có license MIT cho công cụ, không cung cấp quyền đối với nội dung website mục tiêu.

---

> CURRENT_STATE: [trạng thái hiện hành](CURRENT_STATE.md). Tài liệu này có các snapshot LEGACY / PRE-V2 bên cạnh bổ sung V2. Những đoạn nói chưa import hoặc chưa có backend chỉ mô tả lịch sử; không dùng làm trạng thái V3.

# Nguồn dữ liệu và xác minh HSK

## Bổ sung 22/10/2026: kho luyện cá nhân và Mandarin Zone

Đã tận dụng 510 câu HSK 1–2 từ SQLite, giữ trạng thái AI chờ duyệt và chỉ dùng luyện cá nhân cục bộ. Thêm 1.033 câu HSK 4 từ 12 bộ cộng đồng Mandarin Zone, repo https://github.com/Make-dream-clear/hsk4-mock-exam commit `44a0832adc327500b4cc1d6f2dfc6ee90bbe4e92`, giấy phép CC BY-NC-SA 4.0 (phi thương mại, ghi nguồn, chia sẻ tương tự). Không nhập bộ mang nhãn chính thức; bỏ 142 câu thiếu nội dung/media/đáp án hợp lệ hoặc chưa hỗ trợ định dạng. Đáp án từ nguồn chưa thẩm định độc lập. Hash và nguồn nằm ở `public/data/mandarin-zone/manifest.json`; xem [phân tích REA và cách áp dụng](REA_MIGII_APPLICATION.md). Các snapshot bên dưới giữ nguyên để đối chiếu lịch sử.

Ngày kiểm tra nguồn: **15/10/2026**. CTI/Chinese Tests Service là source of truth cho syllabus, cấp độ, cấu trúc và tài liệu thi. Link tới tài liệu không đồng nghĩa được quyền tải lại hoặc phát hành lại nội dung.

## CTI

| Nguồn chính thức | Quan sát ngày 15/10/2026 | Cách dùng |
|---|---|---|
| [Syllabus page](https://www.chinesetest.cn/syllabus) và [PDF HSK Exam Syllabus](https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf) | PDF ghi phát hành 11/2025, hiệu lực 07/2026, 406 trang; có task outline, topics, vocabulary, Hanzi và grammar cho HSK 1–9. | Ưu tiên khi xây versioned curriculum. Không đóng gói lại PDF hoặc trích hàng loạt bản ghi nếu chưa có quyền rõ.
| [CTI notice: second HSK 3.0 global pilot](https://admin.chinesetest.cn/gonewcontent.do?id=51236758) | Đợt thi thử thứ hai ngày 20/09/2026; HSK3–6 đăng ký cùng kỳ thi khẩu ngữ tương ứng; thông báo nêu các thời lượng thử nghiệm riêng. | Phân biệt trial với blueprint ổn định. Không thay đổi exam engine theo số liệu pilot mà thiếu blueprint/version.
| [CTI notice: global HSK 3.0 launch](https://old.chinesetest.cn/gonewcontent.do?flag=kdnew&id=51336883) | CTI thông báo triển khai toàn cầu ngày 13/12/2026; ngày này còn ở tương lai tại thời điểm rà soát 15/10/2026. | Ghi trạng thái chuyển tiếp, kiểm tra lại khi CTI phát hành bản cập nhật.
| [CTI HSK 1](https://www.chinesetest.cn/HSK/1), [HSK 2](https://www.chinesetest.cn/HSK/2), [HSK 3](https://www.chinesetest.cn/HSK/3), [HSK 4](https://www.chinesetest.cn/HSK/4), [HSK 7–9](https://www.chinesetest.cn/HSK/7-9) | Các trang hiển thị nhãn HSK 3.0; bảng cấp 1–4 vẫn nêu số câu/thời lượng kiểu cấu trúc trước đó (ví dụ cấp 1: 40 câu/~40 phút, cấp 3: 80/~90 phút, cấp 4: 100/~105 phút). Trang 7–9 nêu 98 câu, 5 kỹ năng, khoảng 210 phút. | Các bảng cấp 1–6 mâu thuẫn với thời lượng thi thử HSK3.0 trong thông báo CTI. Không coi chúng là blueprint HSK3.0 mới; không trộn với dữ liệu HSK2.0.
| [CTI download center](https://admin.chinesetest.cn/godownload.do) | Có tài liệu tham khảo, syllabus/samples/audio và tài liệu theo nhiều đời thi. | Chỉ liên kết và ghi nhận version; kiểm tra riêng điều kiện phân phối từng PDF, câu hỏi, audio.

Syllabus 2025 là nguồn chính thức có phạm vi HSK 1–9, vocabulary/Hanzi/grammar/tasks/topics. Tuy nhiên, quyền tái phát hành từng bảng dữ liệu chưa được xác minh trong dự án. Vì vậy bản build hiện tại **không chứa từ vựng, grammar, Hanzi, đề hoặc audio được trích từ CTI**.

## Nội dung phát hành hiện tại

- **20 câu gốc tự biên soạn**, không sao chép câu hỏi/đáp án/audio CTI hoặc community exam: 5 câu gắn nhóm HSK 2.0, 10 câu HSK 3.0 chưa đối chiếu edition/cấp, 5 câu minh họa nhóm HSK 7–9.
- **0 đề đầy đủ đủ điều kiện phát hành**. Các bài phần ngắn dùng lại 20 câu trên; không tính là ngân hàng/đề độc lập mới.
- **0 record HSK chính thức được nhập**; **0 record dataset cộng đồng được nhập**.
- Người học có thể nhập từ của mình vào localStorage. Dữ liệu đó không phải nội dung phát hành chung, không được đồng bộ lên server, và cấp/edition là khai báo chưa kiểm chứng.
- Audio của câu hiện có dùng TTS trên thiết bị, không phải audio CTI.

## Repository tham khảo

Đã đọc README, stack/architecture và thông tin license cấp repository cho 15 nguồn được giao; kết quả, điểm học và quyết định không nhập data nằm trong [`REFERENCE_REPOSITORIES.md`](./REFERENCE_REPOSITORIES.md). Chưa có repository nào được copy code hoặc data.

## Quy tắc cập nhật

1. Tạo ID edition riêng cho mỗi syllabus/year; không đổi nghĩa của ID đã lưu.
2. Lưu source URL, tên/version, ngày truy xuất, giấy phép, trạng thái quyền, edition, trạng thái đối chiếu CTI và hash file.
3. Chạy dry-run: UTF-8/header/schema, trường thiếu, duplicate, level/version mismatch, checksum và license; sinh report trước khi commit.
4. Tách bản dịch/câu ví dụ/audio/stroke assets khỏi license của mã nguồn.
5. Chỉ admin/reviewer phía server mới duyệt public; giữ dữ liệu unverified ở staging/local.
6. Không public câu hỏi thi chuẩn hoặc audio nếu chưa có quyền tái sử dụng rõ ràng.

## Release V2 hiện hành

Xem HSK_DATA.md và DATA_IMPORT_REPORT.md: 11.000 mục từ syllabus 2025 đối chiếu PDF CTI đúng checksum, 576 tên cấu trúc khớp nguồn, 3.088 Hanzi. Dictionary meaning là cộng đồng CVDICT/CC-CEDICT, không phải official translation. 17 cấu trúc chưa khớp nằm staging. Số liệu không import trong các báo cáo trước chỉ mô tả baseline trước V2.


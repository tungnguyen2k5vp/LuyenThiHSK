## Khảo sát QKT sau đăng nhập và áp dụng — 23/10/2026

Đã dùng REA CLI từ Rea-HSK-Reference, skill reverse-engineer-anything, frontend-developer, minimal-change-engineer, data-engineer và backend-architect. Chỉ quan sát thao tác người học; không lấy câu hỏi, audio, mã nguồn hoặc database của QKT.

### Bằng chứng quan sát

- Login: ev_6b910cdb8df02c17d99223db445671f29611e3cb232ddd43dbc7e023b1ee8c32. Sau đăng nhập xuất hiện thiết lập 4 bước. Không lưu hay thay đổi thiết lập tài khoản tham khảo.
- Của tôi: ev_80697430395aad19824e468e8ff58b024ab4c2017faf92365bb575939e6bfe63. Có điều hướng Của tôi/Đăng xuất, việc học hôm nay, nhịp học, từ/ngữ pháp đã học, kết quả và hồ sơ. Không sao chép thông tin cá nhân vào báo cáo.
- Hành trình cấp 1: ev_bb215c071a51b9d7baaa965fd9ed641a74b6b23e174b0d60ae72aca18cc6a266. Quan sát chọn cấp, bài kế tiếp, tiến độ, các lối vào từ vựng → ngữ pháp → bài khoá → viết. Không mở/nộp bài để tạo tiến độ trên tài khoản tham khảo.
- Tour công khai: ev_9546b7547c4a754eb83aff64bfd8fdd82e7c40bd763d32a70ea1c2f27eaf9094. Lần này form chưa xác nhận đăng nhập trước khi điều hướng, nên các trang từ vựng, luyện đọc, hành trình và đề thi của tour này chỉ là bằng chứng công khai. Không coi tour này là quan sát tài khoản.

Thông tin đăng nhập chỉ truyền qua biến môi trường tạm và secret references của REA; không có trong scenario hoặc source. Các profile Chrome của REA được tạo và dọn bởi REA. Không lưu cookie/token. Bằng chứng có thông tin hồ sơ nằm trong .runtime, không đưa vào public.

### Áp dụng vào HSK Journey

| Hành vi tham khảo | Phần triển khai bằng source hiện có |
| --- | --- |
| Ưu tiên việc học hôm nay | HskHome hiển thị bài đang làm, nhiệm vụ kế hoạch, từ đến hạn, lịch sử; không sinh thống kê mẫu |
| Chọn cấp rồi chọn hoạt động | Nút chọn cấp giữ cấp trong URL; liên kết học/nghe/đọc dẫn đúng cấp |
| Tách luyện từng phần và cả bộ | PracticeHub cho chọn nghe hiểu, đọc hiểu, chép chính tả, sắp xếp câu; PracticeCatalog tiếp tục dùng engine cũ |
| Học một lượng nhỏ | CourseWorkspace có nhóm tối đa 20 từ; tiến độ suy ra từ ID từ hiện có, không tạo bản sao từ |
| Kết quả quay về việc cần ôn | Giữ nguyên ExamRoom → AttemptResult → review/SM2; lịch sử trên trang đầu mở lại đúng attempt |
| Phiên bản HSK rõ ràng | Bộ lọc từ hub giữ phiên bản khi sang catalog; kế hoạch syllabus 2025 dùng HSK 3.0/cấp mục tiêu |

### Dữ liệu và database

Không thể suy ra bảng, khóa, RLS hoặc thuật toán backend riêng của QKT từ giao diện. Các tên màn hình không chứng minh schema nội bộ. Bản này sử dụng schema của HSK Journey, không cần migration hoặc database mới:

- ExamItem / PracticeEntry và manifest: danh mục, cấp, phiên bản, kỹ năng, dạng câu; SQLite content vẫn là nguồn nội dung cá nhân/admin đã có.
- SavedStudySession: snapshot đề, answers, currentIndex, deadline, trạng thái media. Giữ nguyên khóa và cơ chế tự lưu.
- CompletedAttempt: bài đã nộp và snapshot để tái hiện kết quả.
- PreparationData.cards / grammar / hanzi: tiến độ theo ID hiện hữu; lịch ôn vẫn qua SM2.
- PreparationData.events / plans / profile: nhịp học, nhiệm vụ ngày và mục tiêu. Nhóm 20 từ là cách hiển thị, không thêm thực thể hay trường dữ liệu.
- Account BFF và cơ chế owner/cloud đã có được giữ nguyên. Máy hiện chạy guest mode vì chưa có cấu hình Supabase; không dùng tài khoản QKT làm tài khoản cho HSK Journey.

Luồng triển khai: chọn cấp → học nền tảng hoặc chọn dạng luyện → catalog đúng cấp/phiên bản → giới thiệu bài/kiểm tra audio khi cần → tự lưu → nộp → kết quả → ôn lại/lịch sử. Viết/nói vẫn tự đánh giá, không gắn nhãn AI chấm khi chưa có dịch vụ thực.

Bản sao trước thay đổi: .runtime/backups/before-qkt-account-1792749435563. Không thay đổi kho 262 bộ/24.542 câu, audio hoặc danh sách từ. Xem QA_REPORT.md cho kiểm tra thực tế.

---

# REA và giao diện gọn · bản tiếp nối 22/10/2026

Tận dụng REA 6.7.0 đã cài ở `D:/ReactJS/Rea-HSK-Reference`; không sửa cấu hình Codex/MCP hay cài dependency mới. Skill đã áp dụng: Frontend Developer, Data Engineer, Minimal Change Engineer và [REA reverse-engineer-anything](../../Rea-HSK-Reference/.agents/skills/reverse-engineer-anything/SKILL.md).

## Quan sát mới có bằng chứng

| Trang / thao tác REA thực hiện | Kết quả quan sát | Evidence |
| --- | --- | --- |
| [QKT /exams](https://hskqkt.com/exams), chờ hydrate | 80 bộ 3.0, 50 bộ 2.0 theo UI công bố; tab phiên bản/cấp; mỗi card có mã, số câu, thời gian và nút kỹ năng/trọn bài. Đây là số website công bố, chưa xác minh từng bộ theo CTI. | `qkt-next-catalog-evidence.json`, `ev_e2a68b66fbfec993738fc2cfa8927824956e84f889cf78c771648b7c5c42d378` |
| [Trọn bài công khai](https://hskqkt.com/exam/b4cbf54b-0586-40dc-9230-f5f11b8a70e5) | H1M301, 40 câu; Nghe20/12phút, Đọc20/20phút; đồng hồ phần/tổng, phần Đọc có nhãn khóa khi đang Nghe; nút trước/sau/nộp, bật âm thanh do autoplay. Chỉ quan sát trạng thái đầu, không tuyên bố đã hoàn tất cả đề. | `qkt-next-full-evidence.json`, `ev_2a0319f6fb82023b442f1cb17a1d493988cb44c883da9e543e0e16d4c1a75076` |
| Chọn HSK2 rồi nhấn Viết trên card | Màn hình “Luyện phần Viết — AI chấm từng bài”, cần tài khoản; có đường sang Đọc không cần tài khoản. Dừng ở ranh giới đăng nhập, không thử AI chấm. | `qkt-writing-evidence.json`, `ev_629c9d248170f5939ac2f377a2c49ef2f623d0e44f22c54d7904c9fd9a1b4b55` |

Bằng chứng JSON và PNG tại `.runtime`. Các kết luận đọc/nghe/kết quả trước đây giữ ở phần lịch sử bên dưới. Không suy đoán schema database QKT/Migii, không lấy tài khoản/token, câu hỏi hay asset của QKT để phân phối.

## Áp dụng thực tế

Giữ sidebar, header thương hiệu và ExamRoom/AttemptResult/scoring/storage/SM2 đang chạy. Thay hero/4 ô thống kê cao bằng tiêu đề ngắn và số thật inline; version pills, level pills; search+kỹ năng+độ dài trong thanh gọn, lọc phụ/sort trong native details. Điện thoại dùng hàng cấp trượt ngang. Danh sách 12 card/trang, metadata/source dài chuyển vào disclosure; có skeleton, thông báo tải/lỗi, trạng thái trống và reset.

Card hiển thị mã, level/edition, loại bài, tổng câu/thời gian tùy chỉnh, trạng thái học; nút kỹ năng chỉ hiện khi có câu phù hợp, nút Luyện cả bộ mở đúng toàn bộ bank, nút có giờ mở độ dài đang chọn, resume mở snapshot cũ. Có tìm mã, lọc Đang làm/Đã làm/Chưa làm và sắp xếp tên/cấp/gần đây; skill+dạng dùng giao của facets. Nhãn edition chưa xác minh không bị biến thành chuẩn 2015/2025.

Mở rộng preflight sẵn có để hiện hướng dẫn trước mọi lượt từ catalog: phiên bản/cấp/kỹ năng/số câu/thời gian, hủy/bắt đầu, focus trap và Escape. Bài nghe có giờ vẫn phải phát thử và xác nhận; deadline chỉ tạo khi bắt đầu. Giữ chế độ không giờ. Bổ sung chép chính tả và khôi phục câu qua ô nhập hiện hữu, không nhân đôi engine.

Đã xem ảnh desktop1440×1000 và mobile390×844. Desktop card đầu bắt đầu khoảng y474 thay vì khoảng y835 ở ảnh trước; mobile khoảng y554 sau khi thu gọn và đưa cấp vào hàng cuộn. Đây là quan sát ảnh, không phải phép đo DOM. [Ảnh desktop](../.runtime/compact-desktop-evidence.json.png), [ảnh mobile](../.runtime/compact-mobile-evidence.json.png), [QA hiện hành](QA_REPORT.md).

Kiến trúc vẫn là: source lock/raw → chuẩn hóa/khử trùng/provenance/audio SHA → JSON bank/manifest → catalog → preflight → ExamRoom → snapshot/attempt/review. SQLite editorial chỉ đọc, không migration.

Chạy lại REA từ thư mục công cụ:

```powershell
node scripts/rea.mjs capture-browser-scenario D:/ReactJS/LuyenThiHSK/.runtime/compact-dictation-scenario.json --format json
node scripts/rea.mjs capture-browser-scenario D:/ReactJS/LuyenThiHSK/.runtime/qkt-writing-scenario.json --format json
```

Các scenario dùng Chrome profile tạm do REA sở hữu và đã kết thúc process; không dùng profile cá nhân. Service Worker bị công cụ chặn trong scenario, vì vậy các ca đó không chứng minh chế độ offline/PWA của bản mới.

---

## Lịch sử trước bản giao diện gọn

Các số liệu/kiểm thử bên dưới thuộc bản trước; dùng phần đầu tài liệu để xem hiện trạng.

# Phân tích REA và áp dụng vào HSK Journey · 22/10/2026

REA được cài riêng ở `D:/ReactJS/Rea-HSK-Reference`, phiên bản 6.7.0, commit `d77bc0e8a`, license MIT; Node 24.11.1/npm11.6.2. Đã dùng skill reverse-engineer-anything và CLI thực tế, không giả định MCP có mặt trong phiên. Hướng dẫn: [REA README](https://github.com/morluto/rea), [skill đã dùng](../../Rea-HSK-Reference/.agents/skills/reverse-engineer-anything/SKILL.md). Không cần thêm dependency production hoặc đổi stack.

## Bằng chứng quan sát công khai trên HSK QKT

Các scenario mở Chrome do công cụ sở hữu, không dùng profile/cookie người dùng. Output JSON đầy đủ và PNG nằm trong `.runtime`; phải đọc trạng thái từng bước, exit0 của CLI chưa đủ chứng minh cả scenario qua. Các ID dưới đây là evidence thực tế, không phải ID giả lập.

| Quan sát | Evidence / artifact | Áp dụng |
| --- | --- | --- |
| `/exams`: phiên bản 3.0/2.0/tất cả, cấp1–6, card có số câu/thời gian/kỹ năng, trạng thái free/pro | `ev_1ba9437a9303345e27e994a47b66cea3f73675c9f267d6ad634e1a199acf1514`, `qkt-survey-evidence.json` | Tab cấp; edition2021/2025 tách riêng; metadata card; nhãn loại bài/nguồn. Không sao chép cơ chế pro. |
| Phòng Đọc khách: 20 câu/20phút, câu được chọn bằng radio, navigator/đã trả lời, trước/sau, xác nhận nộp | `ev_eaae9839feaf64854a986c57ab97b174191a994e8b9c1416636aaceef3521213`, `qkt-flow-ready-evidence.json` | Tận dụng ExamRoom/QuestionView hiện hữu; giữ session snapshot, answer map, điều hướng và submit dialog. |
| Nộp 1 đáp án, nhận tổng đúng/sai/bỏ trống, điểm/thời gian, làm lại/chuyển kỹ năng/danh mục | `ev_7f1adbdb7e8e5d3b187aa3e21761bf1edf8696cc79ba4f9907349f9f0075ff96`, `qkt-result-final-evidence.json` | Giữ Result hiện hữu, kết quả theo kỹ năng, câu sai/bỏ trống và ôn tập. Bài bổ trợ tính tỷ lệ đúng, không quy đổi thành điểm HSK. |
| Chi tiết đáp án yêu cầu đăng nhập; trang cho biết luyện riêng phần không lưu vào lịch sử điểm tổng | Cùng evidence kết quả | Dừng ở ranh giới tài khoản. Journey giữ lịch sử cục bộ của mình, không suy luận hệ thống lưu trữ QKT. |
| URL phần Nghe công khai hiển thị 20 câu/12phút, hướng dẫn lượt nghe, dialog yêu cầu chạm để bắt đầu do autoplay; sau nhấn dialog biến mất và timer tiếp tục | `ev_9d581af3fc5ebc4d2fb9bc332768623b82797e45d8a0440bcf57eee996b1ddcb`, `qkt-audio-direct-evidence.json`; `ev_92fb6d3e2f48a07ca97f6ee9d3b95601ff963709b1422e7a8e5b8c1919b77d20`, `qkt-audio-play-evidence.json` | Journey yêu cầu hành động phát, có trạng thái tải/phát/lỗi, giới hạn lượt theo rules. Chỉ cho chọn file chậm ở chế độ luyện có cho đổi tốc độ. |

Quan sát audio QKT xác nhận UI/preflight và hành động bắt đầu, **không chứng minh nghe trọn băng, chất lượng âm thanh hay chính sách phát lại toàn hệ thống**. Scenario bấm Nghe quá sớm trước đó không chuyển trang được; không dùng ca đó làm bằng chứng player. Luồng đọc/kết quả trên là mẫu công khai, không kiểm chứng độ chuẩn CTI của mọi đề trên QKT.

## Kiến trúc của Journey và phần suy luận

Đã đọc code hiện hữu: React19/TS7/Vite8; API Node ở8787; SQLite `.runtime/hsk-content.sqlite` cho editorial/content/media; dữ liệu học nằm trong `hsk-study-data-v1`, `hsk-preparation-v1`, phiên private tách riêng. Tận dụng scoring, import validation, storage, SM2, curriculum, editor và admin. Không chạy migration hoặc ghi đè các bảng.

Ánh xạ sản phẩm được thiết kế từ các luồng quan sát, **không phải schema database QKT/Migii**:

    Source lock + raw có license
      → chuẩn hóa sentence/word + aliases/provenance + audio SHA
      → bank JSON + manifest/facets/search metadata
      → PracticeCatalog → ExamRoom → session snapshot/answers
      → scoring → attempts/review → lịch ôn hiện hữu

Manifest phục vụ bài bổ trợ dạng static JSON để tránh nhập hàng loạt nội dung chưa duyệt vào bảng editorial. API learner chỉ đọc các bản nháp cũ đã có. ID từ cũ giữ nguyên; HearMandarin được nối bằng chữ/cách đọc, chỉ bổ sung metadata nghĩa Anh/POS/edition, không đổi lịch SM2. File audio được phục vụ cục bộ theo SHA; nguồn/giấy phép và normal/slow có đường truy vết.

REA không cung cấp database của website mục tiêu. Các log runtime/tên trường trả về công khai chỉ mô tả dữ liệu thấy trong phiên, không đủ để kết luận về quan hệ bảng, quyền truy cập, dữ liệu tài khoản hoặc kiến trúc nội bộ. Không truy cập endpoint riêng, không lấy token hay vượt đăng nhập/CAPTCHA/paywall. Không sao chép code, logo, ảnh, câu hỏi hay bản ghi âm QKT vào sản phẩm.

## Thay đổi giao diện và kiểm chứng

Giữ tên, màu xanh và sidebar Journey; bổ sung hero/số liệu từ manifest, tab cấp, tìm tên/nguồn/Hanzi/pinyin/nội dung, lọc đồng thời edition/loại/kỹ năng/dạng/trạng thái/độ dài/thời lượng, reset/empty state và phân trang12card. Card ghi rõ bài cộng đồng/bổ trợ, nguồn, file nghe/bản chậm và đáp án. HSK7–9 không được tự suy ra cấu trúc mock từ bài cấp thấp.

Đã kiểm tra bằng REA luồng lọc/phân trang, nghe normal/chậm/tua/tạm dừng, lưu/reload/tiếp tục, giới hạn lượt, file lỗi và nộp bài7–9. Bằng chứng, kích thước màn hình và giới hạn kiểm tra tại [QA_REPORT](QA_REPORT.md). Lịch sử phân tích Migii và các tính năng đã tái sử dụng ở [REA_MIGII_APPLICATION](REA_MIGII_APPLICATION.md).

Chạy lại scenario công khai, từ thư mục REA:

    node scripts/rea.mjs capture-browser-scenario D:/ReactJS/LuyenThiHSK/.runtime/qkt-audio-play-scenario.json --format json

Website bên ngoài có thể thay đổi; giữ evidence đã ghi thay vì suy diễn rằng lần chạy tương lai sẽ giống hệt.

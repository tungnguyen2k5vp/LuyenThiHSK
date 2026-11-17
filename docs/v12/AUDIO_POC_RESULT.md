# V12 · Audio PoC và thao tác thu âm

**0 output giọng HSK 2 được tạo; không tuyên bố PoC speech thành công.** Generation time, inference memory, tone alignment và naturalness: NOT_MEASURED. Chưa có runtime/đồng ý tải model hoặc hợp đồng/key paid provider phù hợp; microphone cần người thu thật chủ động thao tác.

Chrome/Edge đã kiểm luồng kỹ thuật bằng thiết bị giả trong profile QA: thu → chuyển PCM16 WAV mono 24 kHz → giải mã/phát → dừng tracks → lưu IndexedDB → mở lại → nghe lại → khai báo phạm vi → chọn file upload. Kiểm từ chối permission và unmount khi đang thu. Không dùng microphone thật, không upload fixture vào main bank, không tính fixture là transcript PoC. Edge từng timeout khi chờ metadata và promise play. Kiểm tra cuối bấm nút nghe native trong viewport, xác nhận currentTime tiến lên với output headless tắt tiếng; không phải kiểm nghe hoặc phát âm bởi người thật. Nguyên nhân nền của timeout promise chưa được xác minh; giữ các lượt lỗi ở failures.

| Browser | Capture kỹ thuật | Duration fixture (giây) | Main upload |
| --- | --- | --- | --- |
| Chrome | PASS | 1.8 | false |
| Edge | PASS | 1.8 | false |

## Năm transcript PoC tiếp tục dùng

| Question ID | Revision hiện hành | Transcript |
| --- | --- | --- |
| v10-hsk2-L1-001 | 2 | 明天上午的飞机太早了，我今天晚上就去机场旁边住。问：我明天坐什么？ |
| v10-hsk2-L2-001 | 3 | 家人还没有回来，他正在做饭，等大家回来就能吃了。 |
| v10-hsk2-L3-001 | 2 | 女：我去买菜，晚上在家做饭吧。男：好，我来洗菜。问：他们晚上在哪里吃饭？ |
| v10-hsk2-L3-002 | 2 | 男：你不是说十点来吗？女：对不起，我的手表慢了十分钟。问：女的为什么来晚了？ |
| v10-hsk2-L3-003 | 2 | 女：这件衣服是给你的吗？男：不是，是给我妹妹的，她明天过生日。问：衣服是给谁的？ |

## Thu âm thật khi người thu sẵn sàng

1. Mở `http://127.0.0.1:4173/?view=content-review`, nhập mã local dòng cuối `.runtime/admin-access.txt`, mở hàng đợi.
2. Mở Audio Workbench, chọn transcript. Xác nhận đúng câu/revision; nhập tên hoặc mã người thu.
3. Bấm **Bắt đầu thu âm**, tự cấp quyền microphone; đọc nguyên văn. Bấm Dừng, nghe lại, thu lại nếu sai. Chỉ nhận 1–90 giây.
4. Có thể lưu nháp trên thiết bị. Bản nháp gắn transcript/revision; revision đổi thì phải thu lại. Không lưu credential trong draft.
5. Chỉ tick phạm vi thực sự được người thu cho phép. Chọn **Dùng bản thu cho bước upload**, bổ sung đường dẫn bằng chứng rồi upload. Tải file WAV ngoài vẫn được hỗ trợ.
6. Server kiểm dung lượng/header/chunk/hash/duration/RMS/clipping/im lặng; tạo asset và revision câu mới bằng CAS. Không ghi đè asset/attempt cũ. RMS không phải LUFS, khai báo transcript không phải ASR.
7. Người được ủy quyền xác nhận quyền và nghe duyệt phát âm riêng; giữ pending khi chưa có. Không tự publish từ khai báo của người thu.

## Nếu chọn provider sau này

Dùng môi trường Python riêng, kiểm wheel/dependency/model tổng dung lượng trước khi cài. Qwen upstream khuyến nghị Python 3.12; hiện máy là 3.14, chưa chứng minh tương thích hay GPU 4 GiB đủ. Không chạy lệnh tải/cài chỉ để mở website. Adapter chỉ nhận loopback `/synthesize` và trả PCM16 WAV; [env mẫu](../../server/cloud/.env.audio.example), [contract/runbook](../v10/BACKEND_CLOUD_RUNBOOK.md). Azure yêu cầu cấu hình server và paidConsent cho từng request.

Sau khi được cấp đầu vào: tạo 3–5 output từ các transcript trên; ghi thời gian/RAM/VRAM/file size/duration/technical playback; gửi phát âm và quyền vào queue. Giữ sample ở PREVIEW, không tự mở Full Mock.

[audio-decision](../../data/reports/v12/audio-decision.json) · [audio-production-priority](../../data/reports/v12/audio-production-priority.json)

Bản thu mới và bản nháp mở lại đều bỏ chọn các phạm vi cũ, yêu cầu khai báo lại cho bản thu hiện tại. E2E kiểm việc không kế thừa lựa chọn dùng riêng/thương mại/phân phối.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.

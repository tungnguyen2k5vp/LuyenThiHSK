# HSK UI V13 — SCREEN MAP & USER FLOWS
*Gemini Flash — UI/UX Design Agent V13*

## 1. Sơ Đồ Điều Hướng Tổng Thể

```
+-----------------------------------------------------------------------------------+
|                                  HSK APP SHELL                                    |
|   (Desktop: Top Navigation | Mobile: Fixed 5-Tab Bottom Bar: Hôm nay, Luyện, ...) |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                                                   |
        v                                                                   v
+-----------------------+                                           +-----------------------+
|  TODAY / DASHBOARD    |                                           |     HSK LEVEL HUB     |
| (TodayWorkspaceView)  |                                           |     (LevelHubView)    |
+-----------+-----------+                                           +-----------+-----------+
            |                                                                   |
            |-- [Tiếp tục học hôm nay] ----> Đi thẳng vào task ưu tiên          |-- [Chọn cấp độ HSK 1] -> Mở kho HSK 1
            |                                                                   |-- [Chọn cấp độ HSK 2] -> Mở kho HSK 2 (ghi chú audio)
            |-- [Task: Ôn từ vựng] --------> Mở Sổ từ vựng cá nhân              |-- [Chọn HSK 3 - 6]   -> Mở theo cấp
            |-- [Task: Học ngữ pháp] ------> Mở Bài học ngữ pháp                +-- [Chọn HSK 7 - 9]   -> Nhóm Nâng cao hợp nhất
            |-- [Task: Luyện đọc/nghe] ----> Mở Practice Hub
            |-- [Đổi mục tiêu] ------------> Mở Cài đặt mục tiêu (Settings)
            |-- [Xem cơ sở đánh giá] ------> Mở Phân tích Tiến độ (Progress)
            +-- [Mở bài ôn điểm yếu] ------> Mở Bài tập điểm yếu (Weakness)
```

---

## 2. Kiến Trúc Màn Hình Today / Dashboard (TodayWorkspaceView)

Màn hình được thiết kế đạt tiêu chuẩn **"5-Second Rule"**:

### Phân vùng 1: Header & Status Strip
- **Eyebrow**: Ngày học hiện tại (`Thứ Hai, 19/10/2026`).
- **Status Chip**: Nhãn minh bạch "Bản xem trước (Preview)" hoặc "0 Published" theo đúng hiện trạng V12.
- **Tiêu đề**: "Tổng quan hôm nay".

### Phân vùng 2: Today Hero (Trọng tâm trải nghiệm)
- **HSK Target Card**: Hiển thị cấp độ mục tiêu to rõ (ví dụ: `HSK 2`).
- **Thời gian đếm ngược**: Số ngày còn lại đến kỳ thi (hoặc "Chưa đặt ngày thi").
- **Nhiệm vụ trọng tâm**: Tên nhiệm vụ tiếp theo + thời lượng ước tính.
- **CTA Chính**: Nút "Tiếp tục học hôm nay" (hoặc "Bắt đầu học hôm nay") với màu Teal 600 nổi bật nhất trên màn hình.
- **Hộp Mức độ sẵn sàng (Readiness Box)**: Tỷ lệ sẵn sàng kèm nhận xét rõ ràng, nếu chưa đủ lượt thi thử đã thẩm định sẽ hiển thị trung thực "Chưa đủ dữ liệu".

### Phân vùng 3: Hàng Chỉ Số KPI Nhanh
- 4 thẻ thống kê trực quan:
  1. **Chuỗi học (Streak)**: Làm nổi bật bằng nền ánh vàng ấm (`#fffbeb`).
  2. **Độ chính xác**: Tỷ lệ % câu trả lời khách quan đúng.
  3. **Từ vựng tích lũy**: Số từ đã học trên tổng từ vựng mục tiêu.
  4. **Thời gian đã học**: Số phút/giờ ghi nhận trong lịch sử.

### Phân vùng 4: Danh Sách Nhiệm Vụ Trong Ngày
- Tối đa 3 - 5 nhiệm vụ vừa sức (tổng 25 - 45 phút).
- Thẻ nhiệm vụ thể hiện rõ:
  - Trạng thái: Đã hoàn thành (`✓`), Chưa làm (`○`), Đã bỏ qua (`—`).
  - Phân loại kỹ năng: Từ vựng, Ngữ pháp, Đọc hiểu, Nghe hiểu, Viết.
  - Lý do đề xuất: "Theo chu kỳ lặp lại ngắt quãng (SRS)", "Bài trọng tâm cấp độ".
  - Trường hợp nhiệm vụ chưa khả dụng (bài nghe HSK 2 đang hoàn thiện âm thanh): Thẻ hiển thị cảnh báo, nút bấm chuyển thành "Tạm khóa", ngăn chặn tình trạng người học bấm vào nhưng không có âm thanh phát sinh lỗi.

### Phân vùng 5: Khu Vực Phân Tích Dưới (Lower Grid)
- **Điểm yếu cần củng cố**: Danh sách 3 chuyên đề hay sai nhiều nhất kèm số lần sai và tỷ lệ nắm vững.
- **Độ phủ từ vựng mục tiêu**: Thanh tiến độ ProgressBar hiển thị tiến độ từ vựng đến cấp độ đang học.

---

## 3. Kiến Trúc Màn Hình Level Hub (LevelHubView)

- **Bộ chọn phiên bản**: Công tắc chuyển đổi linh hoạt HSK 2.0 (Khung 6 cấp) và HSK 3.0 (Tam đẳng Cửu cấp).
- **Phân nhóm khoa học**:
  - Sơ cấp (HSK 1, HSK 2)
  - Trung cấp (HSK 3, HSK 4)
  - Nâng cao (HSK 5, HSK 6 hoặc HSK 7-9 hợp nhất).
- **Thẻ cấp độ toàn diện**:
  - Thể hiện số từ vựng, số bài ngữ pháp, thời gian thi mô phỏng.
  - Tích hợp `AudioStatusIndicator`:
    - HSK 1: Audio khả dụng.
    - HSK 2: "Đang hoàn thiện âm thanh (0/40 khả dụng)" - không bật trạng thái Full Mock Ready.
    - HSK 3 trở lên: Trạng thái bản nháp/nghiên cứu.

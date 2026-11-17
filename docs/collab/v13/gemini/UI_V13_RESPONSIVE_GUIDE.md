# HSK UI V13 — RESPONSIVE & ERGONOMIC GUIDE
*Gemini Flash — UI/UX Design Agent V13*

## 1. Hệ Thống Breakpoints Chuẩn

Hệ thống UI V13 được kiểm thử và bảo đảm hiển thị mượt mà trên 8 kích thước màn hình theo yêu cầu:

| Breakpoint | Thiết bị tiêu biểu | Hành vi bố cục |
| --- | --- | --- |
| **320px** | iPhone SE (cũ), thiết bị màn nhỏ | 1 cột duy nhất, padding 12px, font tiêu đề tự co dãn |
| **375px** | iPhone mini, Android màn hình hẹp | 1 cột, nút hành động xếp dọc nếu dài |
| **390px** | iPhone 12/13/14/15/16 tiêu chuẩn | Điểm cân bằng chuẩn cho trải nghiệm Mobile |
| **430px** | iPhone Pro Max, Android màn lớn | Khoảng trống thoáng hơn, task card dàn đều |
| **768px** | iPad Mini, Tablet dọc | Grid 2 cột cho các thẻ KPI và khối phân tích |
| **1024px** | iPad Pro, Laptop nhỏ | Bắt đầu chia cột Hero 1.4 : 1, Grid 3 cột cho Level Hub |
| **1280px** | Màn hình Desktop phổ thông | Bố cục hoàn chỉnh đạt độ rộng tối ưu |
| **1440px** | Desktop tiêu chuẩn | Container cố định `max-width: 1200px` căn giữa |

---

## 2. Quy Tắc Công Thái Học & Thao Tác Di Động (Mobile Ergonomics)

### 2.1. Thao Tác Một Tay (One-Hand Thumb Zone)
- Các nút hành động chính (Primary CTAs) trong danh sách nhiệm vụ và Hero luôn nằm ở nửa dưới hoặc vùng ngón cái dễ chạm tới.
- Giữ nguyên cấu trúc thanh điều hướng cố định 5 mục ở đáy màn hình (Mobile Bottom Navigation): *Hôm nay, Luyện, Thi thử, Ôn tập, Tôi*.
- Tuyệt đối không bổ sung thêm menu burger phụ gây rối điều hướng trên di động.

### 2.2. Vùng Chạm Tối Thiểu (Minimum Touch Targets)
- Mọi nút bấm, icon button và ô chọn đều có kích thước tối thiểu `44px × 44px` (đạt tiêu chuẩn WCAG 2.1 Success Criterion 2.5.5).
- Khoảng cách giữa các nút bấm cạnh nhau tối thiểu `8px` để tránh bấm nhầm.

### 2.3. Không Tràn Ngang (Zero Horizontal Overflow)
- Toàn bộ container sử dụng `box-sizing: border-box`, `max-width: 100%`, và `overflow-x: hidden` ở cấp độ layout.
- Văn bản chữ Hán dài hoặc ví dụ câu sử dụng `word-break: break-word` và `white-space: normal`, không làm vỡ khung trên màn 320px.
- Các thanh tiến độ và thanh cuộn chỉ xuất hiện bên trong các vùng cuộn chủ động (ví dụ: bảng tra từ hoặc đoạn văn dài).

### 2.4. Tránh Che Khuất Khi Mở Bàn Phím
- Các ô nhập liệu (Textarea, Input) có padding dưới rộng rãi, không gắn chặt với mép đáy màn hình, đảm bảo khi bàn phím ảo (virtual keyboard) mở lên không che mất nút hoàn thành hoặc nút gửi.

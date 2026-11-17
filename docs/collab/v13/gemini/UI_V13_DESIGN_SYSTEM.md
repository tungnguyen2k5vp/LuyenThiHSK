# HSK UI V13 — DESIGN SYSTEM SPECIFICATION
*Gemini Flash — UI/UX Design Agent V13*

## 1. Triết lý Thiết kế (Design Philosophy)

Hệ thống thiết kế UI V13 được xây dựng theo định hướng **Modern Educational Platform & Warm Minimalism**:
- **Trực quan & Hiện đại**: Nền sáng tự nhiên (`#f8fafc`), khoảng trắng thoáng đãng, phân cấp thị giác mạch lạc.
- **Tập trung cao độ**: Giảm thiểu các yếu tố gây xao nhãng; loại bỏ dark mode mặc định, neon, cyberpunk, gradient nặng và animation vô tận.
- **Thân thiện với người học Việt Nam**: Tối ưu hóa hiển thị đồng thời cả tiếng Việt có dấu, chữ Hán giản thể (Simplified Chinese) kích thước lớn rõ nét và Pinyin kèm dấu thanh điệu.
- **Trung thực về dữ liệu (Truthful Status)**: Không ngụy tạo số liệu đã duyệt hay full mock thi thử khi dữ liệu thực tế đang ở trạng thái Preview hoặc thiếu Audio (đặc thù HSK 2 hiện tại 0/40 audio).
- **Phạm vi cô lập (Scoped CSS)**: Toàn bộ style được giới hạn trong root class `.hsk-ui-v13`, tuyệt đối không gây xung đột (zero regression) với CSS legacy của hệ thống.

---

## 2. Hệ Thống Màu Sắc (Color Palette)

### 2.1. Brand Teal (Chủ đạo)
Giữ vững nhận diện Teal đặc trưng của nền tảng nhưng tinh chỉnh độ bão hòa và độ tương phản đạt chuẩn WCAG AA:
- `--v13-teal-50: #f0fdfa`: Nền phụ trợ, thẻ active nhẹ.
- `--v13-teal-100: #ccfbf1`: Badge, chip nền sáng.
- `--v13-teal-600: #0d9488`: Màu tương tác chính (Primary Button, active indicator).
- `--v13-teal-700: #0f766e`: Trạng thái hover, text tiêu đề thương hiệu.
- `--v13-teal-800: #115e59`: Tiêu đề cấp độ, văn bản tương phản cao.
- `--v13-teal-950: #042f2e`: Border nhấn.

### 2.2. Warm Slate & Neutral (Trung tính & Nền)
- `--v13-neutral-0: #ffffff`: Nền thẻ (Surface).
- `--v13-neutral-50: #f8fafc`: Nền tổng thể trang (Canvas).
- `--v13-neutral-100: #f1f5f9`: Nền xám nhạt, thẻ thứ cấp.
- `--v13-neutral-200: #e2e8f0`: Đường viền mặc định (Borders).
- `--v13-neutral-600: #475569`: Màu chữ phụ (Secondary text).
- `--v13-neutral-900: #0f172a`: Màu chữ chính (Primary text, contrast 13:1).

### 2.3. Intent & Status Accents
- **Amber / Orange** (Streak, chú ý, nhiệm vụ): `--v13-amber-100: #fef3c7`, `--v13-amber-600: #d97706`, `--v13-amber-700: #b45309`.
- **Emerald** (Đã hoàn thành, đã đối chiếu): `--v13-emerald-100: #d1fae5`, `--v13-emerald-600: #059669`.
- **Rose** (Điểm yếu, lỗi sai): `--v13-rose-100: #ffe4e6`, `--v13-rose-600: #e11d48`.

---

## 3. Hệ Thống Typography

Hỗ trợ 3 tầng ngôn ngữ liền mạch:
1. **Giao diện & Tiếng Việt**: Phông chữ `Plus Jakarta Sans`, hỗ trợ toàn diện dấu thanh tiếng Việt.
2. **Chữ Hán (Hanzi)**: Phông CJK ưu tiên `Noto Sans SC`, `PingFang SC`, `Microsoft YaHei`. Kích thước hiển thị chữ Hán tối thiểu `1.25rem` (20px), cỡ chuẩn học tập `1.75rem` - `2.25rem`.
3. **Pinyin**: Phông sans-serif chuẩn dấu thanh, in nghiêng nhẹ phân cấp rõ rệt dưới chữ Hán.

| Token | Giá trị | Ứng dụng |
| --- | --- | --- |
| `--v13-text-xs` | `0.75rem` (12px) | Badge, chip trạng thái, caption nhỏ |
| `--v13-text-sm` | `0.875rem` (14px) | Text phụ trợ, nút bấm cỡ nhỏ, ghi chú |
| `--v13-text-base` | `1rem` (16px) | Nội dung bài học, text body chính |
| `--v13-text-lg` | `1.125rem` (18px) | Tiêu đề thẻ con, điểm nhấn |
| `--v13-text-xl` | `1.25rem` (20px) | Tiêu đề mục, tiêu đề nhiệm vụ |
| `--v13-text-2xl` | `1.5rem` (24px) | Tiêu đề trang, chỉ số KPI |
| `--v13-text-3xl` | `1.875rem` (30px) | Tiêu đề Hero |
| `--v13-hanzi-sm` | `1.25rem` (20px) | Chữ Hán trong danh sách bảng |
| `--v13-hanzi-md` | `1.75rem` (28px) | Chữ Hán trong thẻ học từ |
| `--v13-hanzi-lg` | `2.25rem` (36px) | Chữ Hán tiêu điểm câu hỏi |

---

## 4. Spacing, Bo Góc & Shadow

- **Thang khoảng cách (8pt grid)**: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`.
- **Bo góc (Border Radius)**:
  - Nút bấm, input: `var(--v13-radius-md) = 10px`
  - Thẻ nội dung (Card): `var(--v13-radius-lg) = 14px`
  - Hero banner: `var(--v13-radius-xl) = 20px`
  - Pill, Badge: `var(--v13-radius-full) = 9999px`
- **Đổ bóng (Elevation)**: Bóng mờ mềm đa tầng, không dùng viền đổ bóng đen gắt:
  - Thẻ thông thường: `var(--v13-shadow-sm) = 0 1px 3px rgba(15, 23, 42, 0.06)`
  - Thẻ hover: `var(--v13-shadow-md) = 0 4px 10px -2px rgba(15, 23, 42, 0.08)`

---

## 5. Khả Năng Tiếp Cận (Accessibility & Ergonomics)

- **Touch Target tối thiểu**: Mọi nút bấm và tương tác đều đạt `min-height: 44px` (hoặc `36px` cho chip phụ kèm padding mở rộng).
- **Focus Ring rõ nét**: `:focus-visible` có viền sáng 3px xanh teal (`var(--v13-focus-ring)`) giúp người dùng điều hướng bằng bàn phím (Tab / Shift+Tab) dễ dàng.
- **Hỗ trợ Giảm chuyển động (`prefers-reduced-motion`)**: Tự động tắt transition khi người dùng cấu hình trợ năng hệ thống.

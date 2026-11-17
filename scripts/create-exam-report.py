from pathlib import Path
from datetime import datetime, timezone, timedelta
from docx import Document
from docx.shared import Inches, Pt, RGBColor

root = Path(__file__).resolve().parent.parent
day = datetime.now(timezone(timedelta(hours=7))).strftime('%Y-%m-%d')
document = Document()
document.styles['Normal'].font.name = 'Calibri'
document.styles['Normal'].font.size = Pt(11)
for name in ('Title', 'Heading 1', 'Heading 2'):
    document.styles[name].font.name = 'Calibri'
    document.styles[name].font.color.rgb = RGBColor.from_string('087E79')
document.add_heading('BÁO CÁO WEBSITE LUYỆN THI HSK', 0)
document.add_paragraph('Bản local-first với dashboard và bộ từ cá nhân • ' + day)
sections = [
 ('Phạm vi', 'Sáu mục: Tổng quan, Đề thi, Luyện từng phần, Từ vựng, Ôn câu sai, Lịch sử làm bài. Dashboard và bộ từ chỉ dùng dữ liệu trên thiết bị; chưa có API, tài khoản, đồng bộ cloud hoặc admin server.'),
 ('Tổng quan', 'Lượt làm, độ chính xác câu khách quan, thời gian luyện, từ đến hạn, hoạt động bảy ngày và kết quả theo kỹ năng được tính từ attempts/từ thực đã lưu. Không seed số liệu demo; thời gian ngắn được hiển thị đến một chữ số thập phân.'),
 ('Chọn và làm bài', 'Lọc phiên bản, cấp độ, phần thi bằng URL; lọc dạng câu nâng cao. Có bài luyện từng câu và bài luyện có giờ tùy chỉnh. Giữ câu trả lời, đánh dấu, phiên dở và hạn giờ sau tải lại. Bảng câu chia theo phần, có panel trên mobile.'),
 ('Nghe', 'Kiểm tra âm thanh trước tính giờ. Trong lúc thi ẩn bản chép lời, bản dịch và lời giải. Chế độ luyện mở sau kiểm tra câu. Audio lỗi tạm dừng đồng hồ và giữ bài; khôi phục âm thanh rồi tiếp tục. Hiện chỉ có giọng máy phụ thuộc thiết bị.'),
 ('Chấm và ôn', 'Câu có đáp án kiểm tra được chấm tự động; sắp xếp câu nhập văn bản. Viết, dịch, nói chưa chấm để tự đánh giá. Tách sai và bỏ trống, ghi mẫu số tỷ lệ đúng, không quy đổi điểm HSK. Luyện lại câu sai, ôn riêng từng phiên bản, khử trùng câu; mở/làm lại/xóa từng lượt lịch sử.'),
 ('Dữ liệu', 'Ba ngân hàng gốc, 20 câu duy nhất: 5 câu HSK 2.0, 10 câu HSK 3.0 chưa xác minh cấp, 5 câu nhóm 7–9 minh họa. Không có đề đầy đủ đủ điều kiện. Cần bộ câu hoàn chỉnh có quyền sử dụng, đáp án và cấu trúc/quy tắc đối chiếu chính thức, audio thu âm. Không nhân bản câu để đủ số lượng.'),
 ('Bảo toàn dữ liệu', 'Giữ khóa localStorage cũ và ID tám gói cũ để mở lịch sử/phiên dở. Migration schema 1/2 sang 3 tạo backup trước khi đổi schema, giữ sessions, attempts, review queue và tiến độ từ vựng cũ. Không xóa toàn bộ dữ liệu người dùng.'),
 ('Kiểm tra và giới hạn', 'Typecheck, kiểm tra nội dung, test logic, build và kiểm tra Chrome tự động. Ảnh minh họa từ profile kiểm tra riêng, dữ liệu lượt làm là dữ liệu kiểm thử. Kiểm tra audio sử dụng bộ giả lập speech để tái hiện thành công/lỗi; chưa xác nhận chất lượng giọng nghe thật trên mọi thiết bị. Repository không có lệnh lint. Giao diện mobile kiểm tra 375 × 812, desktop 1280 × 900.'),
]
for title, body in sections:
    document.add_heading(title, 1)
    document.add_paragraph(body)
labels = {'desktop-dashboard':'Tổng quan desktop', 'desktop-catalog':'Chọn đề đầy đủ desktop', 'desktop-room':'Làm bài desktop', 'desktop-result':'Kết quả desktop', 'desktop-history':'Lịch sử desktop', 'desktop-vocabulary':'Bộ từ cá nhân desktop', 'desktop-vocabulary-reviewed':'Ôn từ sau khi đánh giá desktop', 'mobile-dashboard':'Tổng quan mobile', 'mobile-catalog':'Chọn phần trên mobile', 'mobile-vocabulary':'Bộ từ cá nhân mobile', 'mobile-room':'Làm bài mobile', 'mobile-palette':'Panel số câu mobile', 'mobile-result':'Kết quả mobile'}
for name, label in labels.items():
    image = root / 'docs/screenshots/exam-focus' / (name + '.png')
    if not image.exists():
        raise FileNotFoundError(image)
    document.add_page_break()
    document.add_heading(label, 1)
    document.add_picture(str(image), width=Inches(3.4 if name.startswith('mobile') else 6.2))
    drawing = document.inline_shapes[-1]._inline.docPr
    drawing.set('descr', label + ' — ảnh chụp giao diện website trong phiên kiểm tra')
document.add_heading('Chạy website và tạo lại báo cáo', 1)
document.add_paragraph('npm run build; npm run preview -- --host 127.0.0.1 --port 4173. Mở http://127.0.0.1:4173. Khi website đang chạy: npm run report:web. Cần Chrome và Python/python-docx đã có trong môi trường.')
output = root / 'docs' / ('BAO_CAO_LUYEN_THI_HSK_' + day + '.docx')
document.save(output)
print('Saved ' + str(output))

import json
import sys
from datetime import datetime
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn


ROOT = Path(__file__).resolve().parents[1]
INVENTORY = Path(sys.argv[1]).resolve()
OUTPUT = ROOT / 'docs' / 'BAO_CAO_CHUC_NANG_LUYENTIHSK.docx'
TEAL = '087E8B'
NAVY = '16324F'
PALE = 'EAF4F5'
GRAY = '5D6B78'


def set_cell_shading(cell, fill):
    properties = cell._tc.get_or_add_tcPr()
    shading = OxmlElement('w:shd')
    shading.set(qn('w:fill'), fill)
    properties.append(shading)


def set_cell_margins(cell, top=90, start=110, bottom=90, end=110):
    properties = cell._tc.get_or_add_tcPr()
    margins = properties.first_child_found_in('w:tcMar')
    if margins is None:
        margins = OxmlElement('w:tcMar')
        properties.append(margins)
    for edge, value in [('top', top), ('start', start), ('bottom', bottom), ('end', end)]:
        node = margins.find(qn(f'w:{edge}'))
        if node is None:
            node = OxmlElement(f'w:{edge}')
            margins.append(node)
        node.set(qn('w:w'), str(value))
        node.set(qn('w:type'), 'dxa')


def set_repeat_table_header(row):
    properties = row._tr.get_or_add_trPr()
    repeat = OxmlElement('w:tblHeader')
    repeat.set(qn('w:val'), 'true')
    properties.append(repeat)


def add_page_number(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    paragraph.add_run('Trang ')
    field = OxmlElement('w:fldSimple')
    field.set(qn('w:instr'), 'PAGE')
    paragraph._p.append(field)


def apply_font(run, name='Aptos', size=None, color=None, bold=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn('w:eastAsia'), name)
    if size is not None:
        run.font.size = Pt(size)
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold


def add_bullet(doc, text, level=0):
    paragraph = doc.add_paragraph(style='List Bullet' if level == 0 else 'List Bullet 2')
    paragraph.paragraph_format.space_after = Pt(3)
    run = paragraph.add_run(text)
    apply_font(run, size=10)
    return paragraph


def add_number(doc, text):
    paragraph = doc.add_paragraph(style='List Number')
    paragraph.paragraph_format.space_after = Pt(3)
    run = paragraph.add_run(text)
    apply_font(run, size=10)
    return paragraph


def add_section(doc, title, body=None):
    doc.add_heading(title, level=1)
    if body:
        paragraph = doc.add_paragraph(body)
        paragraph.paragraph_format.space_after = Pt(7)
        for run in paragraph.runs:
            apply_font(run, size=10)


def add_feature(doc, heading, lead, bullets):
    doc.add_heading(heading, level=2)
    paragraph = doc.add_paragraph(lead)
    paragraph.paragraph_format.space_after = Pt(4)
    for run in paragraph.runs:
        apply_font(run, size=10)
    for item in bullets:
        add_bullet(doc, item)


def add_table(doc, headers, rows, widths=None, font_size=9):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Light Shading Accent 1'
    header = table.rows[0]
    set_repeat_table_header(header)
    for idx, value in enumerate(headers):
        cell = header.cells[idx]
        cell.text = value
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        set_cell_shading(cell, NAVY)
        set_cell_margins(cell)
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                apply_font(run, size=9, color='FFFFFF', bold=True)
    for row_data in rows:
        cells = table.add_row().cells
        for idx, value in enumerate(row_data):
            cells[idx].text = str(value)
            cells[idx].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_margins(cells[idx])
            for paragraph in cells[idx].paragraphs:
                paragraph.paragraph_format.space_after = Pt(0)
                for run in paragraph.runs:
                    apply_font(run, size=font_size, color=NAVY)
    if widths:
        for row in table.rows:
            for idx, width in enumerate(widths):
                row.cells[idx].width = Inches(width)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)
    return table


def add_screenshot(doc, record, caption=None, width=6.9):
    image_path = INVENTORY.parent / record['viewportFile']
    if not image_path.exists():
        return
    picture = doc.add_picture(str(image_path), width=Inches(width))
    picture._inline.docPr.set('descr', record['title'] + ' - ' + record['device'])
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    line = doc.add_paragraph(caption or f"{record['title']} ({record['device']})")
    line.alignment = WD_ALIGN_PARAGRAPH.CENTER
    line.paragraph_format.space_after = Pt(6)
    for run in line.runs:
        apply_font(run, size=8, color=GRAY)


def capture(inventory, screen_id, device='desktop'):
    return next((item for item in inventory['screenshots'] if item['id'] == screen_id and item['device'] == device), None)


with INVENTORY.open(encoding='utf-8') as stream:
    inventory = json.load(stream)

doc = Document()
section = doc.sections[0]
section.top_margin = Inches(0.65)
section.bottom_margin = Inches(0.65)
section.left_margin = Inches(0.72)
section.right_margin = Inches(0.72)

styles = doc.styles
normal = styles['Normal']
normal.font.name = 'Aptos'
normal._element.rPr.rFonts.set(qn('w:eastAsia'), 'Aptos')
normal.font.size = Pt(10)
normal.font.color.rgb = RGBColor.from_string(NAVY)
normal.paragraph_format.space_after = Pt(5)
for style_name, size, color in [('Title', 27, NAVY), ('Heading 1', 17, NAVY), ('Heading 2', 12, TEAL), ('Heading 3', 10, TEAL)]:
    style = styles[style_name]
    style.font.name = 'Aptos Display' if style_name in ('Title', 'Heading 1') else 'Aptos'
    style._element.rPr.rFonts.set(qn('w:eastAsia'), style.font.name)
    style.font.size = Pt(size)
    style.font.bold = style_name != 'Title' or True
    style.font.color.rgb = RGBColor.from_string(color)
    style.paragraph_format.space_before = Pt(10 if style_name != 'Title' else 0)
    style.paragraph_format.space_after = Pt(5)

header = section.header.paragraphs[0]
header.text = 'LUYENTIHSK  |  BÁO CÁO CHỨC NĂNG WEBSITE'
header.paragraph_format.space_after = Pt(3)
for run in header.runs:
    apply_font(run, size=8, color=TEAL, bold=True)
footer = section.footer.paragraphs[0]
footer.add_run('Tài liệu nội bộ · Chụp từ website đang chạy')
for run in footer.runs:
    apply_font(run, size=8, color=GRAY)
add_page_number(section.footer.add_paragraph())

# Cover
cover = doc.add_paragraph()
cover.paragraph_format.space_before = Pt(68)
cover.alignment = WD_ALIGN_PARAGRAPH.LEFT
run = cover.add_run('LUYENTIHSK')
apply_font(run, size=16, color=TEAL, bold=True)
doc.add_paragraph()
title = doc.add_paragraph(style='Title')
title.paragraph_format.space_after = Pt(12)
title.add_run('BÁO CÁO CHỨC NĂNG\nWEBSITE')
subtitle = doc.add_paragraph()
subtitle.paragraph_format.space_after = Pt(25)
subrun = subtitle.add_run('Kiểm kê màn hình, luồng học tập, dữ liệu và giới hạn hiện tại')
apply_font(subrun, size=13, color=GRAY)
date_text = datetime.now().strftime('%d/%m/%Y')
meta = doc.add_paragraph()
meta.add_run(f'Ngày lập: {date_text}\nĐịa chỉ chụp: {inventory["baseUrl"]}\nẢnh giao diện: desktop 1440 × 1000 px; mobile 390 × 844 px')
for run in meta.runs:
    apply_font(run, size=10, color=NAVY)

box = doc.add_table(rows=1, cols=1)
box.alignment = WD_TABLE_ALIGNMENT.LEFT
cell = box.cell(0, 0)
cell.text = ('Phạm vi: 7 màn hình nghiệp vụ chính, các chế độ từ vựng, phiên làm bài, xác nhận nộp, kết quả, '
             'trạng thái bộ đề đầy đủ chưa phát hành và bố cục mobile. Website hiện dùng nội dung mẫu và lưu tiến độ trong trình duyệt.')
set_cell_shading(cell, PALE)
set_cell_margins(cell, top=180, start=180, bottom=180, end=180)
for paragraph in cell.paragraphs:
    for run in paragraph.runs:
        apply_font(run, size=11, color=NAVY, bold=True)

doc.add_page_break()
add_section(doc, '1. Tóm tắt sản phẩm')
doc.add_paragraph('LuyenThiHSK là ứng dụng React + TypeScript chạy trong trình duyệt, hỗ trợ người học Việt Nam luyện các nội dung minh họa cho HSK 2.0 và HSK 3.0. Người học có thể xem bài luyện, làm câu hỏi, lưu tiến độ trên thiết bị, ôn từ vựng và theo dõi kết quả. Không cần tài khoản để sử dụng các luồng hiện có.')
add_table(doc, ['Hạng mục', 'Hiện trạng'], [
    ('Màn hình chính', 'Trang chủ, danh sách bài luyện, phiên làm bài, kết quả, từ vựng, tiến độ, nguồn dữ liệu.'),
    ('Chế độ phụ', 'Flashcard, danh sách từ vựng, tra nét; modal xác nhận nộp; lọc kết quả; trạng thái đề đầy đủ.'),
    ('Dữ liệu học', 'Lưu cục bộ bằng localStorage theo browser/profile/origin; không đồng bộ giữa thiết bị.'),
    ('Offline', 'Production cache shell và tệp ứng dụng sau lần mở online đầu tiên; dữ liệu tiến độ vẫn lưu trên thiết bị.'),
    ('Tài khoản/backend', 'Chưa có đăng nhập, backend, đồng bộ đám mây hoặc bảng xếp hạng.'),
])

add_section(doc, '2. Danh mục chức năng')
add_feature(doc, '2.1 Trang chủ', 'Là điểm vào để chọn phiên bản HSK và đi tới các hoạt động học.', [
    'Chuyển giữa HSK 2.0 và HSK 3.0; hiển thị nhóm cấp độ theo giai đoạn học.',
    'Lối tắt: luyện nhanh, thi thử, học từ vựng và ôn câu sai.',
    'Chọn cấp độ hoặc kỹ năng để mở danh sách bài đã lọc; xem các bộ bài nổi bật.',
    'Hiển thị thống kê nhanh và nút tiếp tục/khởi động lại phiên học dở khi có dữ liệu đã lưu.',
])
add_feature(doc, '2.2 Danh sách bài thi và bài luyện', 'Các bộ câu hỏi được lọc ngay trên trang, không đổi URL.', [
    'Bộ lọc theo phiên bản, cấp độ, kỹ năng, dạng bài, dạng câu hỏi và chủ đề; có nút đặt lại bộ lọc.',
    'Mỗi thẻ bài hiển thị phiên bản/cấp, kỹ năng, số câu, thời lượng luyện do website đặt và độ khó.',
    'Có hai cách bắt đầu: luyện từng câu hoặc thi thử có giờ.',
    'Bộ lọc “đề đầy đủ” giải thích trạng thái chưa có bộ câu hỏi đạt số lượng, kỹ năng và quyền sử dụng cần thiết.',
])
add_feature(doc, '2.3 Phiên làm bài', 'Giao diện tập trung vào câu hiện tại, bộ điều hướng câu hỏi và trạng thái bài làm.', [
    'Chọn đáp án hoặc nhập câu trả lời mở; có thể chuyển câu bằng nút điều hướng và bảng số câu.',
    'Lưu tự động đáp án, câu hiện tại, cờ xem lại và hạn giờ vào bộ nhớ cục bộ.',
    'Đánh dấu câu để xem lại; câu đã làm, chưa làm và đã đánh dấu có trạng thái riêng trong bảng điều hướng.',
    'Phím 1–4 chọn đáp án; phím mũi tên trái/phải chuyển câu. Trong chế độ luyện tập, có thể kiểm tra đáp án và xem giải thích.',
    'Chế độ thi thử giữ kín phản hồi tới khi nộp; đồng hồ dùng thời lượng mẫu và tự nộp khi hết giờ.',
    'Hộp thoại trước khi nộp cho biết số câu đã làm, bỏ trống và câu đang đánh dấu.',
])
add_feature(doc, '2.4 Kết quả và ôn lại', 'Màn hình kết quả tách số liệu chấm tự động khỏi phần người học tự đánh giá.', [
    'Tổng hợp câu đúng, sai, bỏ trống, câu tự luận đã làm, thời gian và tỷ lệ đúng trên câu chấm tự động.',
    'Phân tích theo kỹ năng; lọc toàn bộ câu hoặc chỉ câu sai/bỏ trống.',
    'Xem câu trả lời, đáp án, giải thích; lưu câu vào sổ ôn tập và mở lại câu cần luyện.',
    'Câu viết/dịch/nói có rubric để tự đánh giá; mức đánh giá được lưu theo lượt làm.',
    'Có thể làm lại bài hoặc quay về danh sách bài luyện.',
])
add_feature(doc, '2.5 Từ vựng', 'Màn hình từ vựng có ba cách xem và các bộ lọc dùng chung.', [
    'Tìm theo chữ Hán, pinyin có dấu/không dấu, nghĩa tiếng Việt hoặc tiếng Anh; lọc phiên bản, cấp, từ loại và trạng thái ôn.',
    'Flashcard lật thẻ để hiện nghĩa, chuyển/xáo trộn thẻ, phát âm bằng speech synthesis có sẵn trên thiết bị.',
    'Đánh dấu cần ôn để nhắc lại sau 1 ngày; đánh dấu đã thuộc để bắt đầu lịch 3 ngày. Các lần đã thuộc tiếp theo kéo dài khoảng ôn đến tối đa 30 ngày.',
    'Danh sách từ hiển thị dạng bảng trên desktop và thẻ trên mobile; người học cập nhật trạng thái ngay tại danh sách.',
    'Tra thứ tự nét cho 6 ký tự 一, 二, 三, 十, 人, 大; xem hoạt ảnh hoặc tiến từng nét.',
])
add_feature(doc, '2.6 Tiến độ học tập', 'Trang tiến độ tổng hợp dữ liệu đã lưu trên thiết bị hiện tại.', [
    'Thẻ số liệu, heatmap theo ngày, biểu đồ theo tuần và bảng phân tích theo phiên bản/cấp độ/kỹ năng.',
    'Danh sách từ cần ôn và câu đã đánh dấu/sai/bỏ trống; có thao tác mở trực tiếp nội dung cần ôn.',
    'Lịch sử các lượt đã nộp; chọn một lượt để xem lại chi tiết kết quả.',
    'Có thao tác xóa dữ liệu trên thiết bị và hộp thoại xác nhận trước khi xóa.',
])
add_feature(doc, '2.7 Nguồn dữ liệu và bản quyền', 'Trang minh bạch nguồn nội dung và phạm vi dữ liệu.', [
    'Mở trực tiếp các tài liệu DATA_SOURCES, CONTENT_LICENSES và CONTENT_POLICY trong giao diện.',
    'Hiển thị nguồn tham khảo, trạng thái giấy phép/nguồn tự biên soạn và đường dẫn tới cổng thông tin HSK.',
])

add_section(doc, '3. Lưu dữ liệu và vận hành')
for item in [
    'Lượt thi, tối đa 12 phiên dở, tối đa 100 lịch sử và trạng thái từ vựng được lưu cục bộ trong browser storage.',
    'Tiến độ gắn với browser, profile và địa chỉ website; đổi profile hoặc cổng dev/production sẽ tạo kho dữ liệu riêng.',
    'Production có PWA/service worker để lưu shell, JavaScript và CSS cho lần mở offline sau khi đã tải online.',
    'Giao diện có cảnh báo mất mạng và lỗi lưu trữ/quota; phiên đang mở vẫn tồn tại trong bộ nhớ tới khi thoát trang.',
    'Giọng đọc dựa trên speech synthesis của hệ điều hành; tập giọng và chất lượng phụ thuộc thiết bị.',
]:
    add_bullet(doc, item)

add_section(doc, '4. Phạm vi dữ liệu và giới hạn cần biết')
add_table(doc, ['Nội dung', 'Phạm vi hiện tại'], [
    ('Bài luyện', '8 gói bài, dựa trên 20 câu hỏi tự biên soạn; một số câu được dùng lại giữa các gói cùng phiên bản.'),
    ('HSK 3.0', 'Một số cấp 1–6 chưa được đối chiếu hoàn tất; có nhãn chưa xác minh. Nhóm 7–9 là gói minh họa riêng.'),
    ('Đề thi đầy đủ', 'Chưa phát hành do chưa có bộ câu hỏi đủ số lượng/kỹ năng và quyền sử dụng đã xác minh.'),
    ('Từ vựng', '18 từ minh họa; cấp độ/phiên bản chưa xác minh nên không coi là danh sách chuẩn chính thức.'),
    ('Câu trả lời mở', 'Viết, dịch và nói cần người học tự so rubric; không có ghi âm, giám khảo AI hay chấm điểm tự động.'),
    ('Điểm số', 'Tỷ lệ đúng chỉ tính câu khách quan chấm được; không quy đổi thành điểm thi HSK chính thức hoặc dự đoán đỗ.'),
    ('Tài khoản', 'Chưa có backend, đăng nhập, đồng bộ giữa thiết bị hoặc quản trị nội dung trực tuyến.'),
])
doc.add_paragraph('Các giới hạn này được phản ánh trên giao diện và trong tài liệu nguồn để tránh hiểu nội dung mẫu là đề thi hoặc chuẩn HSK chính thức.')

add_section(doc, '5. Luồng sử dụng tiêu biểu')
for item in [
    'Chọn phiên bản HSK → chọn cấp độ/kỹ năng hoặc mở danh sách bài → chọn luyện từng câu hay thi thử có giờ.',
    'Trong bài: trả lời → chuyển câu/đánh dấu → kiểm tra câu (chế độ luyện) hoặc nộp bài.',
    'Sau khi nộp: xem tổng hợp và lời giải → lưu câu cần ôn → xem tiến độ và lịch sử.',
    'Từ vựng: tìm/lọc → lật flashcard → đánh dấu cần ôn/đã thuộc → quay lại danh sách tiến độ để xem lịch ôn.',
]:
    add_number(doc, item)

doc.add_page_break()
add_section(doc, '6. Ảnh chụp giao diện desktop')
doc.add_paragraph('Các ảnh viewport dưới đây được chụp tự động từ website đang chạy. Ảnh toàn trang lưu cạnh tài liệu với hậu tố “-full.png”; xem bảng kiểm kê ở cuối báo cáo.')
desktop_gallery = [
    ('trang-chu', 'Trang chủ: phiên bản, lối tắt học và lộ trình'),
    ('danh-sach-bai-luyen', 'Danh sách bài và bộ lọc'),
    ('de-thi-day-du-chua-co', 'Trạng thái bộ đề đầy đủ chưa có dữ liệu'),
    ('phien-luyen-co-giai-thich', 'Phiên luyện và phản hồi đáp án'),
    ('phien-thi-co-gio', 'Phiên thi thử có giờ và đồng hồ đếm ngược'),
    ('xac-nhan-nop-bai', 'Hộp thoại xác nhận nộp'),
    ('ket-qua-luyen-tap', 'Kết quả và nội dung ôn lại'),
    ('ket-qua-loc-cau-sai', 'Bộ lọc câu sai/bỏ trống trong kết quả'),
    ('tu-vung-flashcard', 'Flashcard từ vựng'),
    ('tu-vung-danh-sach', 'Bảng/thẻ danh sách từ vựng'),
    ('tu-vung-tra-net', 'Tra cứu thứ tự nét'),
    ('tien-do-hoc-tap', 'Tiến độ và lịch sử sau một lượt luyện'),
    ('nguon-du-lieu', 'Nguồn dữ liệu, giấy phép và chính sách'),
    ('nguon-du-lieu-mo-chi-tiet', 'Một tài liệu nguồn đang mở'),
    ('tiep-tuc-bai-do', 'Trang chủ có phiên học dở để tiếp tục'),
]
for screen_id, caption in desktop_gallery:
    record = capture(inventory, screen_id, 'desktop')
    if record:
        doc.add_heading(caption, level=2)
        add_screenshot(doc, record, f"Ảnh viewport: {record['viewportFile']}")
        if record.get('fullPageFile'):
            paragraph = doc.add_paragraph(f"Ảnh toàn trang: {record['fullPageFile']}")
            for run in paragraph.runs:
                apply_font(run, size=8, color=GRAY)

doc.add_page_break()
add_section(doc, '7. Ảnh chụp giao diện mobile')
doc.add_paragraph('Các màn hình mobile được chụp ở viewport 390 × 844 CSS px; ảnh toàn trang được lưu riêng cho các trang dài.')
mobile_ids = [
    ('trang-chu', 'Trang chủ'),
    ('danh-sach-bai-luyen', 'Danh sách bài luyện'),
    ('phien-luyen-co-giai-thich', 'Phiên làm bài'),
    ('phien-thi-co-gio', 'Thi thử có giờ'),
    ('xac-nhan-nop-bai', 'Xác nhận nộp'),
    ('ket-qua-luyen-tap', 'Kết quả'),
    ('tu-vung-flashcard', 'Flashcard'),
    ('tu-vung-danh-sach', 'Danh sách từ vựng'),
    ('tu-vung-tra-net', 'Tra nét'),
    ('tien-do-hoc-tap', 'Tiến độ'),
    ('nguon-du-lieu', 'Nguồn dữ liệu'),
]
for screen_id, caption in mobile_ids:
    record = capture(inventory, screen_id, 'mobile')
    if record:
        doc.add_heading(caption, level=2)
        add_screenshot(doc, record, f"Ảnh viewport mobile: {record['viewportFile']}", width=4.15)
        if record.get('fullPageFile'):
            paragraph = doc.add_paragraph(f"Ảnh toàn trang mobile: {record['fullPageFile']}")
            for run in paragraph.runs:
                apply_font(run, size=8, color=GRAY)

add_section(doc, '8. Kiểm kê tệp ảnh')
rows = []
for record in inventory['screenshots']:
    files = record['viewportFile']
    if record.get('fullPageFile'):
        files += '\n' + record['fullPageFile']
    rows.append((record['title'], record['device'], files))
add_table(doc, ['Màn hình/trạng thái', 'Thiết bị', 'Ảnh đã lưu trong docs/screenshots/current-web/'], rows, widths=[2.0, 0.8, 4.0], font_size=8)
doc.add_paragraph(f"Tổng cộng: {len(inventory['screenshots'])} ảnh viewport; "
                  f"{sum(1 for item in inventory['screenshots'] if item.get('fullPageFile'))} ảnh toàn trang; "
                  f"được tạo tự động lúc {datetime.fromisoformat(inventory['generatedAt'].replace('Z', '+00:00')).astimezone().strftime('%d/%m/%Y %H:%M')}.")

add_section(doc, '9. Thông tin công nghệ')
add_table(doc, ['Thành phần', 'Thông tin'], [
    ('Frontend', 'React 19, TypeScript, Vite.'),
    ('Dữ liệu học', 'localStorage thông qua dịch vụ studyStorage; câu hỏi và từ vựng mẫu nằm trong dữ liệu ứng dụng.'),
    ('Chấm và thống kê', 'Các dịch vụ riêng cho chấm đáp án, đồng hồ phiên và chỉ số tiến độ.'),
    ('PWA', 'Service worker và manifest cho offline shell ở production.'),
])
doc.add_paragraph('Báo cáo mô tả các chức năng đang có trong mã nguồn và chụp màn hình ở thời điểm lập báo cáo. Nội dung mẫu không thay thế việc thẩm định học thuật, bản quyền hoặc xác minh chính thức với đơn vị tổ chức HSK.')

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUTPUT)
print(f'Created Word report: {OUTPUT}')

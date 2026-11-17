import {readFile,writeFile} from 'node:fs/promises';
const p='scripts/report-v5.mjs';let s=await readFile(p,'utf8');const from=s.indexOf("const oldIndex=await readFile(target+'/00_MUC_LUC.md'"),end=s.indexOf("console.log('Generated '",from);if(from<0||end<0)throw Error('Index anchors');s=s.slice(0,from)+`const oldIndex=await readFile(target+'/00_MUC_LUC.md','utf8');if(!oldIndex.startsWith('# Hồ sơ HSK — V5'))await writeFile(target+'/00_MUC_LUC_V4_ARCHIVE.md',oldIndex);
await writeFile(target+'/00_MUC_LUC.md',\`# Hồ sơ HSK — V5

Cập nhật 16/10/2026. Báo cáo hiện hành ở V5; giữ V4/V3 làm lịch sử. Thư mục này không chứa token, SQLite, voice model hoặc audio chưa đủ quyền phân phối.

- [Báo cáo chính V5](FINAL_IMPLEMENTATION_REPORT_V5.md)
- [Trạng thái hiện tại](docs/CURRENT_STATE.md)
\${docs.map(f=>'- ['+f+'](docs/v5/'+f+')').join('\\n')}
- [Gallery 14 màn hình trước/sau](docs/screenshots/v5/index.html)
- [CSV cho reviewer](data/review-packages/v5)
- [Bằng chứng JSON](data/reports/v5)
- [Hồ sơ V4](00_MUC_LUC_V4_ARCHIVE.md)

HTML kèm audio nằm trong .runtime/review-packages/v5 của project gốc, giữ riêng. Người duyệt đọc gói, ghi nhận xét, rồi dùng trang admin để sửa và duyệt từng revision.
\`);
`+s.slice(end);await writeFile(p,s);
const testing='docs/TESTING.md',old=await readFile(testing,'utf8');if(!old.startsWith('# Testing — V5'))await writeFile(testing,'# Testing — V5\n\nXem [TEST_REPORT_V5](v5/TEST_REPORT_V5.md), [CURRENT_STATE](CURRENT_STATE.md) và [bằng chứng](../data/reports/v5/final-regression.json). V5 không thay engine hoặc storage key cũ. Các kết quả V4 bên dưới là lịch sử.\n\n'+old);

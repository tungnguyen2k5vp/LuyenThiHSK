import {readFile,writeFile,cp} from 'node:fs/promises';import {mockCandidatePlan} from '../shared/v10-mock.mjs';
const json=async f=>JSON.parse(await readFile(f,'utf8')),a=await json('data/reports/v11/content-audit.json'),p=await json('data/reports/v11/live-practice.json'),perf=await json('data/reports/v11/performance.json'),unit=await json('data/reports/v11/unit-tests.json'),api=await json('data/reports/v11/api-tests.json'),handoff='TAI_LIEU_TONG_HOP_HSK/V11_BAN_GIAO';
const samples=[];for(let i=0;i<20;i++){const t=performance.now(),plan=mockCandidatePlan(p.questions,'v11-candidate-benchmark-'+i);if(plan.errors.length||plan.questions.length!==60)throw Error('Invalid measured candidate');samples.push(performance.now()-t);}const sorted=[...samples].sort((a,b)=>a-b),candidate={at:new Date().toISOString(),scope:'Node candidate planner only; not licensed mock launch, browser render or grading',n:20,p50:sorted[9],p95:sorted[18],samples};await writeFile('data/reports/v11/mock-candidate-performance.json',JSON.stringify(candidate,null,2));
const root=`# LuyenThiHSK · Báo cáo V11

## Đã triển khai

- **HSK 2: 176 câu hỏi**, gồm 116 câu theo phần thi và 60 câu luyện ngữ pháp. Có 136 câu khả dụng cho đọc, viết và ngữ pháp.
- **16 bài ngữ pháp nháp**; cả 16 bài có ít nhất 5 câu độc lập khả dụng theo kiểm tra tự động. Hai bài 别 và 完/懂/好 đã tăng từ 4 lên 6 câu.
- **44/200 mục từ được bổ sung** nghĩa và ví dụ, tăng 24 mục trong V11. Giữ ID gốc, SRS và lịch sử học.
- Dashboard quyền của 80 WAV/30 SVG; queue chất lượng 200 từ; metadata audio theo mục đích, transcript revision và generation parameters; sửa player tải audio V10 bằng xác thực.
- Today, gợi ý ôn theo câu có thật, kết quả liên kết ngữ pháp/từ vựng và các cổng mở Full Mock. Endpoint V10 cũ cũng dùng gate V11.
- Fixture phòng thi 60 câu chạy trên Chrome và Edge: audio, lỗi phát/khôi phục, chuyển phần, tự lưu, refresh/resume, nộp bài và ôn lỗi. Kết quả tách **55 câu chấm tự động / 5 câu chưa chấm**. Fixture không vào ngân hàng thật.

## Trạng thái nội dung

| Tổng bản ghi | Draft | Needs Review | Automated Valid | Human Reviewed | Published |
| --- | --- | --- | --- | --- | --- |
| ${a.total} | ${a.workflow.draft} | ${a.workflow.needsReview} | ${a.workflow.internallyValidated} | 0 | 0 |

Automated Valid và workflow có thể chồng lấn; không cộng các cột thành tổng. HSK 1 giữ 435 câu, 68 bài và 199 cờ chờ quyết định chuyên môn.

**Sẵn sàng beta kỹ thuật cho khu học riêng Reading/Writing/Learning; nội dung chờ duyệt chuyên môn.**

Audio HSK 2 hiện **0/40 khả dụng**. Đã chuẩn bị 5 transcript PoC nhưng chưa tạo giọng vì thiếu điều kiện runtime/quyền voice và output/provider phù hợp. Không gọi dịch vụ trả phí hoặc tải model mới. Full Mock thật vẫn **NOT_READY**; cloud **NOT_DEPLOYED**. Quyền media, phát âm và ngôn ngữ chưa có người duyệt. Không publish hoặc gắn nhãn Official.

## Kiểm thử và hiệu năng

- **29/29** bộ hồi quy và **10/10** nhóm trình duyệt đạt.
- **${unit.assertions}** unit assertions, **${api.checks}** API checks; 10 lượt liên tiếp mỗi bộ unit/API/Chrome/Edge đạt, không retry trong chuỗi cuối.
- 36 ảnh giải mã được, kiểm tra pixel và xem ảnh đại diện. Có kiểm tra bàn phím/focus/alt/target size/text scaling; không chứng nhận WCAG.
- p95 mở bài lượt đo riêng: **${perf.summary.examStartRenderMs.p95.toFixed(1)} ms**. Lượt đầu **268,6 ms** vượt ngân sách được giữ để đối chiếu; nguyên nhân dao động chưa được chứng minh. Không thay mã hiệu năng giữa hai lượt đo.
- CI, Firefox/WebKit, thiết bị Android/iOS và IME/screen reader thật chưa kiểm tra; live Auth/RLS chưa xác minh.

## Mở web và tài liệu

- [Mở HSK Preview](http://127.0.0.1:4173/?view=preview): nhập dòng cuối của .runtime/admin-access.txt, rồi chọn HSK 2. Mã đổi khi API khởi động lại. Dùng HTTP, không mở dist/index.html bằng file://.
- [Toàn bộ bàn giao trong một folder](TAI_LIEU_TONG_HOP_HSK/V11_BAN_GIAO/README.md).
- [Mục lục 18 báo cáo](docs/v11/README.md) · [Gói duyệt offline](data/review-packages/v11/MO_DE_DUYET.html) · [Ảnh Chrome/Edge](docs/v11/SCREENSHOT_GALLERY.html).
- [Readiness và các blocker còn lại](docs/v11/V11_RELEASE_READINESS.md).
`;
await writeFile('FINAL_IMPLEMENTATION_REPORT_V11.md',root);await writeFile(handoff+'/FINAL_IMPLEMENTATION_REPORT_V11.md',root.replace('TAI_LIEU_TONG_HOP_HSK/V11_BAN_GIAO/README.md','README.md'));
await writeFile('docs/CURRENT_STATE.md',`# Current state · V11

Beta kỹ thuật riêng cho Reading/Writing/Learning; nội dung chờ duyệt chuyên môn.

HSK 1: 435 câu, 68 bài, 199 cờ chất lượng chưa có quyết định chuyên môn.

HSK 2: 176 câu (116 theo phần + 60 ngữ pháp), 16 bài học nháp, 44/200 mục từ được bổ sung, 40 transcript và 0 audio khả dụng. Full Mock NOT_READY. Human Reviewed 0; Published 0. Chưa triển khai cloud.

- [Báo cáo V11](../FINAL_IMPLEMENTATION_REPORT_V11.md)
- [Tài liệu V11](v11/README.md)
- [Một folder bàn giao](../TAI_LIEU_TONG_HOP_HSK/V11_BAN_GIAO/README.md)
`);
const extra=`

## Lượt đo đầu và giới hạn so sánh

Lượt đầu: p95 mở bài **268,6 ms**, vượt budget **239,0 ms** so với V10. Khi đo lại đúng harness, không còn kiểm thử khác chạy đồng thời, kết quả **${perf.summary.examStartRenderMs.p95.toFixed(1)} ms**, nằm trong ngân sách. Không thay mã hiệu năng giữa hai lượt; chưa chứng minh được nguyên nhân spike. Giữ [lượt đầu](../../data/reports/v11/performance-first.json) và [lượt đo lại](../../data/reports/v11/performance.json), không xóa số vượt ngân sách.

Các chỉ số paint HSK 2 đo hai animation frames sau thao tác điều hướng; độ trễ API được đo riêng. Không coi đó là phép đo tải toàn bộ catalog trên mạng thật. Audio HSK 2 và mở Full Mock thật chưa có điều kiện để benchmark.

Node candidate planner: 20 mẫu, p50 ${candidate.p50.toFixed(2)} ms / p95 ${candidate.p95.toFixed(2)} ms. Chỉ đo chọn 60 ứng viên, không đo mở bài có audio được cấp quyền. [Mẫu CPU](../../data/reports/v11/mock-candidate-performance.json).
`;
const perfFile='docs/v11/PERFORMANCE_REPORT_V11.md',old=await readFile(perfFile,'utf8');await writeFile(perfFile,old.split('\n\n## Lượt đo đầu và giới hạn so sánh')[0]+extra);
const notice='Nội dung AI vẫn ở NEEDS_REVIEW; kiểm tra tự động không thay duyệt chuyên môn.';
await writeFile('docs/v11/V11_RELEASE_READINESS.md',`# V11 · Readiness và blocker

**Beta kỹ thuật riêng cho Reading/Writing/Learning; nội dung chờ duyệt chuyên môn.** Chưa Production Ready, chưa triển khai cloud và chưa mở Full Mock HSK 2 bằng nội dung thật.

| Tổng | Draft | Needs Review | Automated Valid | Human Reviewed | Published |
| --- | --- | --- | --- | --- | --- |
| 1175 | 5 | 1170 | 1175 | 0 | 0 |

Các chiều automated/workflow có thể chồng lấn. Không cộng các cột thành tổng.

## Đã có

- HSK 1 giữ ổn định: 435 câu, 68 bài, hai bộ 40 câu, 199 cờ chờ chuyên môn.
- HSK 2: 176 câu; 16 bài nháp có ít nhất 5 câu độc lập; 44/200 mục từ được bổ sung; review queue và gates hoạt động.
- Candidate 60 câu và fixture phòng thi 60 câu đã qua Chrome/Edge. Fixture tách khỏi ngân hàng thật.
- 29/29 regression; 10/10 nhóm trình duyệt; 10 lượt liên tiếp mỗi unit/API/Chrome/Edge đạt.

## Blocker còn lại

1. Audio HSK 2: 40 transcript, 0 file khả dụng. PoC chuẩn bị 5 transcript; chưa đủ runtime và bằng chứng quyền voice/output hoặc cấu hình provider để tạo audio hợp lệ.
2. Media: 80 WAV chưa rõ quyền, 30 SVG gốc chờ bằng chứng. Chưa có review phát âm thật.
3. Chưa có người duyệt ngôn ngữ, đáp án và cấp HSK; không gắn Human Reviewed hoặc Published.
4. Full Mock thật còn 25 câu thiếu audio, 24 asset ảnh chờ quyền, 25 câu chờ phát âm và 60 câu chờ language/level review. Các nhóm chồng lấn.
5. Cloud chưa có staging được cấp quyền/cấu hình để kiểm Auth/RLS/HTTPS và hai thiết bị thật. CI, Firefox/WebKit, Android/iOS/IME/screen reader thật chưa kiểm tra.
6. Thời lượng 52 phút và 2 lượt nghe là quy định luyện tập của nền tảng; chưa xác minh quy tắc IBT hay điểm HSK tương đương.

Lượt đo hiệu năng đầu có spike; lượt đo lại khi rảnh trong ngân sách. Giữ cả hai và theo dõi, không coi benchmark local là khả năng chịu tải production.

${notice}

[Báo cáo tổng](../../FINAL_IMPLEMENTATION_REPORT_V11.md) · [Kiểm thử](TEST_REPORT_V11.md) · [Audio PoC](AUDIO_POC_REPORT.md).
`);
for(const f of ['docs/v11/PERFORMANCE_REPORT_V11.md','docs/v11/V11_RELEASE_READINESS.md','data/reports/v11/mock-candidate-performance.json'])await cp(f,handoff+'/'+f);
console.log(JSON.stringify({rootReport:'UPDATED_READABLE',candidateSamples:20,p95:candidate.p95}));

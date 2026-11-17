import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
const read=async p=>await readFile(p,'utf8');
const current=`# CURRENT STATE — nguồn trạng thái duy nhất

Cập nhật **16/10/2026 (Asia/Bangkok)**. **V4 HSK 1: TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW cho local/private Preview. Production BLOCKED.** Báo cáo V3/V2 bên dưới là lịch sử, không dùng số cũ thay trạng thái này.

## Trạng thái V4 hiện hành

- 300 vocabulary draft với 300 ví dụ, 68 grammar lessons với 136 ví dụ, 128 câu original AI, 40 WAV synthetic, 1 platform practice template. Tổng **537 NEEDS_REVIEW**, 537 internally validated; **Human Reviewed 0, Published V4 0**. Internally Validated là trạng thái kỹ thuật chồng lấp, không phải bước review con người.
- DEV/PREVIEW và BETA nội bộ có auth local, dữ liệu học riêng, cùng exam engine. Drill5, mini10, full40 (20 nghe +20 đọc, 35 phút custom), seed/revision locks, autosave/reload, section timing, results, mistakes, weakness/recommended session. Full tên PLATFORM PRACTICE MOCK / BETA, chưa phải cấu trúc official2025.
- Review Queue sửa revision, revalidate, xác nhận reviewer thật; Audio Review Queue có metadata và playback. Không có người duyệt thì giữ BLOCKED_FOR_HUMAN_REVIEW.
- 36 join từ điển HSK1 được sửa: missingVI 5→0; no-short22→3. Tổng nguồn cộng đồng: 11.000 từ,8.775 normalized,2.225 cần rà,552 missingVI,739 no-short. Private overlay HSK1 đủ300 nghĩa ngắn, không coi là human reviewed. Sàng lọc cấp tự động đánh dấu64draft có thể có từ hỗ trợ/tên riêng/vượt cấp, cần người xem.
- Audio Piper/huayan synthetic:40/40WAV browser decode trên Chrome/Edge; voice dataset license Unknown, chỉ nghiên cứu Preview riêng, không phân phối production.
- Typecheck/lint/core/V2/V3/V4/admin API/content/build PASS; V4 E2E Chrome+Edge và V1–V3 browser regression PASS. Viewport320/375/390/430, không có runtime exceptions. Không đụng tiến độ production trong QA.

## Blockers còn lại

Human expert review ngôn ngữ/pinyin/cấp/đáp án/distractors và phát âm; quyền audio; xác minh cấu trúc HSK2025 nếu muốn gọi Official. Chưa public beta/cloud auth/multiuser sync. Chưa Lighthouse, thiết bị mobile thật, Safari/Firefox hoặc microphone thật. Cold offline listening Preview chưa hỗ trợ. HSK2–3 DATA_ONLY của WaveA, không Beta Ready.

## Mở và xem tài liệu

Website http://127.0.0.1:4173/ ; HSK1 Preview http://127.0.0.1:4173/?view=preview ; API local8787. Lấy mã từ .runtime/admin-access.txt, giữ riêng. [CONTENT_V4](CONTENT_V4.md), [báo cáo V4](../FINAL_IMPLEMENTATION_REPORT_V4.md), [readiness](../HSK1_BETA_READINESS.md), [tests](../TEST_REPORT_V4.md), [tài liệu tập trung](../TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md).
`;
const oldState=await read('docs/CURRENT_STATE.md');if(!oldState.includes('## Trạng thái V4 hiện hành'))await writeFile('docs/CURRENT_STATE_V3_ARCHIVE.md',oldState);
await writeFile('docs/CURRENT_STATE.md',current);
let readme=await read('README.md');if(!readme.includes('# LuyenThiHSK V4'))readme=`# LuyenThiHSK V4

HSK 1 đã có bản **Preview/Beta kỹ thuật nội bộ**, còn chờ duyệt ngôn ngữ/cấp/đáp án và phát âm. Production chưa được mở. [Báo cáo V4](FINAL_IMPLEMENTATION_REPORT_V4.md) · [Trạng thái hiện hành](docs/CURRENT_STATE.md) · [Toàn bộ tài liệu](TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md).

## Mở HSK 1 Preview

Trong D:\\ReactJS\\LuyenThiHSK, chạy npm run server. Giữ website tại http://127.0.0.1:4173/ (npm run build rồi npm run preview -- --host 127.0.0.1 --port 4173 nếu chưa chạy). Vào http://127.0.0.1:4173/?view=preview, nhập mã trong .runtime/admin-access.txt.

- 300 từ và ví dụ draft,68bài grammar,128câu original,40WAV synthetic,mini10/full40Preview.
- NEEDS_REVIEW537; kiểm tra kỹ thuật537; Human Reviewed0; PublishedV4=0. AI không tự nhận human review.
- Giọng huayan có license dữ liệu Unknown, chỉ Preview riêng; chưa phân phối production.
- HSK2–3 DATA_ONLY. [Pipeline/review hướng dẫn](docs/CONTENT_V4.md), [Test report](TEST_REPORT_V4.md).

Lệnh V4: npm run test:v4 ; npm run test:browser:v4 ; npm run data:v4:validate ; npm run data:v4:audit ; npm run report:v4. Xem CONTENT_V4 trước khi tái tạo audio/staging.

## Lịch sử V3 / baseline (số liệu tại thời điểm V3)

`+readme.replace(/^\uFEFF?# LuyenThiHSK V3\s*/, '');
await writeFile('README.md',readme);
let testing=await read('docs/TESTING.md');if(!testing.includes('hiện hành V4'))await writeFile('docs/TESTING.md','# Testing — hiện hành V4\n\nXem [TEST_REPORT_V4](../TEST_REPORT_V4.md). Chrome và Edge V4 PASS; V1–V3 regression PASS. [CURRENT_STATE](CURRENT_STATE.md) là trạng thái mới nhất.\n\n## Lịch sử kiểm tra V3/V2\n\n'+testing);
const target='TAI_LIEU_TONG_HOP_HSK';await mkdir(target+'/docs/v4',{recursive:true});await mkdir(target+'/data/reports',{recursive:true});
const rootReports=(await readdir('.')).filter(f=>f.endsWith('_V4.md')||f==='HSK1_BETA_READINESS.md');for(const f of rootReports)await copyFile(f,target+'/'+f);
await copyFile('README.md',target+'/README.md');
for(const f of ['CURRENT_STATE.md','CURRENT_STATE_V3_ARCHIVE.md','CONTENT_V4.md','V4_BASELINE.md','V4_RELEASE_NOTES.md','TESTING.md'])await copyFile('docs/'+f,target+'/docs/'+f);
for(const f of await readdir('docs/v4'))await copyFile('docs/v4/'+f,target+'/docs/v4/'+f);
for(const f of (await readdir('data/reports')).filter(f=>f.startsWith('v4-')))await copyFile('data/reports/'+f,target+'/data/reports/'+f);
await mkdir(target+'/docs/screenshots/exam-focus',{recursive:true});for(const f of (await readdir('docs/screenshots/exam-focus')).filter(f=>f.startsWith('v4-')&&f.endsWith('.png')))await copyFile('docs/screenshots/exam-focus/'+f,target+'/docs/screenshots/exam-focus/'+f);
let index=await read(target+'/00_MUC_LUC.md');if(!index.includes('# Hồ sơ LuyệnThiHSK — V4')){await writeFile(target+'/00_MUC_LUC_V3_ARCHIVE.md',index);index=`# Hồ sơ LuyệnThiHSK — V4

Cập nhật16/10/2026. Toàn bộ báo cáo V4 được gom tại đây. Không chứa token,SQLite,runtime,voice model hoặc audio chưa đủ quyền phân phối. Các tài liệu V3/V2 giữ làm lịch sử.

## Bắt đầu ở đây

- [Trạng thái hiện hành](docs/CURRENT_STATE.md).
- [Báo cáo V4 đầy đủ20mục](FINAL_IMPLEMENTATION_REPORT_V4.md).
- [Cách chạy và review](docs/CONTENT_V4.md) · [README](README.md).
- [HSK1 Beta Readiness](HSK1_BETA_READINESS.md).
- [Question Bank](QUESTION_BANK_REPORT_V4.md) · [Grammar](GRAMMAR_COVERAGE_REPORT_V4.md) · [Vocabulary](VOCABULARY_QUALITY_REPORT_V4.md).
- [Audio](AUDIO_COVERAGE_REPORT_V4.md) · [Mock](MOCK_READINESS_REPORT_V4.md) · [License](CONTENT_LICENSE_REPORT_V4.md).
- [Tests](TEST_REPORT_V4.md) · [Performance](PERFORMANCE_REPORT_V4.md).
- [Release notes](docs/V4_RELEASE_NOTES.md) · [Baseline trước sửa](docs/V4_BASELINE.md).

## Evidence V4

- [Content counts/validation](data/reports/v4-content-validation.json).
- [Live readiness và trạng thái review](data/reports/v4-live-readiness.json).
- [64draft cần rà cấp/từ hỗ trợ](data/reports/v4-level-screening.json).
- [Dictionary before/after](data/reports/v4-dictionary-cleanup.json).
- [Batch biên tập](data/reports/v4-editorial-batches.json).
- [Chrome E2E](data/reports/v4-browser-chrome.json) · [Edge E2E](data/reports/v4-browser-edge.json).
- [Phòng thi Preview](docs/screenshots/exam-focus/v4-desktop-full-mock.png), [kết quả](docs/screenshots/exam-focus/v4-desktop-result.png), [Review Queue](docs/screenshots/exam-focus/v4-desktop-review-editor.png), [Audio Queue](docs/screenshots/exam-focus/v4-desktop-audio-review.png).

## Tài liệu cũ

[Mục lục V3](00_MUC_LUC_V3_ARCHIVE.md). Word và fileRAR cũ không phải báo cáo V4; dùng Markdown V4 trong thư mục này. Production vẫn BLOCKED_FOR_HUMAN_REVIEW; Human Reviewed0/PublishedV4=0.
`;}
await writeFile(target+'/00_MUC_LUC.md',index);console.log('V4 docs consolidated in '+target+'; no runtime secrets or unlicensed voice assets copied.');

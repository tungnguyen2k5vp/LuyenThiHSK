# Performance V4

Build assets thực tế:

| Asset | Bytes | Gzip bytes |
|---|---:|---:|
| AdminContentForm-uz612e5q.js | 15078 | 5501 |
| AdminWorkspaceV3-CWcdi1Un.js | 21864 | 7385 |
| CourseWorkspace-C-OKAsq4.js | 17932 | 6227 |
| Diagnostic-o2StOZSn.js | 3364 | 1594 |
| examCatalog-EN-xgkI0.js | 42884 | 14180 |
| index-BlK3CsyS.js | 360711 | 108683 |
| index-Dv8WHWWd.css | 64386 | 13229 |
| jsx-runtime-Dk72oS4N.js | 8774 | 3327 |
| PreviewWorkspace-CBq9XlQY.css | 1853 | 656 |
| PreviewWorkspace-wRYjtQiw.js | 20421 | 7162 |
| ResponseCenter-DrePH0hE.js | 5687 | 2573 |
| vocabularyQuiz-fZCf0jaV.js | 2202 | 1293 |

Nội dung HSK1 private release: 1859901 bytes JSON có formatting trên disk; API trả JSON compact. Model63MB và WAV không nằm trong bundle web. Preview route lazy-load. Course phân trang24 từ/16 cấu trúc; queue20.

Browser measurement là local wall time bao gồm chu kỳ polling/click100ms, không phải benchmark thiết bị thật hoặc Lighthouse:

```json
{
  "chrome": {
    "browser": "Chrome",
    "at": "2026-10-15T17:07:02.366Z",
    "releaseLoadMs": 115,
    "searchMs": 8,
    "practiceStartMs": 108,
    "decodedAudio": 40,
    "journey": "PASS"
  },
  "edge": {
    "browser": "Edge",
    "at": "2026-10-15T17:07:01.679Z",
    "releaseLoadMs": 232,
    "searchMs": 7,
    "practiceStartMs": 112,
    "decodedAudio": 40,
    "journey": "PASS"
  }
}
```

Không có Lighthouse score nếu chưa chạy công cụ đó; không suy ra Core Web Vitals từ bundle size.

# V5 baseline — 16/10/2026

Backup source/public/staging/reports và SQLite snapshot: .runtime/backups/before-v5-2026-10-16. Không reset dữ liệu.

Static V4: 300 từ / 68 lessons / 128 questions / 40 WAV / 1 template. Runtime API:

```json
{
  "status": 200,
  "summary": {
    "counts": {
      "vocabulary": {
        "total": 300,
        "draft": 0,
        "needsReview": 300,
        "internallyValidated": 300,
        "humanReviewed": 0,
        "published": 0
      },
      "grammar": {
        "total": 68,
        "draft": 0,
        "needsReview": 68,
        "internallyValidated": 68,
        "humanReviewed": 0,
        "published": 0
      },
      "questions": {
        "total": 128,
        "draft": 0,
        "needsReview": 128,
        "internallyValidated": 128,
        "humanReviewed": 0,
        "published": 0
      },
      "audio": {
        "total": 40,
        "draft": 0,
        "needsReview": 40,
        "internallyValidated": 40,
        "humanReviewed": 0,
        "published": 0
      },
      "templates": {
        "total": 1,
        "draft": 0,
        "needsReview": 1,
        "internallyValidated": 1,
        "humanReviewed": 0,
        "published": 0
      }
    },
    "total": 537,
    "errors": 0,
    "warnings": 0,
    "renderedAudio": 40,
    "productionPublished": 0,
    "humanReviewed": 0
  },
  "audioDecoded": 40
}
```

| Script | Exit | ms |
|---|---:|---:|
| typecheck | 0 | 2333 |
| lint | 0 | 910 |
| test | 0 | 7577 |
| test:v2 | 0 | 4627 |
| test:v3 | 0 | 3027 |
| test:v3-api | 0 | 1144 |
| test:v4 | 0 | 5242 |
| test:admin | 0 | 914 |
| check:content | 0 | 2250 |
| build | 0 | 4514 |

Browser E2E baseline ghi riêng sau khi chạy; không suy từ báo cáo V4 cũ. Audio 114,32s phải đo lại. Human/Published dựa live/API, không chỉ đếm enum của taxonomy. HSK2–3 DATA_ONLY.

Browser baseline V1–V3 và V4 PASS sau khi khôi phục API8787/preview4173. Các lần đầu ECONNREFUSED là lỗi môi trường trước khởi động, không phải lỗi ứng dụng. Thử npm exec -- node đã cố truy cập registry; sửa cách gọi thành node trực tiếp, không cài thêm package.

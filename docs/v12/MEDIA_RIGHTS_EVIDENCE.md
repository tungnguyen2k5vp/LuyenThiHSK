# V12 · Bằng chứng nguồn gốc và quyền media

110/110 file hiện hành tồn tại và hash khớp: 80 WAV và 30 SVG. **30/30 SVG** tái tạo đúng byte bằng `scripts/v6-illustrations.mjs`; hash script khớp snapshot trước V12. **24 ảnh** trong blocker candidate đều nằm trong hồ sơ này. Không cần thay file chỉ để khôi phục lineage kỹ thuật; chưa thể suy thành quyền sở hữu.

| Chiều xác minh | Thực tế |
| --- | --- |
| Technical provenance SVG | 30 tái tạo đúng byte |
| Ownership confirmed | 0 |
| Private use allowed (đã ký) | 0 |
| Commercial use / redistribution (đã ký) | 0 / 0 |
| Pronunciation / Language approvals | 0 / 0 |
| WAV license status | 80 LICENSE_UNKNOWN |
| SVG rights status | 30 ORIGINAL_EVIDENCE_PENDING |

Dashboard cho xem source, generator/hash/snapshot, owner, license, tài liệu dạng https/local reference và các câu phụ thuộc. Form xác nhận có ngày, ghi chú và ba phạm vi riêng; chỉ credential thuộc LICENSE_REVIEW allowlist thực mới ký. Bind đúng asset revision/signature và attestation version; stale CAS bị từ chối. Xác nhận mới có thể rút quyền private; không tự cấp public, pronunciation hoặc language approval.

Không có signer thực được tạo trong main DB. API kiểm thử chữ ký dương/âm trên SQLite tạm bằng danh tính QA rõ ràng; không gọi đó là human review.

Nếu người phụ trách quyền không xác nhận được ownership: dùng editor/uploader tạo asset và question revision mới, giữ file/binding/attempt cũ, chạy E2E ảnh. V12 không thay ảnh lịch sử vì đã có lineage kỹ thuật; quyết định quyền vẫn chờ người thật.

[media-provenance](../../data/reports/v12/media-provenance.json) · [Ảnh giao diện](SCREENSHOT_GALLERY.html) · [api-tests](../../data/reports/v12/api-tests.json)

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.

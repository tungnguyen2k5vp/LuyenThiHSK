# V8 · Xử lý chất lượng HSK1

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

396 câu core giữ nguyên ID/nội dung. Thêm 6 câu grammar chọn lọc với ID mới; HSK1 hiện 402 câu nháp, 80 ứng viên thi, 2 bộ40.

199 câu core có cờ heuristic được phân loại theo ID/revision/fingerprint, severity, explanation, suggested resolution, required reviewer, owner, decision và trạng thái. Có 4 near-duplicate pairs trong audit V7; không tự xóa hay biến guided thành exam. Trạng thái ban đầu PENDING/UNASSIGNED, NO_SEMANTIC_DECISION; human-resolved=0.

Resolution states: PENDING, IN_REVIEW, NEEDS_CORRECTION, DRAFT_FIXED, READY_FOR_HUMAN_REVIEW, APPROVED_BY_AUTHORIZED_REVIEWER, BLOCKED. Trạng thái cuối không cho editor/import tự gắn; human decisions cần credentials và đúng revision. Cờ không phải kết luận lỗi.

80 candidates chia A–D,20/lô, chứa Chinese/pinyin khi có/Vi/type/part/key/distractors/source/revision/media/checklist. Không tự phê duyệt80 câu. Bằng chứng: content-audit.json, resolution.json, reviewer-package.json, Batch-A..D.json. 27/33 câu nháp V8 mới có cờ bổ sung trong new-draft-audit.json; báo riêng, không cộng nhầm vào199 core.

Nội dung sửa thực tế V8:3 revision mới khôi phục expected-answer metadata cho W2 do decorator cũ làm null; giữ manual grading và NEEDS_REVIEW. Before/after/reason/validation tại data/editorial/v8/manual-key-corrections.json. Sáu câu grammar là additions, không phải sửa396 câu cũ.

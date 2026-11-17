# V7 · Gap analysis

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

| Phạm vi | Phân loại | Xử lý |
| --- | --- | --- |
| Exam engine / snapshot / timer sections / lease / SM2 | ALREADY COMPLETE | Tái sử dụng; giữ serialization và keys |
| Ảnh lỗi và audio tải chậm | NEEDS IMPROVEMENT → implemented | Pause chung, bù tối đa 300s, hết ngân sách giữ bài/chuyển untimed |
| 396 câu / 68 bài | HUMAN REVIEW REQUIRED | 199 câu có cờ heuristic; không tự kết luận sai |
| Review notes/import | NEEDS IMPROVEMENT → implemented | CAS revision + fingerprint + workVersion; allowlist credential cho người duyệt |
| Ngữ pháp trùng bài kiểm tra | NEEDS IMPROVEMENT → implemented | Hai bài thay ví dụ; không sửa ID câu/audio; lọc overlap khỏi bài V6 |
| Audio / images | HUMAN REVIEW REQUIRED | 80/30 kiểm hash; chưa xác minh phát âm/ngữ nghĩa/quyền |
| Supabase/RLS/email | INFRASTRUCTURE REQUIRED | Giữ foundation và runbook; không deploy |
| Đa tab cloud capture | NOT VERIFIED | Shared localStorage capture chưa nguyên tử; blocker production |
| HSK2 | CONTENT REQUIRED | Blueprint riêng 9 phần/60 câu từ paper sample; chưa kích hoạt |
| HSK3–9 | NOT VERIFIED | Versioned config DATA_ONLY; không tạo đề |
| Screen reader / real mobile | NOT VERIFIED | Không có thiết bị/phiên công cụ phù hợp |
| Production | BLOCKED | Các gate độc lập; không publish tự động |

Source audit: `src/components/exam/ExamRoom.tsx`, `QuestionTypeRenderer.tsx`, `ExamAudio.tsx`, registry/builder/scoring/storage/grammar/SRS/weakness/studyPlan, review services/CAS/import, account BFF/Supabase adapter/SQL/queue. Skills đọc: frontend/backend/data engineering, minimal-change, test-automation, accessibility-auditor và pdf. Không gọi sub-agent.


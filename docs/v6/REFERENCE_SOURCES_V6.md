# REFERENCE SOURCES V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

[CTI syllabus](https://www.chinesetest.cn/syllabus) · [archive mẫu CTI](https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip) · [thông báo kỳ thi thử nghiệm](https://admin.chinesetest.cn/gonewcontent.do?id=51236758). V6 tái triển khai ý tưởng nội bộ trên stack cũ, không clone hoặc copy repository code/question/image/audio. Danh sách15repository/license đã audit các vòng trước giữ tại [REFERENCE_REPOSITORIES](../REFERENCE_REPOSITORIES.md), [DATA_SOURCES](../DATA_SOURCES.md), [CONTENT_LICENSES](../CONTENT_LICENSES.md). Community datasets không được tự đổi thành nguồn official; ưu tiên CTI khi đối chiếu cấp/cấu trúc.

Backend: [Supabase auth](https://supabase.com/docs/guides/auth/passwords), [session](https://supabase.com/docs/guides/auth/sessions), [PostgreSQL RLS](https://supabase.com/docs/guides/database/postgres/row-level-security). REST adapter dùng token người dùng để giữ RLS, không service-role bypass.

Số liệu hiệu năng/test trong báo cáo lấy từ local artifacts, không lấy từ quảng cáo hoặc kết quả người khác.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.

# Sources and license V4

| Thành phần | Nguồn | Quyền/trạng thái |
|---|---|---|
| Word/pinyin/level factual membership | CTI syllabus PDF qua chinesetest.cn; SHA256 ec74ce0439e837bbb15154be13e747ae798903b2fd3a331629df6c3b45504941 | Facts mapping; không phân phối PDF/câu thi/audio CTI |
| Taxonomy grammar | CTI + snapshot hsk30 theo nguồn V3 | Danh mục fact; bài giải thích và ví dụ V4 original AI draft |
| Nghĩa cộng đồng | https://github.com/ph0ngp/CVDICT | CC BY-SA4.0; attribution và raw references giữ nguyên |
| Nghĩa ngắn, ví dụ, 128 câu V4 | local:editorial/v4 | AI_GENERATED / NEEDS_REVIEW; original, chưa xác minh production rights |
| Sentence pinyin helper | https://github.com/mozillazg/python-pinyin | MIT, pypinyin 0.55.0, chỉ tooling runtime |
| Piper 2023.11.14-2 binary | https://github.com/rhasspy/piper | MIT upstream release + dependency licenses trong runtime; không copy code vào app |
| huayan medium voice | https://huggingface.co/rhasspy/piper-voices | MODEL_CARD ghi dataset license Unknown; UNVERIFIED, private research Preview only |

CTI https://www.chinesetest.cn/HSK/1 còn hiển thị cấu trúc40 câu và150 từ ở phần vocabulary cũ; không dùng tiêu đề HSK3.0 trên page để khẳng định40-câu là format syllabus2025. Vì vậy mock giữ PLATFORM_PRACTICE. Repo tham khảo cũ được lưu docs/REFERENCE_REPOSITORIES.md; không có code repo bên thứ ba ghép vào V4.

Model card bản tải local .runtime/tts/MODEL_CARD được hash trong metadata; không coi unknown là open license. Không public synthetic assets hiện tại.

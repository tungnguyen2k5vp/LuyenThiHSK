# Exam engine V2

Giữ renderer/policy dùng chung cho luyện và bài có giờ, audio preflight, pause/recover khi audio lỗi, deadline persistence, section navigation, answer sheet, submit một lần, objective/manual grading và historical snapshots. Chưa đổi cách tính điểm sang điểm HSK.

Bổ sung F để đánh dấu, trạng thái timer warning/critical, tra từ chỉ trong practice, next action cuối kết quả và tóm tắt dạng câu khi có ít nhất 3 câu cùng dạng. Chưa có thời gian từng câu; chỉ hiển thị trung bình cả bài khi có tối thiểu 5 câu. Không suy luận câu chậm từ dữ liệu thiếu.

Mỗi phiên có lease theo tab; tab thứ hai không ghi đè. Tiếp quản cần hành động rõ ràng và reload snapshot mới. Các tab lắng nghe storage event. Refresh trong cùng tab giữ chủ phiên và deadline. Snapshot trong attempt bảo toàn nội dung cũ dù content revision đổi.

Ngân hàng legacy vẫn có 20 câu tự biên soạn. Quiz từ vựng được tạo theo yêu cầu người học từ các nghĩa từ điển khác nhau; không quảng bá thành bộ đề HSK chính thức. Full exam vẫn qua fullExamErrors, yêu cầu blueprint/rules/answers đã duyệt và AudioAsset file cho nghe. Hiện 0 full mock đủ điều kiện, 0 audio mock được cấp quyền. TTS chỉ là giọng máy ở học từ và bài luyện minh họa.

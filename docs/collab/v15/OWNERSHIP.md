# Quyền V15

Theo yêu cầu trực tiếp của người dùng trong vòng V15, Codex là agent duy nhất phụ trách frontend, backend, content, integration và QA. Giới hạn không sửa UI Gemini của vòng trước đã được hủy. Không dùng sub-agent. Tài liệu V13/V14 được giữ làm lịch sử.

Các component tốt được tái sử dụng trong src/ui-v14; polish V15 được scope bằng class/query. Không tạo cây UI song song. V14 fallback, engine, timer, autosave, scoring, SRS và Study Plan tiếp tục dùng owner hiện có. Không migration hoặc sửa dữ liệu học thật. Snapshot/restore/source hashes và log tại data/reports/v15.

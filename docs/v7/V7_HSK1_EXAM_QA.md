# V7 · HSK1 exam QA

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

Giữ 8 part ×5 =40, 80 candidates, 2 bộ độc lập. Unit V7 kiểm hai bộ không trùng IDs hoặc banks; bộ thứ ba có 40 repeatedIds và warning. Không quảng cáo đề độc lập bằng đảo options. Snapshot deep clone giữ revision/options/bank/asset references. Matching nhiều dòng chấm đúng khi đủ và đúng toàn bộ; không đổi sang partial credit.

Room dùng engine/timer/lease/autosave hiện có; bổ sung media fairness và focus/keyboard. Kết quả liệt kê các part thực sự xuất hiện, đúng/sai/trống, accuracy, elapsed, lời giải và nút luyện part hoặc câu trống. Practice lộ transcript/lời giải chỉ sau check; timed giữ kín trên giao diện đến submit. Private Preview vẫn có key trong payload client, không được coi secure production exam.

Bằng chứng: unit-tests.json, api-tests.json, media-policy-tests.json, browser-matrix.json và các log có timestamp. Lỗi và retest được giữ nguyên; không đổi FAIL cũ thành PASS.

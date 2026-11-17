# Database V3

Nguồn trạng thái: [CURRENT_STATE.md](CURRENT_STATE.md).

Giữ hsk-study-data-v1/schema3 và hsk-preparation-v1/schema1; thêm optional timing/endedBy/task reason, không reset key. Session/attempt immutable snapshot tiếp tục tương thích dữ liệu thiếu trường mới. Ghi âm learner trong IndexedDB.

SQLite .runtime/hsk-content.sqlite: content(id,revision) immutable payload theo revision; imports checksum unique; audit legacy; content_reviews(entity/revision/stage/reviewer/comment/time); audit_details(actor/action/before/after/time); media_assets(hash,payload,time). Binary lưu .runtime/media bằnghash, không lưu trongDB. Migration CREATE IF NOT EXISTS, WAL, khôngDROP/TRUNCATE.

Index: content_status_kind, content_kind_id_revision và reviews_entity_revision; id/revision dùng compositePK; import/media hash unique. Static words theo level/shard, learner lọc trong cấp hiện tại và render từngtrang; chưa có indexed server vocabulary search. Progress/weakness/due/attempts nằm local memory với giới hạn storage hiện có; chưa có index DB cloud cho chúng.

Token admin đổi mỗi restart. Sao lưu DB khi server dừng; giữWALnếu còn và .runtime/media. PostgreSQL/RLS mới là mục tiêu trong DATABASE_SCHEMA.md, chưa triển khai cloudruntime. SnapshotV2 ở legacy/PRE-V3_DATABASE.md.

-- Additive migration; existing content and learning records are retained.
CREATE TABLE IF NOT EXISTS hsk_exam_standards (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, levels_json TEXT NOT NULL,
 config_json TEXT NOT NULL, source_url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hsk_content_sources (
 id TEXT PRIMARY KEY, payload TEXT NOT NULL, checked_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hsk_question_registry (
 id TEXT PRIMARY KEY, revision INTEGER NOT NULL,
 source_id TEXT NOT NULL REFERENCES hsk_content_sources(id),
 standard_id TEXT NOT NULL REFERENCES hsk_exam_standards(id),
 level TEXT NOT NULL, skill TEXT NOT NULL, fingerprint TEXT NOT NULL UNIQUE,
 quality_score INTEGER NOT NULL CHECK(quality_score BETWEEN 0 AND 100),
 FOREIGN KEY(id,revision) REFERENCES content(id,revision)
);
CREATE INDEX IF NOT EXISTS hsk_questions_facets ON hsk_question_registry(standard_id,level,skill);
CREATE TABLE IF NOT EXISTS hsk_import_jobs (
 id TEXT PRIMARY KEY, source_id TEXT NOT NULL REFERENCES hsk_content_sources(id),
 checksum TEXT NOT NULL UNIQUE, raw_json TEXT NOT NULL, report_json TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hsk_duplicate_log (
 id INTEGER PRIMARY KEY, job_id TEXT NOT NULL REFERENCES hsk_import_jobs(id),
 candidate_id TEXT NOT NULL, existing_id TEXT NOT NULL, similarity REAL NOT NULL,
 resolution TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hsk_exam_attempts (
 id TEXT PRIMARY KEY, owner_id TEXT NOT NULL,
 exam_id TEXT NOT NULL, exam_revision INTEGER NOT NULL,
 snapshot_json TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('ACTIVE','SUBMITTED')),
 started_at INTEGER NOT NULL, deadline INTEGER NOT NULL, submitted_at INTEGER,
 revision INTEGER NOT NULL DEFAULT 0, current_index INTEGER NOT NULL DEFAULT 0,
 start_key TEXT NOT NULL, result_json TEXT,
 UNIQUE(owner_id,start_key), FOREIGN KEY(exam_id,exam_revision) REFERENCES content(id,revision)
);
CREATE INDEX IF NOT EXISTS hsk_attempt_owner_date ON hsk_exam_attempts(owner_id,started_at DESC);
CREATE INDEX IF NOT EXISTS hsk_attempt_deadline ON hsk_exam_attempts(status,deadline);
CREATE TABLE IF NOT EXISTS hsk_attempt_answers (
 attempt_id TEXT NOT NULL REFERENCES hsk_exam_attempts(id), question_id TEXT NOT NULL,
 answer TEXT NOT NULL DEFAULT '', flagged INTEGER NOT NULL DEFAULT 0 CHECK(flagged IN (0,1)),
 updated_at INTEGER NOT NULL, PRIMARY KEY(attempt_id,question_id)
);
CREATE TABLE IF NOT EXISTS hsk_attempt_events (
 id INTEGER PRIMARY KEY, attempt_id TEXT NOT NULL REFERENCES hsk_exam_attempts(id),
 action TEXT NOT NULL, payload TEXT NOT NULL, created_at INTEGER NOT NULL
);

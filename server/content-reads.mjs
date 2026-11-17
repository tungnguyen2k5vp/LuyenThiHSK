/** Read projections only. Publication semantics match the existing latest-revision gates. */
export function latestContentRows(db){
 return db.prepare('SELECT c.* FROM content c JOIN (SELECT id,MAX(revision) revision FROM content GROUP BY id) v ON c.id=v.id AND c.revision=v.revision').all();
}
export function publicContentRows(db){
 if(!db.prepare("SELECT 1 FROM content WHERE status='PUBLISHED' LIMIT 1").get())return [];
 return db.prepare(`WITH versions AS (
  SELECT id,MAX(revision) revision,MAX(CASE WHEN status='PUBLISHED' THEN revision END) published_revision FROM content GROUP BY id
 ) SELECT c.* FROM versions v JOIN content c ON c.id=v.id AND c.revision=v.published_revision
 JOIN content latest ON latest.id=v.id AND latest.revision=v.revision WHERE latest.status!='ARCHIVED'
 AND COALESCE(json_extract(c.payload,'$.examModule'),'')!='HSK_SERVER_V1'`).all();
}

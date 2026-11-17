import { parseCsvRows } from './vocabularyImport';
export const IMPORT_FIELDS=['id','simplified','pinyin','meaningVi','level'] as const;
export function adminCsvHeaders(text:string){return parseCsvRows(text).rows[0]??[];}
export function parseAdminRows(text:string,kind:string,metadata:Record<string,unknown>,mapping:Record<string,string>):Record<string,unknown>[]{
  if(new TextEncoder().encode(text).length>4*1024*1024)throw Error('Dữ liệu vượt 4 MB.');
  if(text.trim().startsWith('[')){const rows=JSON.parse(text);if(!Array.isArray(rows)||rows.length>2000)throw Error('Tối đa 2.000 records.');return rows;}
  if(kind!=='vocabulary')throw Error('CSV hiện hỗ trợ vocabulary; dùng JSON cho nội dung có cấu trúc.');
  const parsed=parseCsvRows(text);if(parsed.malformed)throw Error(parsed.malformed);const [headers,...lines]=parsed.rows;
  if(!headers||lines.length>2000)throw Error('CSV cần header và tối đa 2.000 dòng.');
  for(const field of ['simplified','pinyin','meaningVi','level'])if(!headers.includes(mapping[field]??field))throw Error('Chưa ánh xạ cột '+field);
  return lines.map(line=>{const row={...metadata} as Record<string,unknown>;for(const field of IMPORT_FIELDS){const index=headers.indexOf(mapping[field]??field);if(index>=0)row[field]=line[index]??'';}if(!row.id)row.id='import:'+Array.from(String(row.simplified)).map(c=>c.codePointAt(0)!.toString(16)).join('-')+':'+String(row.level);return row;});
}

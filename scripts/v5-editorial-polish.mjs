import {readFile,writeFile} from 'node:fs/promises';
const p='data/editorial/v5/reading-batch-01.tsv',lines=(await readFile(p,'utf8')).trimEnd().split('\n'),rows=lines.slice(1).map(l=>l.split('|'));
rows[0][8]='给老师 đi với 一本: giáo viên được tặng một quyển. 三本 là tổng số sách mua, không phải số sách tặng giáo viên.';
rows[4][8]='Học sinh đáp 在家里, nghĩa là sách ở nhà. 没有书 trong lượt thoại này nói không có sách tại lớp, không khẳng định chưa từng sở hữu sách.';
rows[8][8]='哥哥的电脑是新的 xác nhận máy tính mới thuộc anh trai. Cần đọc từ phủ định trong 我的不是新的 để phân biệt hai người sở hữu.';
rows[9][6]='姐姐';
await writeFile(p,[lines[0],...rows.map(r=>r.join('|')),''].join('\n'));
const c='data/editorial/v5/corrections.json',edits=JSON.parse(await readFile(c,'utf8'));edits.vocabularyExamples['cti25-v-298']=['请坐在这里。','Xin mời ngồi ở đây.'];await writeFile(c,JSON.stringify(edits,null,2));

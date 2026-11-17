import {readFile,writeFile} from 'node:fs/promises';
const p='data/editorial/v10/learning-original.mjs';let s=await readFile(p,'utf8');
s=s.replace("['这个星期我看了三（　）电影。'","['这个星期我看了三（　）电影。（Đếm số lần xem phim）'");
s=s.replace("['这本书我只看了一半，还没有看（　）。'","['这本书我只看了一半，还没有看（　）。（Diễn đạt chưa đọc xong）'");
s=s.replace('Còn mười trang cho thấy chưa đọc xong.','Mới đọc một nửa, cần diễn đạt chưa đọc xong nên chọn 完.');
await writeFile(p,s);
const q='data/editorial/v10/hsk2-original.mjs';s=await readFile(q,'utf8');s=s.replace('建议带伞，同时回应两个信息点','建议别出门，同时回应两个信息点');await writeFile(q,s);
console.log('Draft ambiguity clarified; no review approvals granted');

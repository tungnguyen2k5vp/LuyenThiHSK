import type {CourseWord} from '../types/curriculum';
export function shortMeaning(word:CourseWord){return word.primaryMeaningVi??(word.meaningVi.length<=110?word.meaningVi.split(';')[0]:'');}
export function posLabel(pos:string[]){const names:Record<string,string>={'名':'Danh từ','动':'Động từ','形':'Tính từ','副':'Phó từ','代':'Đại từ','量':'Lượng từ','数':'Số từ','介':'Giới từ','连':'Liên từ','助':'Trợ từ','叹':'Thán từ'};return pos.map(p=>names[p]??p).join(' · ');}

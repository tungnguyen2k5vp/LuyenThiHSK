import type { Vocabulary } from "./models";

/**
 * Corrections for entries whose source dictionary selected a technical,
 * historical or variant-only sense instead of the everyday HSK sense.
 *
 * Keep this list deliberately explicit: every replacement is reviewable and
 * no user-authored meaning is ever overwritten by a heuristic.
 */
export type VocabularyQualityOverride = Partial<Pick<
  Vocabulary,
  | "traditional"
  | "pinyin"
  | "pinyinNumeric"
  | "primaryMeaningVi"
  | "meaningsVi"
  | "meaningsEn"
  | "pos"
  | "translationStatus"
>> & {
  aliases?: string[];
};

const canonicalOverrides: Record<string, VocabularyQualityOverride> = {
  上: {
    pinyin: "shàng",
    pinyinNumeric: "shang4",
    primaryMeaningVi: "trên; lên; ở trên",
    meaningsVi: ["trên", "lên", "ở trên", "phía trên"],
    meaningsEn: ["on", "above", "up"],
    pos: ["giới từ", "động từ", "danh từ"],
    translationStatus: "verified",
    aliases: ["trên", "lên", "ở trên", "phía trên"],
  },
  上午: {
    primaryMeaningVi: "buổi sáng",
    meaningsVi: ["buổi sáng", "sáng"],
    meaningsEn: ["morning"],
    translationStatus: "verified",
    aliases: ["buổi sáng", "sáng"],
  },
  中午: {
    primaryMeaningVi: "buổi trưa",
    meaningsVi: ["buổi trưa", "trưa", "giữa trưa"],
    meaningsEn: ["noon", "midday"],
    translationStatus: "verified",
    aliases: ["buổi trưa", "trưa", "giữa trưa"],
  },
  早: {
    primaryMeaningVi: "sớm",
    meaningsVi: ["sớm", "buổi sáng"],
    meaningsEn: ["early", "morning"],
    translationStatus: "verified",
    aliases: ["sớm", "buổi sáng", "sáng sớm"],
  },
  早上: {
    primaryMeaningVi: "buổi sáng; sáng sớm",
    meaningsVi: ["buổi sáng", "sáng sớm", "buổi sáng sớm"],
    meaningsEn: ["morning", "early morning"],
    translationStatus: "verified",
    aliases: ["buổi sáng", "sáng sớm", "buổi sáng sớm"],
  },
  下午: {
    primaryMeaningVi: "buổi chiều",
    meaningsVi: ["buổi chiều", "chiều", "xế chiều"],
    meaningsEn: ["afternoon"],
    translationStatus: "verified",
    aliases: ["buổi chiều", "chiều"],
  },
  晚上: {
    primaryMeaningVi: "buổi tối",
    meaningsVi: ["buổi tối", "tối", "ban đêm"],
    meaningsEn: ["evening", "night"],
    translationStatus: "verified",
    aliases: ["buổi tối", "tối", "ban đêm"],
  },
  清晨: {
    primaryMeaningVi: "sáng sớm",
    meaningsVi: ["sáng sớm", "rạng sáng"],
    meaningsEn: ["early morning", "dawn"],
    translationStatus: "verified",
    aliases: ["sáng sớm", "rạng sáng"],
  },
  黎明: {
    primaryMeaningVi: "bình minh; rạng đông",
    meaningsVi: ["bình minh", "rạng đông", "sáng sớm"],
    meaningsEn: ["dawn", "daybreak"],
    translationStatus: "verified",
    aliases: ["bình minh", "rạng đông", "sáng sớm"],
  },
  // A few HSK entries are multi-sense dictionary headwords.  The source
  // dictionary may select an uncommon pronunciation (for example 要[yāo]
  // instead of 要[yào]).  Keep the beginner reading as the canonical one so
  // pinyin lookup and meaning lookup agree.
  要: {
    pinyin: "yào",
    pinyinNumeric: "yao4",
    primaryMeaningVi: "muốn; cần",
    meaningsVi: ["muốn", "cần", "sẽ"],
    meaningsEn: ["to want", "to need", "will"],
    pos: ["động từ"],
    translationStatus: "verified",
    aliases: ["muốn", "cần", "sẽ"],
  },
  号: {
    pinyin: "hào",
    pinyinNumeric: "hao4",
    primaryMeaningVi: "số; ngày (trong tháng); tên hiệu",
    meaningsVi: ["số", "ngày (trong tháng)", "tên hiệu"],
    meaningsEn: ["number", "date", "name"],
    translationStatus: "verified",
    aliases: ["số", "ngày", "tên hiệu"],
  },
  句: {
    pinyin: "jù",
    pinyinNumeric: "ju4",
    primaryMeaningVi: "câu",
    meaningsVi: ["câu"],
    meaningsEn: ["sentence", "measure word for sentences"],
    translationStatus: "verified",
    aliases: ["câu", "câu nói"],
  },
  累: {
    pinyin: "lèi",
    pinyinNumeric: "lei4",
    primaryMeaningVi: "mệt",
    meaningsVi: ["mệt", "mệt mỏi"],
    meaningsEn: ["tired", "weary"],
    translationStatus: "verified",
    aliases: ["mệt", "mệt mỏi"],
  },
  假: {
    pinyin: "jiǎ",
    pinyinNumeric: "jia3",
    primaryMeaningVi: "giả; nghỉ phép",
    meaningsVi: ["giả", "nghỉ phép", "kỳ nghỉ"],
    meaningsEn: ["false", "leave", "holiday"],
    translationStatus: "verified",
    aliases: ["giả", "nghỉ phép", "kỳ nghỉ"],
  },
  场: {
    pinyin: "chǎng",
    pinyinNumeric: "chang3",
    primaryMeaningVi: "trận; buổi; nơi diễn ra",
    meaningsVi: ["trận", "buổi", "nơi diễn ra"],
    meaningsEn: ["event", "occasion", "place"],
    translationStatus: "verified",
    aliases: ["trận", "buổi", "nơi diễn ra"],
  },
  才: {
    pinyin: "cái",
    pinyinNumeric: "cai2",
    primaryMeaningVi: "mới; chỉ; tài năng",
    meaningsVi: ["mới", "chỉ", "tài năng"],
    meaningsEn: ["only then", "just", "talent"],
    translationStatus: "verified",
    aliases: ["mới", "chỉ", "tài năng"],
  },
  "\u51e0": {
    pinyin: "jǐ",
    pinyinNumeric: "ji3",
    primaryMeaningVi: "mấy; vài",
    meaningsVi: ["mấy", "vài", "bao nhiêu"],
    meaningsEn: ["how many", "several"],
    pos: ["đại từ", "lượng từ"],
    translationStatus: "verified",
    aliases: ["mấy", "vài", "bao nhiêu"],
  },
  看: {
    pinyin: "kàn / kān",
    pinyinNumeric: "kan4/kan1",
    primaryMeaningVi: "xem; nhìn; đọc",
    meaningsVi: ["xem; nhìn", "đọc", "trông nom; chăm sóc"],
    meaningsEn: ["to look; to watch", "to read", "to look after"],
    pos: ["động từ"],
    translationStatus: "verified",
    aliases: ["xem", "nhìn", "đọc", "trông nom", "chăm sóc"],
  },
  听: {
    pinyin: "tīng",
    pinyinNumeric: "ting1",
    primaryMeaningVi: "nghe",
    meaningsVi: ["nghe", "lắng nghe"],
    meaningsEn: ["to listen", "to hear"],
    pos: ["động từ"],
    translationStatus: "verified",
    aliases: ["nghe", "lắng nghe"],
  },
  行: {
    pinyin: "xíng / háng",
    pinyinNumeric: "xing2/hang2",
    primaryMeaningVi: "được; ổn; có thể",
    meaningsVi: ["được; ổn; có thể", "hàng; dòng", "ngành; nghề"],
    meaningsEn: ["okay; to be possible", "row; line", "profession; trade"],
    pos: ["động từ", "danh từ"],
    translationStatus: "verified",
    aliases: ["được", "ổn", "có thể", "hàng", "dòng", "ngành"],
  },
  得: {
    pinyin: "dé / de / děi",
    pinyinNumeric: "de2/de5/dei3",
    primaryMeaningVi: "được; nhận được",
    meaningsVi: ["được; nhận được", "trợ từ bổ ngữ", "phải; cần phải"],
    meaningsEn: ["to get; to obtain", "complement particle", "must; have to"],
    pos: ["động từ", "trợ từ", "động từ năng nguyện"],
    translationStatus: "verified",
    aliases: ["được", "nhận được", "bổ ngữ", "phải", "cần phải"],
  },
  长: {
    pinyin: "cháng / zhǎng",
    pinyinNumeric: "chang2/zhang3",
    primaryMeaningVi: "dài",
    meaningsVi: ["dài", "lớn lên; mọc; phát triển"],
    meaningsEn: ["long", "to grow"],
    pos: ["tính từ", "động từ"],
    translationStatus: "verified",
    aliases: ["dài", "lớn lên", "mọc", "phát triển"],
  },
  乐: {
    pinyin: "lè / yuè",
    pinyinNumeric: "le4/yue4",
    primaryMeaningVi: "vui; vui vẻ",
    meaningsVi: ["vui; vui vẻ", "âm nhạc"],
    meaningsEn: ["happy; joyful", "music"],
    pos: ["tính từ", "danh từ"],
    translationStatus: "verified",
    aliases: ["vui", "vui vẻ", "âm nhạc"],
  },
  "\u4e3a": {
    pinyin: "wèi / wéi",
    pinyinNumeric: "wei4/wei2",
    primaryMeaningVi: "vì; cho; để",
    meaningsVi: ["vì; do", "cho; để", "thay mặt", "là; làm; trở thành"],
    meaningsEn: ["for; because of", "for; in order to", "on behalf of", "to be; to become"],
    pos: ["giới từ", "động từ"],
    translationStatus: "verified",
    aliases: ["vì", "cho", "để", "thay mặt", "là", "trở thành"],
  },
};

/** Common HSK 1–2 items whose dictionary row contains only a variant note. */
const learnerMeaningOverrides: Record<string, { vi: string[]; en: string[]; aliases?: string[] }> = {
  杯: { vi: ["cốc", "ly"], en: ["cup", "glass"], aliases: ["cốc", "ly"] },
  菜: { vi: ["rau", "món ăn"], en: ["vegetable", "dish"], aliases: ["rau", "món ăn"] },
  吃: { vi: ["ăn"], en: ["to eat", "to consume"], aliases: ["ăn"] },
  出: { vi: ["ra", "đi ra", "xuất hiện"], en: ["to go out", "to come out"], aliases: ["ra", "đi ra"] },
  床: { vi: ["giường"], en: ["bed"], aliases: ["giường"] },
  第: { vi: ["thứ", "tiền tố chỉ số thứ tự"], en: ["ordinal number prefix"], aliases: ["thứ", "số thứ tự"] },
  动作: { vi: ["động tác", "hành động"], en: ["movement", "action"], aliases: ["động tác", "hành động"] },
  复习: { vi: ["ôn tập", "ôn lại"], en: ["to review", "revision"], aliases: ["ôn tập", "ôn lại"] },
  歌: { vi: ["bài hát", "hát"], en: ["song", "to sing"], aliases: ["bài hát", "hát"] },
  个: { vi: ["cái", "lượng từ chung"], en: ["general measure word"], aliases: ["cái", "lượng từ"] },
  花: { vi: ["hoa", "tiêu (tiền/thời gian)"], en: ["flower", "to spend"], aliases: ["hoa", "tiêu tiền"] },
  话: { vi: ["lời nói", "lời", "tiếng nói"], en: ["speech", "words", "conversation"], aliases: ["lời nói", "lời"] },
  回: { vi: ["quay lại", "trở về", "lần"], en: ["to return", "time"], aliases: ["quay lại", "trở về"] },
  叫: { vi: ["gọi", "tên là"], en: ["to call", "to be called"], aliases: ["gọi", "tên là"] },
  借: { vi: ["mượn", "cho mượn"], en: ["to borrow", "to lend"], aliases: ["mượn", "cho mượn"] },
  快点儿: { vi: ["nhanh lên", "mau lên"], en: ["hurry up", "more quickly"], aliases: ["nhanh lên", "mau lên"] },
  留: { vi: ["ở lại", "giữ lại", "lưu"], en: ["to stay", "to keep"], aliases: ["ở lại", "giữ lại"] },
  男孩儿: { vi: ["con trai", "cậu bé"], en: ["boy"], aliases: ["con trai", "cậu bé"] },
  女孩儿: { vi: ["con gái", "cô bé"], en: ["girl"], aliases: ["con gái", "cô bé"] },
  千: { vi: ["một nghìn", "nghìn"], en: ["thousand"], aliases: ["nghìn", "một nghìn"] },
  鞋: { vi: ["giày", "giầy"], en: ["shoe"], aliases: ["giày", "giầy"] },
  一点儿: { vi: ["một chút", "một ít"], en: ["a little bit"], aliases: ["một chút", "một ít"] },
  一块儿: { vi: ["cùng nhau", "một khối"], en: ["together", "a piece"], aliases: ["cùng nhau"] },
  一下儿: { vi: ["một lát", "một lần"], en: ["once", "for a moment"], aliases: ["một lát", "một lần"] },
  怎么: { vi: ["thế nào", "làm sao", "tại sao"], en: ["how", "why"], aliases: ["thế nào", "làm sao"] },
  只: { vi: ["chỉ", "chỉ có"], en: ["only", "merely"], aliases: ["chỉ", "chỉ có"] },
  直接: { vi: ["trực tiếp", "thẳng thắn"], en: ["direct", "immediate"], aliases: ["trực tiếp"] },
  餐厅: { vi: ["nhà hàng", "quán ăn", "nhà ăn"], en: ["restaurant", "dining hall"], aliases: ["nhà hàng", "quán ăn", "nhà ăn", "phòng ăn"] },
  早: { vi: ["sớm", "buổi sáng"], en: ["early", "morning"], aliases: ["sớm", "buổi sáng", "sáng sớm"] },
  喝: { vi: ["uống"], en: ["to drink"], aliases: ["uống", "đồ uống"] },
  饭: { vi: ["cơm", "bữa ăn"], en: ["cooked rice", "meal"], aliases: ["cơm", "bữa ăn", "ăn cơm"] },
  米饭: { vi: ["cơm", "cơm nấu"], en: ["cooked rice"], aliases: ["cơm", "cơm nấu"] },
  饿: { vi: ["đói", "đói bụng"], en: ["hungry"], aliases: ["đói", "đói bụng"] },
  饭店: { vi: ["nhà hàng", "quán ăn"], en: ["restaurant", "dining place"], aliases: ["nhà hàng", "quán ăn", "nhà ăn"] },
  饭馆: { vi: ["nhà hàng", "quán ăn"], en: ["restaurant", "eatery"], aliases: ["nhà hàng", "quán ăn", "nhà ăn"] },
  馒头: { vi: ["bánh màn thầu"], en: ["steamed bun"], aliases: ["bánh màn thầu", "màn thầu"] },
  包子: { vi: ["bánh bao"], en: ["steamed stuffed bun"], aliases: ["bánh bao", "bánh bao hấp"] },
  饺子: { vi: ["bánh sủi cảo", "sủi cảo"], en: ["dumpling"], aliases: ["bánh sủi cảo", "sủi cảo"] },
  面条儿: { vi: ["mì", "mỳ", "mì sợi"], en: ["noodles"], aliases: ["mì", "mỳ", "mì sợi"] },
  面条: { vi: ["mì", "mỳ", "mì sợi"], en: ["noodles"], aliases: ["mì", "mỳ", "mì sợi"] },
  食堂: { vi: ["nhà ăn", "căng tin", "phòng ăn"], en: ["dining hall", "cafeteria"], aliases: ["nhà ăn", "căng tin", "căn tin", "phòng ăn"] },
  食物: { vi: ["đồ ăn", "thức ăn", "thực phẩm"], en: ["food"], aliases: ["đồ ăn", "thức ăn", "thực phẩm"] },
  碗: { vi: ["cái bát", "bát", "chén"], en: ["bowl", "cup"], aliases: ["cái bát", "bát", "chén"] },
  看: { vi: ["chăm sóc", "trông nom", "theo dõi", "canh giữ"], en: ["to look after", "to take care of", "to watch", "to guard"], aliases: ["chăm sóc", "trông nom", "theo dõi", "canh giữ"] },
  慢: { vi: ["chậm", "chậm chạp"], en: ["slow"], aliases: ["chậm", "chậm chạp"] },
  面包: { vi: ["bánh mì"], en: ["bread"], aliases: ["bánh mì"] },
  晚: { vi: ["buổi tối", "đêm", "muộn"], en: ["evening", "night", "late"], aliases: ["buổi tối", "tối", "ban đêm"] },
  晚上: { vi: ["buổi tối", "buổi đêm", "ban đêm"], en: ["evening", "night"], aliases: ["buổi tối", "tối", "ban đêm"] },
  晚饭: { vi: ["bữa tối", "cơm tối"], en: ["dinner", "evening meal"], aliases: ["bữa tối", "cơm tối", "buổi tối"] },
  早晨: { vi: ["buổi sáng", "sáng sớm"], en: ["morning", "early morning"], aliases: ["buổi sáng", "sáng sớm"] },
  早餐: { vi: ["bữa sáng"], en: ["breakfast"], aliases: ["bữa sáng", "ăn sáng"] },
  午饭: { vi: ["bữa trưa", "cơm trưa"], en: ["lunch"], aliases: ["bữa trưa", "cơm trưa", "buổi trưa"] },
  中餐: { vi: ["bữa trưa", "đồ ăn Trung Quốc"], en: ["lunch", "Chinese food"], aliases: ["bữa trưa", "buổi trưa"] },
  米: { vi: ["gạo", "hạt gạo"], en: ["rice", "grain"], aliases: ["gạo", "hạt gạo"] },
  水: { vi: ["nước"], en: ["water"], aliases: ["nước", "nước uống"] },
  茶: { vi: ["trà"], en: ["tea"], aliases: ["trà"] },
  鸡蛋: { vi: ["trứng", "trứng gà"], en: ["egg", "chicken egg"], aliases: ["trứng", "trứng gà"] },
  吃饭: { vi: ["ăn cơm", "ăn"], en: ["to eat a meal"], aliases: ["ăn cơm", "ăn"] },
  想: { vi: ["muốn", "nghĩ", "nhớ"], en: ["to want", "to think", "to miss"], aliases: ["muốn", "nghĩ", "nhớ"] },
  喜欢: { vi: ["thích", "yêu thích"], en: ["to like", "to enjoy"], aliases: ["thích", "yêu thích"] },
  学校: { vi: ["trường học", "trường"], en: ["school"], aliases: ["trường học", "trường"] },
  教室: { vi: ["phòng học", "lớp học"], en: ["classroom"], aliases: ["phòng học", "lớp học"] },
  学生: { vi: ["học sinh", "sinh viên"], en: ["student"], aliases: ["học sinh", "sinh viên"] },
  同学: { vi: ["bạn cùng lớp", "bạn học"], en: ["classmate"], aliases: ["bạn cùng lớp", "bạn học"] },
  医生: { vi: ["bác sĩ"], en: ["doctor"], aliases: ["bác sĩ"] },
  医院: { vi: ["bệnh viện"], en: ["hospital"], aliases: ["bệnh viện"] },
  饱: { vi: ["no", "ăn no"], en: ["full", "satiated"], aliases: ["no", "ăn no"] },
  多少钱: { vi: ["bao nhiêu tiền", "giá bao nhiêu"], en: ["how much money"], aliases: ["bao nhiêu tiền", "giá bao nhiêu"] },
};

// all_hsk_clean.csv carries distinct rows for these readings. A headword-only
// override would merge their meanings/pinyin back together and make one HSK
// level incorrect, so only the source row is allowed to define them.

const readingOverrides: Record<string, VocabularyQualityOverride> = {
  '\u770b|kan4': { pinyin: 'k\u00e0n', pinyinNumeric: 'kan4', primaryMeaningVi: 'xem; nh\u00ecn; \u0111\u1ecdc', meaningsVi: ['xem', 'nh\u00ecn', '\u0111\u1ecdc'], meaningsEn: ['to look; to watch', 'to read'], translationStatus: 'verified' },
  '\u884c|xing2': { pinyin: 'x\u00edng', pinyinNumeric: 'xing2', primaryMeaningVi: '\u0111\u01b0\u1ee3c; \u1ed5n; c\u00f3 th\u1ec3 ch\u1ea5p nh\u1eadn', meaningsVi: ['\u0111\u01b0\u1ee3c', '\u1ed5n', 'c\u00f3 th\u1ec3 ch\u1ea5p nh\u1eadn'], meaningsEn: ['okay', 'to be possible'], translationStatus: 'verified' },
  '\u5f97|dei3': { pinyin: 'd\u011bi', pinyinNumeric: 'dei3', primaryMeaningVi: 'ph\u1ea3i; c\u1ea7n ph\u1ea3i', meaningsVi: ['ph\u1ea3i', 'c\u1ea7n ph\u1ea3i'], meaningsEn: ['must', 'have to'], translationStatus: 'verified' },
  '\u957f|zhang3': { pinyin: 'zh\u01ce ng'.replace(' ', ''), pinyinNumeric: 'zhang3', primaryMeaningVi: 'l\u1edbn l\u00ean; m\u1ecdc; ph\u00e1t tri\u1ec3n', meaningsVi: ['l\u1edbn l\u00ean', 'm\u1ecdc', 'ph\u00e1t tri\u1ec3n'], meaningsEn: ['to grow', 'to develop'], translationStatus: 'verified' },
  '\u4e3a|wei2': { pinyin: 'w\u00e9i', pinyinNumeric: 'wei2', primaryMeaningVi: 'l\u00e0; tr\u1edf th\u00e0nh; l\u00e0m', meaningsVi: ['l\u00e0', 'tr\u1edf th\u00e0nh', 'l\u00e0m'], meaningsEn: ['to be', 'to become', 'to act as'], translationStatus: 'verified' },
  '\u4e3a|wei4': { pinyin: 'w\u00e8i', pinyinNumeric: 'wei4', primaryMeaningVi: 'v\u00ec; cho; \u0111\u1ec3', meaningsVi: ['v\u00ec', 'cho', '\u0111\u1ec3'], meaningsEn: ['for', 'because of', 'in order to'], translationStatus: 'verified' },
};

const multiReadingHeadwords = new Set([
  '背', '冲', '传', '打', '待', '得', '地方', '过去', '好', '横', '结', '结果', '尽', '卡',
  '看', '空', '了', '落', '圈', '散', '头', '为', '系', '行', '一下儿', '炸', '长', '涨',
  '着', '只', '种', '重', '转', '转动',
]);

export function vocabularyQualityOverride(simplified: string, pinyinNumeric?: string): VocabularyQualityOverride | undefined {
  const readingOverride = pinyinNumeric ? readingOverrides[`${simplified}|${pinyinNumeric}`] : undefined;
  if (readingOverride) return readingOverride;
  if (multiReadingHeadwords.has(simplified)) return undefined;
  return canonicalOverrides[simplified];
}

export function applyVocabularyQualityOverride<T extends Vocabulary>(word: T): T {
  const override = vocabularyQualityOverride(word.simplified, word.pinyinNumeric);
  const learner = multiReadingHeadwords.has(word.simplified)
    ? undefined
    : learnerMeaningOverrides[word.simplified];
  if (!override && !learner) return word;
  return {
    ...word,
    ...(learner
      ? {
          primaryMeaningVi: learner.vi[0] ?? word.primaryMeaningVi,
          meaningsVi: learner.vi,
          meaningsEn: learner.en,
          translationStatus: "verified" as const,
        }
      : {}),
    ...(override ?? {}),
  };
}

/** Technical source notes are useful provenance, but are not learner-facing meanings. */
export function isLowQualityMeaning(value: string): boolean {
  return /(?:^|\s)(?:dùng trong|xem |biến thể|hình thức gắn liền|bộ ")|LT:|\[[a-z0-9]+[0-9]/iu.test(value);
}

/**
 * Removes dictionary-editor notes from the offline search index while keeping
 * the learner-facing Vietnamese text (for example “rau (LT: 棵[ke1])” becomes
 * “rau”). This is intentionally conservative and never mutates custom notes.
 */
export function cleanLearnerMeaning(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\s*\([^)]*(?:LT:|lượng từ|viết tắt|biến thể|lưu ý|thường dùng|đối lập)[^)]*\)/giu, "")
    .replace(/\s*\[[^\]]*\]/gu, "")
    .replace(/\s+(?=[\u3400-\u9fff])[\s\S]*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanLearnerMeanings(values: string[]): string[] {
  return Array.from(new Set(values.map(cleanLearnerMeaning).filter((value) => value && !isLowQualityMeaning(value))));
}

export function vocabularySearchAliases(simplified: string): string[] {
  if (multiReadingHeadwords.has(simplified)) return [];
  return [
    ...(learnerMeaningOverrides[simplified]?.aliases ?? []),
    ...(vocabularyQualityOverride(simplified)?.aliases ?? []),
  ];
}

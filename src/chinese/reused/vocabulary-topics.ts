import type { Vocabulary } from "./models";

export type VocabularyTopicId =
  | "people"
  | "food"
  | "school-work"
  | "places-travel"
  | "time-numbers"
  | "health-body"
  | "nature"
  | "actions"
  | "communication" | "home" | "shopping" | "clothing" | "sports"
  | "emotions" | "technology" | "culture" | "society" | "business" | "appearance";

export type VocabularyTopic = {
  id: VocabularyTopicId;
  title: string;
  description: string;
};

export const vocabularyTopics: readonly VocabularyTopic[] = [
  { id: "people", title: "Con người & quan hệ", description: "Gia đình, nghề nghiệp và các mối quan hệ" },
  { id: "food", title: "Ăn uống", description: "Món ăn, đồ uống và nhà hàng" },
  { id: "school-work", title: "Học tập & công việc", description: "Trường lớp, văn phòng và nghề nghiệp" },
  { id: "places-travel", title: "Địa điểm & đi lại", description: "Nơi chốn, phương tiện và du lịch" },
  { id: "time-numbers", title: "Thời gian & số đếm", description: "Ngày giờ, số lượng và tiền bạc" },
  { id: "health-body", title: "Cơ thể & sức khỏe", description: "Cơ thể, bệnh tật và chăm sóc sức khỏe" },
  { id: "nature", title: "Thiên nhiên & đời sống", description: "Thời tiết, động vật và môi trường" },
  { id: "actions", title: "Hành động & miêu tả", description: "Động từ, tính chất và trạng thái" },
  { id: "communication", title: "Giao tiếp thông dụng", description: "Câu hỏi, đại từ và từ nối thường gặp" },
  { id: "home", title: "Nhà cửa & sinh hoạt", description: "Đồ dùng, phòng ở và việc nhà" },
  { id: "shopping", title: "Mua sắm & dịch vụ", description: "Cửa hàng, thanh toán và dịch vụ" },
  { id: "clothing", title: "Trang phục & diện mạo", description: "Quần áo, phụ kiện và ngoại hình" },
  { id: "sports", title: "Thể thao & giải trí", description: "Vận động, trò chơi và sở thích" },
  { id: "emotions", title: "Cảm xúc & tính cách", description: "Tâm trạng, thái độ và quan hệ" },
  { id: "technology", title: "Công nghệ & khoa học", description: "Thiết bị, internet và nghiên cứu" },
  { id: "culture", title: "Văn hóa & nghệ thuật", description: "Âm nhạc, lễ hội và truyền thống" },
  { id: "society", title: "Xã hội & pháp luật", description: "Cộng đồng, chính sách và pháp luật" },
  { id: "business", title: "Kinh tế & kinh doanh", description: "Thương mại, tài chính và sản xuất" },
  { id: "appearance", title: "Màu sắc & hình dáng", description: "Màu sắc, kích thước và hình dạng" },
] as const;

// Keep Vietnamese accents: "mẹ"/"mè", "cá"/"cả" and "vở"/"vợ" have different topics.
const rules: readonly [VocabularyTopicId, string][] = [
  ["appearance", 'màu sắc|màu đỏ|màu xanh|màu trắng|màu đen|màu vàng|màu tím|hình dạng|hình tròn|hình vuông|kích thước|color|colour|shape'],
  ["technology", 'máy tính|điện thoại|phần mềm|internet|công nghệ|khoa học|nghiên cứu|kỹ thuật|dữ liệu|computer|software|technology'],
  ["clothing", 'quần áo|trang phục|áo|quần|giày|tất|mũ|váy|trang điểm|clothing|shirt|shoes'],
  ["sports", 'thể thao|bóng đá|bóng rổ|bơi|bơi lội|chạy bộ|trò chơi|giải trí|duy trì thể lực|sports|swimming|football'],
  ["culture", 'âm nhạc|bài hát|ca hát|nghệ thuật|văn hóa|lễ hội|truyền thống|nhạc cụ|hội họa|music|festival|art'],
  ["business", 'kinh tế|kinh doanh|tài chính|thương mại|đầu tư|ngân hàng|cổ phiếu|sản xuất|lợi nhuận|economy|business|finance'],
  ["society", 'xã hội|pháp luật|chính phủ|chính sách|quyền lợi|cộng đồng|tòa án|luật sư|politics|society|law'],
  ["emotions", 'cảm xúc|tâm trạng|tính cách|vui vẻ|buồn|lo lắng|sợ hãi|tức giận|hạnh phúc|tự tin|emotion|happy|sad'],
  ["shopping", 'mua|bán|mua sắm|thanh toán|cửa hàng|siêu thị|hóa đơn|giảm giá|dịch vụ|shopping|payment'],
  ["home", 'đồ dùng|phòng ngủ|phòng khách|phòng bếp|nhà bếp|đồ đạc|bàn|ghế|giường|tủ|chăn|gối|việc nhà|furniture|bedroom'],
  ["food", 'ăn|uống|cơm|gạo|mì|bánh|thịt|cá|rau|trái cây|quả táo|trà|cà phê|sữa|nước uống|rượu|món ăn|bữa|nhà hàng|quán ăn|nấu|ngon|đói|khát|canh|súp|food|soup|drink|fruit'],
  ["health-body", 'cơ thể|đầu|mắt|mũi|miệng|răng|tai|tay|chân|tim|máu|bệnh|bác sĩ|bệnh viện|thuốc|sức khỏe|khỏe|ốm|health|body'],
  ["school-work", 'học|trường|lớp|giáo viên|học sinh|sinh viên|đại học|sách|vở|bút|bài thi|công việc|làm việc|văn phòng|công ty|nhân viên|giám đốc|nghề nghiệp|school|work'],
  ["places-travel", 'địa điểm|nơi chốn|nhà|phòng|đường|phố|thành phố|nông thôn|sân bay|nhà ga|xe|tàu|máy bay|đi lại|du lịch|khách sạn|bắc kinh|trung quốc|nước ngoài|travel|airport'],
  ["time-numbers", 'ngày|tháng|năm|tuần|giờ|phút|giây|hôm nay|hôm qua|ngày mai|buổi sáng|buổi trưa|buổi chiều|buổi tối|thời gian|số đếm|bao nhiêu|tiền|time|number'],
  ["people", 'con người|người|gia đình|bố|mẹ|cha|ông|bà|anh trai|chị gái|em trai|em gái|vợ|chồng|bạn bè|đồng nghiệp|đàn ông|phụ nữ|trẻ em|family|friend'],
  ["nature", 'thiên nhiên|trời|mưa|nắng|gió|tuyết|mây|khí hậu|thời tiết|sông|biển|núi|cây|hoa|động vật|chó|mèo|chim|môi trường|nature|weather|animal'],
];
const patterns = rules.map(([id, terms]) => [id, new RegExp(`(?<![\\p{L}])(?:${terms})(?![\\p{L}])`, 'iu')] as const);

type TopicWord = Pick<Vocabulary, 'primaryMeaningVi' | 'meaningsVi' | 'meaningsEn' | 'pos'>;

export function vocabularyTopicId(word: TopicWord): VocabularyTopicId {
  const haystack = [
    word.primaryMeaningVi,
    ...word.meaningsVi,
    ...word.meaningsEn,
    ...word.pos,
  ].join(" ").normalize('NFC');
  for (const [id, pattern] of patterns) {
    if (pattern.test(haystack)) return id;
  }
  if (/động từ|tính từ|phó từ|verb|adjective|adverb/iu.test(haystack)) return "actions";
  return "communication";
}

export function groupVocabularyByTopic<T extends TopicWord>(words: T[]): Map<VocabularyTopicId, T[]> {
  const groups = new Map<VocabularyTopicId, T[]>();
  for (const word of words) {
    const id = vocabularyTopicId(word);
    const group = groups.get(id);
    if (group) group.push(word);
    else groups.set(id, [word]);
  }
  return groups;
}

/** Yield between small batches so switching sources never waits for the whole topic scan. */
export async function groupLearningTopics<T extends TopicWord>(words: T[], isActive: () => boolean) {
  const groups = new Map<VocabularyTopicId, T[]>();
  await new Promise<void>(resolve => setTimeout(resolve, 0));
  let started = Date.now();
  for (let offset = 0; offset < words.length; offset += 50) {
    if (!isActive()) return null;
    for (const [id, batch] of groupVocabularyByTopic(words.slice(offset, offset + 50))) {
      const group = groups.get(id);
      if (group) group.push(...batch);
      else groups.set(id, batch);
    }
    if (Date.now() - started >= 8 && offset + 50 < words.length) {
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      started = Date.now();
    }
  }
  return isActive() ? groups : null;
}

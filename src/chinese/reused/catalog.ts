/** Stable IDs: old clients keep their six legacy avatars and six base topics. */
export const topics = {
  general: 'Góc học tập', vocabulary: 'Từ vựng', grammar: 'Ngữ pháp', pronunciation: 'Phát âm', hsk: 'HSK', culture: 'Văn hóa',
  translation: 'Dịch thuật', study_abroad: 'Du học', travel: 'Du lịch', study_buddy: 'Tìm bạn học', tutor: 'Gia sư',
  careers: 'Việc làm', technology: 'Công nghệ', business: 'Kinh doanh', daily_life: 'Đời sống', entertainment: 'Giải trí',
  engineering: 'Kỹ thuật', health: 'Y tế', other: 'Khác',
} as const;
export type SocialTopic = keyof typeof topics;
export const legacyTopics = ['general', 'vocabulary', 'grammar', 'pronunciation', 'hsk', 'culture'] as const;
export const avatarGroups = ['Tất cả', 'Động vật', 'Biểu cảm', 'Sở thích'] as const;
const avatarRows = [
  ['seedling','🌱','Mầm xanh',3], ['panda','🐼','Gấu trúc',1], ['fox','🦊','Cáo',1], ['whale','🐳','Cá voi',1], ['sunflower','🌻','Hướng dương',3], ['cat','🐈','Mèo',1],
  ['rabbit_face','🐰','Thỏ',1], ['koala','🐨','Koala',1], ['frog','🐸','Ếch',1], ['penguin','🐧','Chim cánh cụt',1], ['owl','🦉','Cú mèo',1], ['hamster','🐹','Hamster',1],
  ['dog_face','🐶','Cún',1], ['tiger_face','🐯','Hổ',1], ['bear','🐻','Gấu',1], ['lion','🦁','Sư tử',1], ['unicorn','🦄','Kỳ lân',1], ['dragon','🐉','Rồng',1], ['turtle','🐢','Rùa',1], ['butterfly','🦋','Bươm bướm',1],
  ['grinning_face','😀','Tươi vui',2], ['face_with_tears_of_joy','😂','Cười vui',2], ['winking_face','😉','Nháy mắt',2], ['smiling_face_with_sunglasses','😎','Ngầu',2], ['nerd_face','🤓','Mọt sách',2], ['thinking_face','🤔','Suy nghĩ',2],
  ['saluting_face','🫡','Sẵn sàng',2], ['sleeping_face','😴','Mê ngủ',2], ['crying_face','😢','Xúc động',2], ['pleading_face','🥺','Năn nỉ',2], ['smiling_face_with_heart-eyes','😍','Mê mẩn',2], ['partying_face','🥳','Ăn mừng',2],
  ['avocado','🥑','Bơ',3], ['peach','🍑','Đào',3], ['strawberry','🍓','Dâu',3], ['cherry_blossom','🌸','Hoa anh đào',3], ['books','📚','Sách',3], ['brain','🧠','Trí nhớ',3], ['sparkles','✨','Lấp lánh',3], ['fire','🔥','Nhiệt huyết',3], ['hundred_points','💯','Điểm tuyệt đối',3],
  ['rocket','🚀','Tên lửa',3], ['robot','🤖','Robot',3], ['ghost','👻','Ma nhỏ',3], ['alien','👽','Vũ trụ',3], ['light_bulb','💡','Ý tưởng',3], ['hot_beverage','☕','Cà phê',3], ['red_heart','❤️','Yêu thương',3],
  ['hugging_face','🤗','Ấm áp',2], ['star-struck','🤩','Thích thú',2], ['zany_face','🤪','Tinh nghịch',2], ['face_with_raised_eyebrow','🤨','Tò mò',2], ['grinning_face_with_sweat','😅','Hơi ngại',2], ['relieved_face','😌','Thư thái',2],
  ['cat_with_wry_smile','😼','Mèo tinh nghịch',1], ['grinning_cat_with_smiling_eyes','😸','Mèo vui',1], ['smiling_cat_with_heart-eyes','😻','Mèo yêu đời',1], ['crying_cat','😿','Mèo cảm động',1], ['cat_with_tears_of_joy','😹','Mèo cười',1], ['pouting_cat','😾','Mèo dỗi',1],
] as const;
export const avatarOptions = avatarRows.map(([art, emoji, label, group], id) => ({ id, art, emoji, label, group: avatarGroups[group] }));
export const stickerPacks = { hello: 'Chào hỏi', study: 'Đi học', feelings: 'Cảm xúc', cheer: 'Cổ vũ', fun: 'Hài hước', rest: 'Nghỉ ngơi' } as const;
export type StickerPack = keyof typeof stickerPacks;
const stickerRows: [StickerPack, string, string, string][] = [
  ['hello','panda','你好呀','Chào bạn nè'], ['hello','cat','早上好','Chào buổi sáng'], ['hello','sunflower','下午好','Chào buổi chiều'], ['hello','whale','晚上好','Chào buổi tối'],
  ['hello','hugging_face','好久不见','Lâu rồi không gặp'], ['hello','rabbit_face','我来啦','Mình tới rồi'], ['hello','fox','在吗','Bạn có ở đó không?'], ['hello','smiling_face_with_hearts','谢谢你','Cảm ơn bạn'],
  ['hello','winking_face','不客气','Không có gì'], ['hello','saluting_face','收到','Đã nhận'], ['hello','red_heart','很高兴认识你','Rất vui được quen bạn'], ['hello','penguin','明天见','Hẹn ngày mai'],
  ['study','books','学习时间到','Đến giờ học rồi'], ['study','nerd_face','我懂了','Mình hiểu rồi'], ['study','thinking_face','让我想想','Để mình nghĩ đã'], ['study','brain','再想一下','Nghĩ thêm chút nữa'],
  ['study','light_bulb','原来如此','Thì ra là vậy'], ['study','panda','一起学吧','Cùng học nhé'], ['study','face_with_monocle','这题怎么做','Câu này làm thế nào?'], ['study','exploding_head','信息量好大','Nhiều thông tin quá'],
  ['study','grinning_face_with_sweat','再读一遍','Đọc lại lần nữa'], ['study','owl','记住了','Nhớ rồi nhé'], ['study','robot','继续练习','Tiếp tục luyện tập'], ['study','hundred_points','今天学会了','Hôm nay học được rồi'],
  ['feelings','face_with_tears_of_joy','哈哈哈哈','Cười quá trời'], ['feelings','star-struck','太棒了','Tuyệt vời quá'], ['feelings','pleading_face','拜托啦','Làm ơn nha'], ['feelings','crying_cat','有点感动','Hơi cảm động rồi'],
  ['feelings','face_with_open_mouth','真的吗','Thật hả?'], ['feelings','face_with_raised_eyebrow','有道理','Có lý đấy'], ['feelings','smiling_face_with_heart-eyes','好喜欢','Thích quá đi'], ['feelings','face_with_rolling_eyes','我想静静','Cho mình yên tĩnh chút'],
  ['feelings','relieved_face','终于好了','Cuối cùng cũng xong'], ['feelings','face_with_hand_over_mouth','有点害羞','Hơi ngại một chút'], ['feelings','pouting_cat','我不服','Mình chưa phục đâu'], ['feelings','hugging_face','抱抱你','Ôm bạn một cái'],
  ['cheer','fire','加油呀','Cố lên nhé'], ['cheer','clapping_hands','你真厉害','Bạn giỏi thật'], ['cheer','hundred_points','满分','Điểm tuyệt đối'], ['cheer','party_popper','恭喜恭喜','Chúc mừng nhé'],
  ['cheer','rocket','冲呀','Tiến lên nào'], ['cheer','seedling','慢慢进步','Tiến bộ từng chút'], ['cheer','red_heart','相信自己','Tin vào bản thân'], ['cheer','turtle','坚持就好','Cứ kiên trì nhé'],
  ['cheer','sparkles','今天也很棒','Hôm nay cũng rất tốt'], ['cheer','raising_hands','我们可以','Chúng mình làm được'], ['cheer','flexed_biceps','再试一次','Thử thêm lần nữa'], ['cheer','partying_face','一起庆祝','Cùng ăn mừng nào'],
  ['fun','cat_with_wry_smile','问题不大','Chuyện nhỏ thôi'], ['fun','rolling_on_the_floor_laughing','笑到停不下来','Cười không dừng được'], ['fun','zany_face','我先溜了','Mình chuồn trước đây'], ['fun','face_with_peeking_eye','偷偷看一眼','Lén nhìn một chút'],
  ['fun','panda','让我缓缓','Cho mình bình tĩnh đã'], ['fun','grinning_face_with_sweat','下次一定','Lần sau nhất định'], ['fun','face_with_spiral_eyes','脑袋转不过来','Não chưa xử lý kịp'], ['fun','ghost','突然出现','Bất ngờ xuất hiện'],
  ['fun','smiling_face_with_sunglasses','小意思','Chuyện nhỏ mà'], ['fun','fox','被你发现了','Bị bạn phát hiện rồi'], ['fun','cat_with_tears_of_joy','笑出眼泪','Cười ra nước mắt'], ['fun','alien','我是谁','Mình là ai đây?'],
  ['rest','sleeping_face','晚安啦','Ngủ ngon nhé'], ['rest','hot_beverage','休息一下','Nghỉ một chút'], ['rest','panda','今天辛苦了','Hôm nay vất vả rồi'], ['rest','sleepy_face','有点困了','Hơi buồn ngủ rồi'],
  ['rest','koala','明天继续','Ngày mai tiếp nhé'], ['rest','strawberry','补充能量','Nạp thêm năng lượng'], ['rest','whale','放松一下','Thư giãn một chút'], ['rest','sunflower','好好休息','Nghỉ ngơi cho khỏe'],
  ['rest','turtle','不着急','Không cần vội'], ['rest','cat','今天就到这','Hôm nay tới đây thôi'], ['rest','cherry_blossom','周末快乐','Cuối tuần vui vẻ'], ['rest','bear','明天会更好','Ngày mai sẽ tốt hơn'],
];
export const stickers = stickerRows.map(([pack, art, chinese, meaning], index) => ({ id: `m${String(index + 1).padStart(3, '0')}`, pack, art, chinese, meaning }));
export type CommunitySticker = typeof stickers[number];

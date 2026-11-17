import type { Vocabulary } from './models';

type Starter = Omit<Vocabulary, 'examples'> & { examples: Omit<Vocabulary['examples'][number], 'vocabularyId'>[] };

const meta = {
  source: '4Chinese curated starter set',
  sourceVersion: '2026-09-16',
  sourceUrl: 'local://curated-starter',
  translationStatus: 'verified' as const,
  visualType: 'illustration' as const,
  imageUri: null,
  imageSource: null,
  imageLicense: null,
  imageAttribution: null,
  audioUri: null,
};

const words: Starter[] = [
  ['你好','你好','nǐ hǎo','ni3 hao3','xin chào',['xin chào'],['hello'],['expression'],1,1,'女',9,'你好！','Nǐ hǎo!','Xin chào!'],
  ['学习','學習','xuéxí','xue2 xi2','học; học tập',['học','học tập'],['to study','to learn'],['verb'],1,18,'子',11,'我每天学习汉语。','Wǒ měitiān xuéxí Hànyǔ.','Tôi học tiếng Trung mỗi ngày.'],
  ['中国','中國','Zhōngguó','Zhong1 guo2','Trung Quốc',['Trung Quốc'],['China'],['proper noun'],1,8,'丨',12,'我住在中国。','Wǒ zhù zài Zhōngguó.','Tôi sống ở Trung Quốc.'],
  ['朋友','朋友','péngyou','peng2 you5','bạn bè',['bạn','bạn bè'],['friend'],['noun'],1,25,'月',12,'他是我的朋友。','Tā shì wǒ de péngyou.','Anh ấy là bạn của tôi.'],
  ['喜欢','喜歡','xǐhuan','xi3 huan5','thích',['thích','yêu thích'],['to like'],['verb'],1,14,'口',18,'我喜欢喝茶。','Wǒ xǐhuan hē chá.','Tôi thích uống trà.'],
  ['今天','今天','jīntiān','jin1 tian1','hôm nay',['hôm nay'],['today'],['time'],1,10,'人',8,'今天天气很好。','Jīntiān tiānqì hěn hǎo.','Hôm nay thời tiết rất đẹp.'],
  ['谢谢','謝謝','xièxie','xie4 xie5','cảm ơn',['cảm ơn'],['thank you'],['expression'],1,4,'讠',24,'谢谢你的帮助。','Xièxie nǐ de bāngzhù.','Cảm ơn sự giúp đỡ của bạn.'],
  ['再见','再見','zàijiàn','zai4 jian4','tạm biệt',['tạm biệt','hẹn gặp lại'],['goodbye'],['expression'],1,6,'冂',10,'老师，再见！','Lǎoshī, zàijiàn!','Tạm biệt thầy cô!'],
  ['汉语','漢語','Hànyǔ','Han4 yu3','tiếng Trung',['tiếng Hán','tiếng Trung'],['Chinese language'],['noun'],1,22,'氵',23,'汉语很有意思。','Hànyǔ hěn yǒuyìsi.','Tiếng Trung rất thú vị.'],
  ['老师','老師','lǎoshī','lao3 shi1','giáo viên',['giáo viên','thầy cô'],['teacher'],['noun'],1,19,'老',16,'王老师教汉语。','Wáng lǎoshī jiāo Hànyǔ.','Thầy Vương dạy tiếng Trung.'],
  ['时间','時間','shíjiān','shi2 jian1','thời gian',['thời gian'],['time'],['noun'],2,31,'日',17,'我没有时间。','Wǒ méiyǒu shíjiān.','Tôi không có thời gian.'],
  ['帮助','幫助','bāngzhù','bang1 zhu4','giúp đỡ',['giúp','giúp đỡ'],['to help'],['verb'],2,46,'巾',14,'你能帮助我吗？','Nǐ néng bāngzhù wǒ ma?','Bạn có thể giúp tôi không?'],
  ['问题','問題','wèntí','wen4 ti2','vấn đề; câu hỏi',['vấn đề','câu hỏi'],['question','problem'],['noun'],2,40,'门',21,'我有一个问题。','Wǒ yǒu yí ge wèntí.','Tôi có một câu hỏi.'],
  ['准备','準備','zhǔnbèi','zhun3 bei4','chuẩn bị',['chuẩn bị'],['to prepare'],['verb'],2,63,'冫',20,'我准备去上课。','Wǒ zhǔnbèi qù shàngkè.','Tôi chuẩn bị đi học.'],
  ['希望','希望','xīwàng','xi1 wang4','hy vọng',['hy vọng','mong muốn'],['to hope'],['verb'],2,54,'巾',18,'希望你每天进步。','Xīwàng nǐ měitiān jìnbù.','Hy vọng bạn tiến bộ mỗi ngày.'],
  ['环境','環境','huánjìng','huan2 jing4','môi trường',['môi trường','hoàn cảnh'],['environment'],['noun'],3,92,'王',31,'这里的环境很安静。','Zhèlǐ de huánjìng hěn ānjìng.','Môi trường ở đây rất yên tĩnh.'],
  ['提高','提高','tígāo','ti2 gao1','nâng cao',['nâng cao','cải thiện'],['to improve'],['verb'],3,76,'扌',21,'练习可以提高水平。','Liànxí kěyǐ tígāo shuǐpíng.','Luyện tập có thể nâng cao trình độ.'],
  ['经验','經驗','jīngyàn','jing1 yan4','kinh nghiệm',['kinh nghiệm'],['experience'],['noun'],3,88,'纟',18,'这是宝贵的经验。','Zhè shì bǎoguì de jīngyàn.','Đây là kinh nghiệm quý báu.'],
  ['交流','交流','jiāoliú','jiao1 liu2','giao lưu; trao đổi',['giao lưu','trao đổi'],['to communicate'],['verb'],3,101,'亠',16,'我们用汉语交流。','Wǒmen yòng Hànyǔ jiāoliú.','Chúng tôi giao tiếp bằng tiếng Trung.'],
  ['坚持','堅持','jiānchí','jian1 chi2','kiên trì',['kiên trì','duy trì'],['to persist'],['verb'],4,138,'土',18,'每天坚持学习。','Měitiān jiānchí xuéxí.','Hãy kiên trì học mỗi ngày.'],
  ['理解','理解','lǐjiě','li3 jie3','hiểu',['hiểu','lý giải'],['to understand'],['verb'],4,122,'王',26,'我理解你的意思。','Wǒ lǐjiě nǐ de yìsi.','Tôi hiểu ý của bạn.'],
  ['影响','影響','yǐngxiǎng','ying3 xiang3','ảnh hưởng',['ảnh hưởng'],['influence'],['noun','verb'],4,149,'彡',24,'睡眠影响记忆。','Shuìmián yǐngxiǎng jìyì.','Giấc ngủ ảnh hưởng đến trí nhớ.'],
  ['挑战','挑戰','tiǎozhàn','tiao3 zhan4','thử thách',['thử thách'],['challenge'],['noun','verb'],5,205,'扌',22,'这是一个新的挑战。','Zhè shì yí ge xīn de tiǎozhàn.','Đây là một thử thách mới.'],
  ['掌握','掌握','zhǎngwò','zhang3 wo4','nắm vững',['nắm vững','làm chủ'],['to master'],['verb'],5,217,'手',20,'我想掌握汉语。','Wǒ xiǎng zhǎngwò Hànyǔ.','Tôi muốn nắm vững tiếng Trung.'],
  ['效率','效率','xiàolǜ','xiao4 lv4','hiệu suất',['hiệu suất','hiệu quả'],['efficiency'],['noun'],5,232,'攵',19,'这个方法效率很高。','Zhège fāngfǎ xiàolǜ hěn gāo.','Phương pháp này rất hiệu quả.'],
  ['趋势','趨勢','qūshì','qu1 shi4','xu hướng',['xu hướng'],['trend'],['noun'],6,308,'走',20,'这是未来的趋势。','Zhè shì wèilái de qūshì.','Đây là xu hướng tương lai.'],
  ['策略','策略','cèlüè','ce4 lve4','chiến lược',['chiến lược'],['strategy'],['noun'],6,319,'竹',21,'我们需要新的策略。','Wǒmen xūyào xīn de cèlüè.','Chúng ta cần chiến lược mới.'],
  ['洞察','洞察','dòngchá','dong4 cha2','thấu hiểu',['thấu hiểu','nhìn thấu'],['insight'],['noun','verb'],'7-9',610,'氵',18,'她有敏锐的洞察力。','Tā yǒu mǐnruì de dòngchálì.','Cô ấy có khả năng quan sát nhạy bén.'],
] .map((item, index) => {
  const [simplified,traditional,pinyin,pinyinNumeric,primaryMeaningVi,meaningsVi,meaningsEn,pos,hskBand,frequencyRank,radical,strokeCount,chinese,examplePinyin,vietnamese] = item as [string,string,string,string,string,string[],string[],string[],Vocabulary['hskBand'],number,string,number,string,string,string];
  const id = `starter-${String(index + 1).padStart(3, '0')}`;
  return { id,simplified,traditional,pinyin,pinyinNumeric,primaryMeaningVi,meaningsVi,meaningsEn,pos,hskBand,frequencyRank,classifiers:[],radical,strokeCount,...meta,examples:[{id:`${id}-ex-1`,chinese,pinyin:examplePinyin,vietnamese,difficulty:typeof hskBand === 'number' ? hskBand : 7}] };
});

export const starterVocabulary: Vocabulary[] = words.map((word) => ({
  ...word,
  examples: word.examples.map((example) => ({ ...example, vocabularyId: word.id })),
}));

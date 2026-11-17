import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {matchingWords} from '../src/components/learning/WordMatch.tsx';
import {emptyPreparation,freshCourseCard,localDay} from '../src/services/preparationStorage.ts';
import {QUESTION_BANKS} from '../src/data/examCatalog.ts';
import {applyLearningSupplement} from '../src/services/learningSupplement.ts';

// Run with the existing TS loader; every browser uses a disposable profile, never user data.
process.env.TZ='Asia/Bangkok';
const output='.runtime/rich-learning-20261026',base='http://127.0.0.1:4173/';
fs.mkdirSync(output,{recursive:true});
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const words=applyLearningSupplement(read('public/data/hsk3-2025-1-words.json'),[],[],read('public/data/learning/level-1.json')).words;
const pairs=matchingWords(words);
const firstHanzi=read('public/data/hsk3-2025-1-hanzi.json')[0];
const strokeTotal=read('public'+firstHanzi.strokeUrl).strokes.length;
assert.equal(pairs.length,4);
const sample=(id,zh,vi)=>({...words[0],id,simplified:zh,primaryMeaningVi:vi});
const unique=matchingWords([sample('1','一',' Một '),sample('1','二','hai'),sample('2','三','MỘT'),sample('3','一','ba'),sample('4','四',''),sample('5','五','năm'),sample('6','六','sáu'),sample('7','七','bảy')]);
assert.deepEqual(unique.map(w=>w.id),['1','5','6','7'],'ambiguous labels and duplicate IDs must not become pairs');
assert.deepEqual(matchingWords([]),[]);
assert.equal(matchingWords([sample('1','一','một')],400).length,1);
assert.notDeepEqual(matchingWords(words,4).map(w=>w.id),pairs.map(w=>w.id),'next set rotates through source words');
const sheet=fs.readFileSync('src/styles/rich-learning.css','utf8');
assert(sheet.includes('@media(prefers-reduced-motion:reduce)'));
assert(!sheet.includes('infinite'),'decorative motion must end');

const css=selector=>({kind:'css',selector});
const wait=(step_id,selector)=>({step_id,action:'wait_for',locator:css(selector),state:'visible',timeout_ms:15000});
const click=(step_id,selector)=>({step_id,action:'click',locator:css(selector),timeout_ms:10000});
const press=(step_id,selector,key)=>({step_id,action:'press',locator:css(selector),key,timeout_ms:10000});
const goto=(step_id,query)=>({step_id,action:'goto',destination:{url:base+query},wait_until:'load',timeout_ms:15000});
const settle=step_id=>({step_id,action:'wait_for_timeout',duration_ms:800});
const select=(step_id,selector,value)=>({step_id,action:'select_option',locator:css(selector),value:{source:'literal',value},timeout_ms:10000});
const startCards=[wait('words_loaded','.course-item >> nth=0'),click('start_cards','.course-study-banner button:has-text("Học bằng thẻ")'),wait('card_front','.learning-flashcard[data-revealed=false]')];
const matchStart=[wait('words_loaded','.course-item >> nth=0'),click('start_match','.course-study-banner button:has-text("Ghép từ nhanh")'),wait('board','.match-board')];
const matchActions=[...matchStart,press('keyboard_word',`.word-match-character[data-match-id="${pairs[0].id}"]`,'Enter'),click('wrong_meaning',`.word-match-meaning[data-match-id="${pairs[1].id}"]`),wait('retry_feedback','.match-message.is-retry'),...pairs.flatMap((word,i)=>[click('word_'+i,`.word-match-character[data-match-id="${word.id}"]`),click('meaning_'+i,`.word-match-meaning[data-match-id="${word.id}"]`)]),wait('all_pairs_done','.match-completion'),settle('matched_settled')];
const now=new Date(),today=localDay(now),yesterday=new Date(now);yesterday.setDate(yesterday.getDate()-1);
const prep=emptyPreparation();prep.profile.onboarding='done';
prep.cards=Object.fromEntries(words.slice(0,2).map(w=>[w.id,{...freshCourseCard(w.id,w.level),learned:true}]));
prep.events=words.slice(0,2).map((w,i)=>({id:'test-word-'+i,kind:'word-learn',entityId:w.id,at:now.toISOString(),count:1,minutes:0}));
prep.events.push({id:'test-hanzi',kind:'hanzi',entityId:'fixture',at:yesterday.toISOString(),count:1,minutes:0});
prep.plans[today]={day:today,createdAt:new Date(now.getTime()-3600000).toISOString(),skipped:['grammar'],tasks:[{id:'words',title:'Học hai từ',kind:'word-learn',count:2,minutes:3,page:'vocab'},{id:'grammar',title:'Ôn ngữ pháp',kind:'grammar',count:1,minutes:3,page:'grammar'},{id:'practice',title:'Luyện đọc',kind:'practice',count:4,minutes:4,page:'parts'}]};
const makeAttempt=(id,daysAgo,durationSeconds)=>{
 const finished=new Date(now);finished.setDate(finished.getDate()-daysAgo);
 return{id,examId:QUESTION_BANKS[0].id,mode:'practice',answers:{},flaggedQuestionIds:[],selfRatings:{},startedAt:new Date(finished.getTime()-durationSeconds*1000).toISOString(),finishedAt:finished.toISOString(),durationSeconds};
};
const study={schemaVersion:3,sessions:[],attempts:[makeAttempt('rich-today-a',0,120),makeAttempt('rich-today-b',0,240),makeAttempt('rich-yesterday',1,90),makeAttempt('rich-older',10,60)],reviewItems:[],vocabulary:{},wordEntries:[]};
const seeded=(name,value)=>({origin:base,entries:[{name,value:{source:'literal',value:JSON.stringify(value)}}]});
const homeActions=[wait('home_loaded','.level-learning-progress'),wait('goal_truth','.daily-goal:has-text("1/3 nhiệm vụ")'),click('level_two','.level-journey button >> nth=1'),wait('level_two_heading','.journey-level-number:has-text("HSK 2")'),press('level_one_keyboard','.level-journey button >> nth=0','Enter'),click('previous_day','.interactive-week button >> nth=5'),wait('previous_activity','.week-day-detail:has-text("1 hoạt động")'),click('today','.interactive-week button >> nth=6'),wait('today_activity','.week-day-detail:has-text("2 hoạt động")'),press('back_to_top','body','Control+Home'),settle('home_settled')];
const hanziBase=[wait('hanzi_loaded','.course-item >> nth=0'),click('open_hanzi','.course-item >> nth=0'),wait('strokes_loaded','.stroke-controls button.btn-primary:not(:disabled)'),press('seek_start','.stroke-scrubber input','Home'),wait('zero_strokes','.stroke-heading output:has-text("Nét 0/")'),press('seek_one','.stroke-scrubber input','ArrowRight'),wait('one_stroke','.stroke-heading output:has-text("Nét 1/")'),click('next_stroke','.stroke-controls button:has-text("Nét sau")'),wait('two_strokes','.stroke-heading output:has-text("Nét 2/")'),click('previous_stroke','.stroke-controls button:has-text("Nét trước")'),click('play_strokes','.stroke-controls button.btn-primary'),wait('playing','.stroke-controls button[aria-pressed=true]'),click('pause_strokes','.stroke-controls button.btn-primary'),wait('paused','.stroke-controls button[aria-pressed=false]'),select('fast_speed','.stroke-speed select','350'),press('replay_from_start','.stroke-scrubber input','Home'),click('play_to_end','.stroke-controls button.btn-primary'),wait('all_strokes_played','.stroke-heading output:has-text('+JSON.stringify('Nét '+strokeTotal+'/'+strokeTotal)+')'),wait('auto_stopped','.stroke-controls button[aria-pressed=false]'),press('seek_end','.stroke-scrubber input','End'),settle('hanzi_settled')];
const cases=[
 {name:'home-desktop',width:1440,height:1000,storage:[seeded('hsk-preparation-v1',prep)],actions:homeActions},
 {name:'home-mobile',width:390,height:844,storage:[seeded('hsk-preparation-v1',prep)],actions:homeActions},
 {name:'flashcards-desktop',width:1440,height:1000,query:'?view=vocab&level=HSK%201',actions:[...startCards,...Array.from({length:10},(_,i)=>[press('flip_'+i,'.learning-flashcard','Enter'),wait('back_'+i,'.learning-flashcard[data-revealed=true]'),click('grade_'+i,'.flashcard-grades button[data-grade="'+[1,3,4,5][i%4]+'"]')]).flat(),wait('review_complete','.review-completion'),settle('review_settled')]},
 {name:'flashcards-mobile-reduced',width:320,height:740,motion:'reduce',query:'?view=vocab&level=HSK%201',actions:[...startCards,press('reduce_flip','.learning-flashcard','Enter'),wait('reduce_back','.learning-flashcard[data-revealed=true]'),wait('reduce_answer_accessible','.learning-flashcard[aria-label*="yêu"]'),press('reduce_grade','.flashcard-grades button[data-grade="5"]','Enter'),wait('reduce_next','.review-progress:has-text("đã lưu 1 từ")'),press('reduce_next_flip','.learning-flashcard','Enter'),settle('reduce_settled')]},
 {name:'flashcards-mobile',width:390,height:844,query:'?view=vocab&level=HSK%201',actions:[...startCards,press('flip','.learning-flashcard','Enter'),wait('back','.learning-flashcard[data-revealed=true]'),wait('accessible_meaning','.learning-flashcard[aria-label*="yêu"]'),click('grade','.flashcard-grades button[data-grade="4"]'),wait('next_card','.review-progress:has-text("đã lưu 1 từ")'),goto('reload','?view=vocab&level=HSK%201'),wait('persisted_learned','.course-study-banner:has-text("1/300 từ đã học")'),click('study_again','.course-study-banner button:has-text("Học bằng thẻ")'),click('flip_again','.learning-flashcard'),wait('revealed_again','.learning-flashcard[data-revealed=true]'),settle('mobile_settled')]},
 {name:'matching-desktop',width:1440,height:1000,query:'?view=vocab&level=HSK%201',actions:matchActions},
 {name:'matching-to-flashcards',width:390,height:844,query:'?view=vocab&level=HSK%201',actions:[...matchActions,click('transfer_to_cards','.word-match button:has-text("Ôn các từ này bằng thẻ")'),wait('four_cards','.review-progress:has-text("Thẻ 1/4")'),press('flip_transferred','.learning-flashcard','Enter'),click('grade_transferred','.flashcard-grades button[data-grade="4"]'),wait('second_transferred_card','.review-progress:has-text("Thẻ 2/4")'),settle('transferred_settled')]},
 {name:'matching-mobile-reduced',width:320,height:740,motion:'reduce',query:'?view=vocab&level=HSK%201',actions:[...matchActions,click('new_set','.word-match button:has-text("Đổi bộ ghép")'),wait('reset_progress','.match-progress:has-text("0/4 cặp")'),press('select_new_pair','.word-match-character >> nth=0','Enter'),settle('new_set_settled')]},
 {name:'hanzi-desktop',width:1440,height:1000,query:'?view=hanzi&level=HSK%201',actions:[...hanziBase,click('draw_point','.write-canvas'),click('save_hanzi','.rich-hanzi button:has-text("Đã luyện chữ này")'),wait('saved_hanzi','.hanzi-completion'),settle('saved_settled')]},
 {name:'hanzi-mobile-reduced',width:320,height:740,motion:'reduce',query:'?view=hanzi&level=HSK%201',actions:hanziBase},
 {name:'progress-desktop',width:1440,height:1000,query:'?view=progress',storage:[seeded('hsk-study-data-v1',study)],actions:[wait('chart_loaded','.interactive-bars'),wait('today_counts','.dashboard-day-detail:has-text("2 lượt làm · 6 phút")'),click('count_metric','.dashboard-chart-controls button:has-text("Lượt làm")'),click('fourteen_days','.dashboard-chart-controls button:has-text("14 ngày")'),wait('fourteen_bars','.interactive-bars[data-range="14"]'),press('yesterday_keyboard','.interactive-bars button >> nth=12','Enter'),wait('yesterday_detail','.dashboard-day-detail:has-text("1 lượt làm · 1.5 phút")'),settle('chart_settled')]},
 {name:'progress-mobile-empty',width:390,height:844,motion:'reduce',query:'?view=progress',actions:[wait('chart_loaded','.interactive-bars'),click('range_empty','.dashboard-chart-controls button:has-text("14 ngày")'),click('metric_empty','.dashboard-chart-controls button:has-text("Lượt làm")'),press('first_day_keyboard','.interactive-bars button >> nth=0','Enter'),wait('empty_detail','.dashboard-day-detail:has-text("0 lượt làm · 0 phút")'),settle('empty_settled')]},
 {name:'practice-desktop',width:1440,height:1000,query:'?view=practice&level=HSK%201',actions:[wait('scenes_loaded','.journey-training-card >> nth=4'),wait('waveform','.scene-headphones'),wait('sentence_tokens','.scene-path'),wait('listening_available','.journey-training-card >> nth=0 >> button:not(:disabled)'),press('focus_listening','.journey-training-card >> nth=0 >> button','ArrowRight'),settle('scenes_settled')]},
 {name:'practice-mobile',width:390,height:844,query:'?view=practice&level=HSK%201',actions:[wait('scenes_loaded','.scene-headphones'),settle('scenes_settled')]},
 {name:'result-saved',width:1440,height:1000,query:'?view=progress',storage:[seeded('hsk-study-data-v1',study)],actions:[wait('results_available','.dashboard-recent-row >> nth=0'),click('open_saved_result','.dashboard-recent-row >> nth=0 >> button'),wait('completion_mark','.result-completion-heading .completion-mark'),wait('score_still_real','.exam-result-counts'),settle('result_settled')]},
];
const filter=process.argv.slice(2),rows=[];
for(const c of cases.filter(c=>!filter.length||filter.includes(c.name))){
 const path=output+'/'+c.name,scenario={browser:{mode:'launch',executable_path:'C:/Program Files/Google/Chrome/Application/chrome.exe'},environment:{locale:'vi-VN',timezone:'Asia/Bangkok',viewport:{width:c.width,height:c.height},reduced_motion:c.motion??'no-preference'},start_url:{url:base+(c.query??'')},storage:{local_storage:c.storage??[]},actions:c.actions,capture:{after_each_step:['url','accessibility','storage'],at_end:['url','accessibility','storage','screenshot'],events:['console']}};
 fs.writeFileSync(path+'-scenario.json',JSON.stringify(scenario,null,2));
 try{
  const run=spawnSync(process.execPath,['../Rea-HSK-Reference/scripts/rea.mjs','capture-browser-scenario',path+'-scenario.json','--format','json','--full-output'],{encoding:'utf8',timeout:120000,maxBuffer:24*1024*1024});
  fs.writeFileSync(path+'-evidence.json',run.stdout??'');
  assert.equal(run.status,0,c.name+' CLI: '+run.stderr);
  const envelope=JSON.parse(run.stdout);assert.equal(envelope.ok,true,c.name+' failed: '+JSON.stringify(envelope.error));
  const result=envelope.data.normalized_result;
  const last=result.steps.at(-1),text=last.artifacts.accessibility.value.text;
  if(last.artifacts.screenshot?.value?.data_base64)fs.writeFileSync(path+'.png',Buffer.from(last.artifacts.screenshot.value.data_base64,'base64'));
  for(const s of result.steps)assert.equal(s.status,'completed',c.name+' '+s.step_id+' '+JSON.stringify(s.error));
  assert.equal(result.events.items.filter(e=>e.kind==='console'&&e.level==='error').length,0,c.name+' console errors');
  const storageAt=id=>result.steps.find(s=>s.step_id===id)?.artifacts.storage.value.local_storage.find(s=>s.name==='hsk-preparation-v1');
  if(c.name.startsWith('home-')){assert(text.includes('1/3 nhiệm vụ'),'completed tasks exclude skipped tasks');assert(text.includes('2 từ đã đánh dấu học'),'level uses stored learned count');assert(text.includes('1 đã bỏ qua'),'skipped count stays visible');}
  if(c.name==='flashcards-desktop')assert(text.includes('Hoàn tất 10 thẻ!'));
  if(c.name==='flashcards-mobile'){assert(text.includes('Bạn nhớ từ này ở mức nào?'));assert.deepEqual(storageAt('next_card'),storageAt('persisted_learned'),'SM2 record must survive reload');assert(storageAt('next_card'),'scheduled card must be persisted');}
  if(c.name==='matching-desktop')assert(text.includes('Đã ghép hết 4 cặp!'));
  if(c.name.startsWith('matching-'))assert.deepEqual(storageAt('board'),storageAt('matched_settled'),'matching alone must not alter learning records');
  if(c.name==='matching-to-flashcards')assert(storageAt('second_transferred_card'),'grading transferred cards saves learning records');
  if(c.name==='progress-desktop'){assert(text.includes('14 ngày gần đây'));assert(text.includes('1 lượt làm · 1.5 phút'));assert(text.includes('8.5'));}
  if(c.name==='progress-mobile-empty')assert(text.includes('Chưa có bài đã nộp trong 14 ngày này'));
  if(c.name==='hanzi-desktop')assert(text.includes('Đã ghi nhận lần luyện chữ'));
  if(c.name==='result-saved'){assert(text.includes('ĐÃ LƯU LƯỢT LÀM'));assert(!text.includes('100%'));}
  assert(last.artifacts.screenshot.value.data_base64);fs.writeFileSync(path+'.png',Buffer.from(last.artifacts.screenshot.value.data_base64,'base64'));
  rows.push({name:c.name,result:'PASS',viewport:[c.width,c.height],motion:scenario.environment.reduced_motion,steps:result.steps.length});
  console.log(c.name+' PASS');
 }catch(error){rows.push({name:c.name,result:'FAIL',error:String(error)});console.error(c.name+' FAIL: '+error.message);}
}
const report={result:rows.every(r=>r.result==='PASS')?'PASS':'FAIL',date:new Date().toISOString(),fixtures:'Home and progress cases seed synthetic local records only inside disposable REA profiles. Vocabulary and Hanzi use shipped curriculum.',checks:['unique matching labels and next sets','keyboard and touch-sized UI, 320/390/1440 px','SM2 persistence across reload','matching does not write learning records','actual skipped/completed task counts','7/14-day chart and zero-data states','manual Hanzi controls and save acknowledgement','result feedback does not invent a score'],limits:['TTS playback depends on installed Mandarin voice and is not asserted','Hanzi pointer check is a click; freehand stroke accuracy is not graded','Reduced motion flows checked; no user Cốc Cốc control'],rows};
const reportPath=output+(filter.length?'/partial-check.json':'/check.json');
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({result:report.result,scenarios:rows.length,steps:rows.reduce((n,r)=>n+(r.steps??0),0),report:reportPath}));
assert.equal(report.result,'PASS');

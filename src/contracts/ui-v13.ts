/** Codex-owned. Presentation consumes these DTOs; no database, transport or persistence types. */
export const UI_CONTRACT_VERSION = '13.0' as const;
export const CONTRACT_STATUS = 'FROZEN' as const;
export type LevelId = '1'|'2'|'3'|'4'|'5'|'6'|'7-9';
export type SkillId = 'listening'|'reading'|'writing'|'speaking'|'translation'|'all';
export type EntityId = string;
export type QuestionAnswerStatus = 'correct'|'incorrect'|'unanswered'|'ungraded';
export type CommandOutcome = Readonly<{status:'applied'|'ignored'|'rejected';message?:string}>;
export type CallbackResult = void|CommandOutcome|Promise<void|CommandOutcome>;
export type ViewState<T> =
 | Readonly<{status:'loading';label:string}>
 | Readonly<{status:'error';message:string;retryable:boolean}>
 | Readonly<{status:'empty';title:string;description:string}>
 | Readonly<{status:'ready';data:T}>;
export interface AccessibilityVM {readonly headingId:string;readonly label:string;readonly live:'off'|'polite'|'assertive'}
export interface AvailabilityVM {readonly available:boolean;readonly reason:string|null;readonly count:number|null}
export interface ContentStatusVM {
 readonly environment:'preview'|'beta'|'published'|'reference';readonly label:string;
 readonly humanReviewed:boolean;readonly published:boolean;
 readonly rights:'notApplicable'|'unknown'|'privateAllowed'|'publicAllowed';
}
export interface ScreenMetaVM {readonly contractVersion:'13.0';readonly level:LevelId;readonly content:ContentStatusVM;readonly a11y:AccessibilityVM}
export type NavigationCommand =
 | Readonly<{kind:'page';page:'today'|'levelHub'|'vocabulary'|'grammar'|'practice'|'mistakes'|'history'|'settings'|'progress';level:LevelId}>
 | Readonly<{kind:'word';wordId:EntityId;level:LevelId}>
 | Readonly<{kind:'grammar';grammarId:EntityId;level:LevelId}>
 | Readonly<{kind:'practice';level:LevelId;skill:SkillId;partId?:string;grammarId?:EntityId;wordId?:EntityId}>
 | Readonly<{kind:'resume';sessionId:EntityId}>
 | Readonly<{kind:'result';attemptId:EntityId}>;
export interface ActionVM {readonly id:string;readonly label:string;readonly availability:AvailabilityVM;readonly command:NavigationCommand}
export interface ScreenCallbacks {readonly onNavigate:(command:NavigationCommand)=>CallbackResult;readonly onRetry:()=>CallbackResult}
export interface CounterVM {readonly id:string;readonly label:string;readonly value:number|null;readonly unit:string;readonly unavailableReason:string|null}
export interface TaskVM {readonly id:string;readonly title:string;readonly completed:number;readonly count:number;readonly minutes:number;readonly skipped:boolean;readonly reason:string|null;readonly action:ActionVM}
export interface TodayVM {
 readonly meta:ScreenMetaVM;readonly title:string;readonly dailyMinutes:number;readonly goal:string;
 readonly dateLabel:string;readonly daysRemaining:number|null;readonly syllabusLabel:string;
 readonly counters:readonly CounterVM[];readonly tasks:readonly TaskVM[];readonly primary:ActionVM|null;
 readonly weakness:Readonly<{label:string;sampleSize:number;accuracyPercent:number|null;action:ActionVM|null}>|null;
 readonly unavailable:readonly Readonly<{skill:SkillId;reason:string}>[];
}
export interface TodayProps extends ScreenCallbacks {readonly state:ViewState<TodayVM>;readonly onSkipTask:(taskId:EntityId)=>CallbackResult}
export interface MockReadinessVM {
 readonly candidatePlanReady:boolean;readonly internalFixtureReady:boolean|null;
 readonly privatePracticeReady:boolean;readonly publicReleaseReady:boolean;
 readonly label:string;readonly blockers:readonly Readonly<{id:string;label:string;count:number;nextAction:string}>[];
 readonly writingScoring:'ungraded'|'humanScored'|'unavailable';readonly sourceVerification:string;
}
export interface LevelHubVM {readonly meta:ScreenMetaVM;readonly title:string;readonly counters:readonly CounterVM[];readonly actions:readonly ActionVM[];readonly mock:MockReadinessVM}
export interface LevelHubProps extends ScreenCallbacks {readonly state:ViewState<LevelHubVM>}
export interface ExampleVM {readonly zh:string;readonly pinyin:string;readonly vi:string;readonly content:ContentStatusVM}
export interface AudioVM {
 readonly id:string;readonly purpose:'vocabularyTts'|'guidedTts'|'practice'|'exam';
 readonly state:'available'|'unavailable'|'loading'|'playing'|'paused'|'error'|'previewOnly';
 readonly label:string;readonly reason:string|null;readonly canPlay:boolean;readonly canPause:boolean;readonly canRetry:boolean;
 readonly durationSeconds:number|null;readonly currentSeconds:number|null;readonly playsRemaining:number|null;
 readonly canSeek:boolean;readonly canChangeRate:boolean;readonly rate:number;readonly sourceLabel:string;
}
export interface AudioCallbacks {readonly onPlay:()=>CallbackResult;readonly onPause:()=>CallbackResult;readonly onRetry:()=>CallbackResult;readonly onSeek:(seconds:number)=>CallbackResult;readonly onRateChange:(rate:number)=>CallbackResult}
export interface AudioPlayerProps extends AudioCallbacks {readonly audio:AudioVM}
export interface VocabularyItemVM {
 readonly id:EntityId;readonly hanzi:string;readonly traditional:string;readonly pinyin:string;readonly meaningVi:string;
 readonly partOfSpeech:readonly string[];readonly favorite:boolean;readonly learned:boolean;readonly dueAt:string|null;
 readonly content:ContentStatusVM;
}
export interface VocabularyExplorerVM {
 readonly meta:ScreenMetaVM;readonly items:readonly VocabularyItemVM[];readonly total:number;readonly filteredTotal:number;
 readonly query:string;readonly filter:'all'|'new'|'learned'|'favorite'|'due'|'weak';readonly page:number;readonly pageSize:number;
 readonly dueCount:number;readonly review:ActionVM|null;readonly availableFilters:readonly string[];
 readonly learnedCount?:number;
}
export interface VocabularyExplorerProps extends ScreenCallbacks {
 readonly state:ViewState<VocabularyExplorerVM>;readonly onQueryChange:(value:string)=>CallbackResult;
 readonly onFilterChange:(filter:VocabularyExplorerVM['filter'])=>CallbackResult;readonly onPageChange:(page:number)=>CallbackResult;
 readonly onOpenWord:(id:EntityId)=>CallbackResult;
 /** Optional callbacks for the handed-off card actions; existing SRS/audio owners implement them. */
 readonly onFavorite?:(id:EntityId)=>CallbackResult;readonly onLearnWord?:(id:EntityId)=>CallbackResult;
 readonly onPlayWord?:(id:EntityId)=>CallbackResult;readonly onStartReview?:()=>CallbackResult;readonly onStartQuiz?:()=>CallbackResult;
}
export interface VocabularyDetailVM {
 readonly meta:ScreenMetaVM;readonly word:VocabularyItemVM;readonly examples:readonly ExampleVM[];
 readonly otherMeanings:readonly string[];readonly source:Readonly<{label:string;url:string|null;notes:readonly string[]}>;
 readonly practice:ActionVM|null;readonly audio:AudioVM;readonly previousId:EntityId|null;readonly nextId:EntityId|null;
}
export interface VocabularyDetailProps extends ScreenCallbacks {
 readonly state:ViewState<VocabularyDetailVM>;readonly onClose:()=>CallbackResult;readonly onFavorite:(id:EntityId)=>CallbackResult;
 readonly onReview:(id:EntityId,grade:1|3|4|5)=>CallbackResult;readonly onDefer:(id:EntityId)=>CallbackResult;
 readonly onMove:(id:EntityId)=>CallbackResult;readonly audioCallbacks:AudioCallbacks;
}
export interface GrammarItemVM {
 readonly id:EntityId;readonly pattern:string;readonly category:string;readonly title:string;readonly meaningVi:string;
 readonly hasLesson:boolean;readonly read:boolean;readonly independentCount:number;readonly guidedCount:number;
 readonly evidence:Readonly<{answered:number;correct:number;mastered:boolean}>;readonly content:ContentStatusVM;
}
export interface GrammarCatalogVM {readonly meta:ScreenMetaVM;readonly items:readonly GrammarItemVM[];readonly totalTaxonomy:number;readonly completeLessons:number;readonly query:string;readonly includeTaxonomy:boolean;readonly page:number;readonly pageSize:number;readonly filteredTotal:number;readonly masteredCount?:number}
export interface GrammarCatalogProps extends ScreenCallbacks {readonly state:ViewState<GrammarCatalogVM>;readonly onQueryChange:(value:string)=>CallbackResult;readonly onIncludeTaxonomyChange:(value:boolean)=>CallbackResult;readonly onPageChange:(page:number)=>CallbackResult;readonly onOpenLesson:(id:EntityId)=>CallbackResult}
export interface GrammarLessonVM {
 readonly meta:ScreenMetaVM;readonly grammar:GrammarItemVM;readonly formula:string;readonly usage:string;
 readonly explanation:string;readonly examples:readonly ExampleVM[];readonly commonMistakes:readonly string[];
 readonly comparisons:readonly string[];readonly practice:ActionVM|null;readonly favorite:boolean;
 readonly source:Readonly<{label:string;url:string|null;notes:readonly string[]}>;
}
export interface GrammarLessonProps extends ScreenCallbacks {readonly state:ViewState<GrammarLessonVM>;readonly onClose:()=>CallbackResult;readonly onMarkRead:(id:EntityId)=>CallbackResult;readonly onFavorite:(id:EntityId)=>CallbackResult;readonly onSpeakExample:(grammarId:EntityId,index:number)=>CallbackResult}
export interface PracticePartVM {readonly id:string;readonly skill:SkillId;readonly title:string;readonly total:number;readonly available:number;readonly objective:number;readonly ungraded:number;readonly completed:number;readonly action:ActionVM}
export interface PracticeHubVM {readonly meta:ScreenMetaVM;readonly parts:readonly PracticePartVM[];readonly mixed:ActionVM|null;readonly guidedListening:ActionVM|null;readonly mock:MockReadinessVM;readonly notice:string}
export interface PracticeHubProps extends ScreenCallbacks {readonly state:ViewState<PracticeHubVM>}
export interface QuestionImageVM {readonly id:string;readonly alt:string;readonly width:number;readonly height:number;readonly state:'loading'|'available'|'error'|'unavailable';readonly displayUrl:string|null;readonly retryable:boolean}
export interface OptionVM {readonly id:string;readonly text:string;readonly pinyin:string|null;readonly image:QuestionImageVM|null;readonly selected:boolean;readonly disabled:boolean}
export interface FeedbackVM {readonly status:QuestionAnswerStatus;readonly explanation:string;readonly solutionText:string|null;readonly relatedWordIds:readonly EntityId[];readonly relatedGrammarIds:readonly EntityId[];readonly rubric:readonly string[]}
/** Active question DTO deliberately has no answer key, transcript, prompt translation or sample answer. */
export interface QuestionVM {
 readonly meta:ScreenMetaVM;readonly id:EntityId;readonly revision:number|null;readonly number:number;readonly partId:string|null;
 readonly skill:SkillId;readonly instruction:string;readonly promptZh:string;readonly contextZh:string|null;
 readonly pinyin:string|null;readonly interaction:'choice'|'matching'|'text'|'writing';readonly options:readonly OptionVM[];
 readonly matchingItems:readonly Readonly<{id:string;text:string;selectedOptionId:string|null}>[];
 readonly image:QuestionImageVM|null;readonly answerText:string;readonly readOnly:boolean;readonly flagged:boolean;
 readonly audio:AudioVM|null;readonly feedback:FeedbackVM|null;
}
export interface QuestionPresentationProps {
 readonly state:ViewState<QuestionVM>;readonly onChoose:(optionId:string)=>CallbackResult;
 readonly onMatch:(itemId:string,optionId:string|null)=>CallbackResult;readonly onTextChange:(value:string)=>CallbackResult;
 readonly onFlag:()=>CallbackResult;readonly onCheck:()=>CallbackResult;readonly onRetryImage:(imageId:string)=>CallbackResult;
 readonly audioCallbacks:AudioCallbacks|null;
}
export interface WritingVM {
 readonly questionId:EntityId;readonly promptZh:string;readonly pinyinHint:string|null;readonly value:string;
 readonly characterCount:number;readonly hanziCount:number;readonly maxLength:number;readonly readOnly:boolean;readonly composing:boolean;
 readonly saveState:'idle'|'dirty'|'saving'|'saved'|'error';readonly saveLabel:string;
 readonly scoring:'ungraded'|'humanScored';readonly scoringLabel:string;readonly help:string;readonly error:string|null;
}
export interface WritingCallbacks {
 readonly onInput:(value:string)=>CallbackResult;readonly onCompositionStart:()=>CallbackResult;
 readonly onCompositionEnd:(value:string)=>CallbackResult;readonly onSave:()=>CallbackResult;
}
export interface WritingWorkspaceProps extends WritingCallbacks {readonly writing:WritingVM}
export interface TimerVM {readonly label:string;readonly remainingSeconds:number|null;readonly state:'untimed'|'running'|'paused'|'expired';readonly reason:string|null;readonly authority:'platformPolicy'|'verifiedRules'}
export interface NavigatorItemVM {readonly questionId:EntityId;readonly index:number;readonly number:number;readonly section:string;readonly answered:boolean;readonly flagged:boolean;readonly current:boolean;readonly availability:AvailabilityVM}
export interface ExamProgressVM {readonly sessionId:EntityId;readonly current:number;readonly total:number;readonly answered:number;readonly timer:TimerVM;readonly items:readonly NavigatorItemVM[];readonly previous:AvailabilityVM;readonly next:AvailabilityVM;readonly submit:AvailabilityVM;readonly saving:boolean;readonly recoveryReason:string|null}
export interface ExamProgressProps {readonly progress:ExamProgressVM;readonly onNavigateQuestion:(index:number)=>CallbackResult;readonly onPrevious:()=>CallbackResult;readonly onNext:()=>CallbackResult;readonly onOpenSubmit:()=>CallbackResult;readonly onExit:()=>CallbackResult}
export interface SubmitDialogVM {readonly open:boolean;readonly title:string;readonly description:string;readonly answered:number;readonly unanswered:number;readonly ungraded:number;readonly busy:boolean;readonly canConfirm:boolean;readonly error:string|null}
export interface SubmitDialogProps {readonly dialog:SubmitDialogVM;readonly onConfirm:()=>CallbackResult;readonly onCancel:()=>CallbackResult}
export interface ResultItemVM {readonly questionId:EntityId;readonly number:number;readonly skill:SkillId;readonly status:QuestionAnswerStatus;readonly seconds:number|null;readonly feedback:FeedbackVM|null}
export interface ResultVM {
 readonly meta:ScreenMetaVM;readonly attemptId:EntityId;readonly title:string;readonly durationSeconds:number;
 readonly counts:Readonly<Record<QuestionAnswerStatus,number>>;readonly accuracyPercent:number|null;
 readonly gradedCount:number;readonly accuracyLabel:string;readonly scoreAuthority:'platformPractice';
 readonly items:readonly ResultItemVM[];readonly sections:readonly Readonly<{skill:SkillId;correct:number;incorrect:number;unanswered:number;ungraded:number;gradedCount:number;accuracyPercent:number|null}>[];
 readonly actions:readonly ActionVM[];readonly officialReadiness:Readonly<{score:number|null;reason:string}>;
}
export interface ResultProps extends ScreenCallbacks {readonly state:ViewState<ResultVM>;readonly onReviewQuestion:(id:EntityId)=>CallbackResult}
export interface MistakeItemVM {readonly reviewId:EntityId;readonly questionId:EntityId;readonly title:string;readonly skill:SkillId;readonly reason:'incorrect'|'flagged'|'self-review'|'unanswered';readonly dueAt:string;readonly relatedWordIds:readonly EntityId[];readonly relatedGrammarIds:readonly EntityId[];readonly availableIndependent:number;readonly action:ActionVM|null;readonly reviewAvailability?:AvailabilityVM}
export interface MistakeReviewVM {readonly meta:ScreenMetaVM;readonly items:readonly MistakeItemVM[];readonly total:number;readonly dueCount:number;readonly unavailableCount:number;readonly notice:string}
export interface MistakeReviewProps extends ScreenCallbacks {readonly state:ViewState<MistakeReviewVM>;readonly onMarkReviewed:(reviewId:EntityId)=>CallbackResult;readonly onSetReason:(reviewId:EntityId,reason:string)=>CallbackResult;readonly onReviewQuestion?:(reviewId:EntityId)=>CallbackResult}
/** Optional flag selects presentation only; it never selects a database, owner or persistence key. */
export interface UIV13FeatureState {readonly enabled:boolean;readonly source:'defaultOff'|'explicitPreview';readonly contractVersion:'13.0'}

/** Codex owns this contract. Gemini owns presentation only. No IO, database or timers. */
import type {AccessibilityVM, AvailabilityVM, CallbackResult, ContentStatusVM, LevelId, SkillId, ViewState, QuestionImageVM, FeedbackVM, ResultVM, AudioVM, AudioCallbacks, WritingVM} from './ui-v13';
export type {ViewState, CallbackResult, AvailabilityVM, ContentStatusVM, LevelId, SkillId, QuestionImageVM, AudioCallbacks};
export const UI_CONTRACT_VERSION = '14.0' as const;
export const CONTRACT_STATUS = 'FROZEN' as const;
export type AttemptMode = 'practice'|'timed';
export type CatalogScope = 'public'|'privatePreview';
export type SyllabusEdition = 'hsk2-2015'|'hsk3-2021'|'hsk3-2025'|'unverified';
export interface VMBase {
 readonly contractVersion:'14.0';readonly a11y:AccessibilityVM;
 readonly availability:AvailabilityVM;readonly content:ContentStatusVM;
}
export interface PresentationProps<T> {readonly state:ViewState<T>;readonly onRetry:()=>CallbackResult}
export interface EvidenceDimensionVM {
 readonly status:'verified'|'partial'|'unknown'|'restricted'|'notApplicable';
 readonly evidenceUrl:string|null;readonly checkedAt:string|null;readonly note:string;
}
export interface ContentEvidenceVM {
 readonly provenance:EvidenceDimensionVM;readonly syllabus:EvidenceDimensionVM;
 readonly format:EvidenceDimensionVM;readonly technical:EvidenceDimensionVM;
 readonly language:EvidenceDimensionVM;readonly rights:EvidenceDimensionVM;
 readonly publication:EvidenceDimensionVM;
}
export interface ExamModeVM extends VMBase {
 readonly id:AttemptMode;readonly label:string;readonly description:string;
 readonly selected:boolean;readonly feedbackPolicy:'afterCheck'|'afterSubmit';
 readonly timingPolicy:'untimed'|'engine';readonly authority:'platformPolicy'|'verifiedRules';
}
export interface ExamCardVM extends VMBase {
 readonly id:string;readonly title:string;readonly version:string;readonly level:LevelId;
 readonly syllabusVersion:SyllabusEdition;readonly type:'quick'|'mini'|'full';readonly scope:CatalogScope;
 readonly questionCount:number;readonly durationMinutes:number|null;readonly skillLabels:readonly string[];
 readonly formatLabel:string;readonly evidence:ContentEvidenceVM;
 readonly resume:Readonly<{sessionId:string;mode:AttemptMode;answered:number;total:number}>|null;
 readonly completedAttemptCount:number;readonly modes:readonly ExamModeVM[];
 readonly canOpen:boolean;readonly canStart:boolean;readonly canResume:boolean;
 readonly unavailableReasons:readonly string[];
}
export interface CatalogFilters {
 readonly query:string;readonly level:LevelId|'all';readonly type:'quick'|'mini'|'full'|'all';
 readonly status:'all'|'available'|'blocked'|'inProgress';readonly syllabusVersion:SyllabusEdition|'all';
}
export interface ExamCatalogVM extends VMBase {
 readonly title:string;readonly scope:CatalogScope;readonly filters:CatalogFilters;
 readonly cards:readonly ExamCardVM[];readonly total:number;readonly filteredTotal:number;
 readonly availableCount:number;readonly inProgressCount:number;
}
export interface ExamCatalogProps extends PresentationProps<ExamCatalogVM> {
 readonly onFilterChange:(filters:CatalogFilters)=>CallbackResult;
 readonly onOpenExam:(examId:string)=>CallbackResult;readonly onResumeAttempt:(sessionId:string)=>CallbackResult;
}
export interface ExamIntroVM extends VMBase {
 readonly exam:ExamCardVM;readonly selectedMode:AttemptMode;readonly rules:readonly string[];
 readonly playbackPolicy:Readonly<{kind:'none'|'tts'|'file';delivery:'question'|'section';maxPlays:number|null;canSeek:boolean;canChangeRate:boolean;authority:'platformPolicy'|'verifiedRules'}>;
 readonly sections:readonly Readonly<{id:string;skill:SkillId;label:string;questionCount:number;durationMinutes:number|null}>[];
 readonly start:AvailabilityVM;readonly resumeSessionId:string|null;
 readonly ruleAcknowledged:boolean;readonly startBusy:boolean;readonly error:string|null;
}
export interface ExamIntroProps extends PresentationProps<ExamIntroVM> {
 readonly onModeChange:(mode:AttemptMode)=>CallbackResult;readonly onRulesAcknowledged:(acknowledged:boolean)=>CallbackResult;
 readonly onStartRequested:(examId:string,mode:AttemptMode)=>CallbackResult;
 readonly onResumeRequested:(sessionId:string)=>CallbackResult;readonly onBack:()=>CallbackResult;
}
export interface SectionInstructionVM extends VMBase {
 readonly id:string;readonly sessionId:string;readonly sectionIndex:number;readonly skill:SkillId;
 readonly title:string;readonly instructions:readonly string[];readonly questionCount:number;
 readonly durationMinutes:number|null;readonly acknowledged:boolean;readonly started:boolean;
 readonly begin:AvailabilityVM;readonly error:string|null;
}
export interface SectionInstructionProps extends PresentationProps<SectionInstructionVM> {
 readonly onBeginSectionRequested:(sessionId:string,sectionIndex:number)=>CallbackResult;
 readonly onExitRequested:()=>CallbackResult;
}
export interface ExamTimerVM extends VMBase {
 readonly label:string;readonly display:string;readonly remainingSeconds:number|null;
 readonly state:'running'|'paused'|'expired'|'untimed'|'unavailable';readonly reason:string|null;
 readonly authority:'platformPolicy'|'verifiedRules';
}
export interface ExamPartVM extends VMBase {
 readonly id:string;readonly label:string;readonly skill:SkillId;readonly sectionIndex:number;
 readonly questionIds:readonly string[];readonly answered:number;readonly unanswered:number;readonly current:boolean;
}
export interface NavigatorQuestionVM {
 readonly questionId:string;readonly revision:number|null;readonly index:number;readonly number:number;
 readonly partId:string|null;readonly sectionIndex:number;readonly answered:boolean;readonly flagged:boolean;
 readonly current:boolean;readonly availability:AvailabilityVM;readonly accessibleLabel:string;
}
export interface ExamNavigatorVM extends VMBase {
 readonly sessionId:string;readonly items:readonly NavigatorQuestionVM[];readonly parts:readonly ExamPartVM[];
 readonly answered:number;readonly unanswered:number;readonly flagged:number;readonly currentIndex:number;
 readonly previous:AvailabilityVM;readonly next:AvailabilityVM;
}
export interface ExamNavigatorProps extends PresentationProps<ExamNavigatorVM> {
 readonly onNavigateRequested:(questionId:string)=>CallbackResult;
 readonly onPreviousRequested:()=>CallbackResult;readonly onNextRequested:()=>CallbackResult;
}
export interface AudioPlayerVM extends VMBase {
 readonly visual:AudioVM;readonly questionId:string;readonly assetRevision:number|null;
 /** No source URL, token or transcript; the existing media owner retains fetching/playback. */
 readonly policyLabel:string;
}
export interface AudioPlayerProps extends PresentationProps<AudioPlayerVM>,AudioCallbacks {}
export interface ImageChoiceVM extends VMBase {
 readonly id:string;readonly text:string;readonly image:QuestionImageVM|null;
 readonly selected:boolean;readonly disabled:boolean;
}
export interface MatchingGroupVM extends VMBase {
 readonly id:string;readonly revision:number|null;readonly questionIds:readonly string[];
 readonly optionBankId:string|null;readonly optionBankRevision:number|null;
 readonly options:readonly ImageChoiceVM[];
 readonly items:readonly Readonly<{id:string;text:string;selectedOptionId:string|null}>[];
 readonly uniqueOptions:boolean;
}
export interface ReadingQuestionVM extends VMBase {
 readonly passageId:string|null;readonly passageZh:string|null;readonly promptZh:string;
 readonly pinyin:string|null;readonly sentenceTokens:readonly Readonly<{id:string;text:string}>[];
}
export interface WritingQuestionVM extends VMBase {readonly editor:WritingVM}
export interface WritingQuestionProps extends PresentationProps<WritingQuestionVM> {
 readonly onInput:(questionId:string,rawValue:string)=>CallbackResult;
 readonly onCompositionStart:(questionId:string)=>CallbackResult;
 readonly onCompositionEnd:(questionId:string,rawValue:string)=>CallbackResult;
}
export interface ExplanationTabsVM extends VMBase {
 readonly questionId:string;readonly permitted:boolean;readonly feedback:FeedbackVM|null;
 readonly tabs:readonly Readonly<{id:'explanation'|'transcript'|'translation'|'vocabulary';label:string;text:string|null;wordIds:readonly string[]}>[];
}
export interface ExplanationTabsProps extends PresentationProps<ExplanationTabsVM> {
 readonly onOpenWord:(wordId:string)=>CallbackResult;readonly onOpenGrammar:(grammarId:string)=>CallbackResult;
}
export type QuestionKind = 'multiple-choice'|'true-false'|'picture-choice'|'picture-true-false'|'matching'|'shared-options'|'short-passage'|'dialogue'|'fill-blank'|'grammar-practice'|'sentence-order'|'short-answer'|'speaking';
export interface ExamQuestionVM extends VMBase {
 readonly id:string;readonly revision:number|null;readonly number:number;readonly partId:string|null;
 readonly groupId:string|null;readonly type:QuestionKind;readonly skill:SkillId;readonly instruction:string;
 readonly promptZh:string;readonly pinyin:string|null;readonly image:QuestionImageVM|null;
 readonly choices:readonly ImageChoiceVM[];readonly matching:MatchingGroupVM|null;
 readonly reading:ReadingQuestionVM|null;readonly writing:WritingQuestionVM|null;
 readonly answer:Readonly<{raw:string;complete:boolean;readOnly:boolean;flagged:boolean}>;
 readonly actions:Readonly<{canAnswer:boolean;canCheck:boolean;canFlag:boolean}>;
 readonly feedback:ExplanationTabsVM;readonly audio:AudioPlayerVM|null;
}
export interface QuestionGroupVM extends VMBase {
 readonly id:string;readonly revision:number|null;readonly questionIds:readonly string[];
 readonly sharedOptions:readonly ImageChoiceVM[];readonly currentQuestionId:string;
 readonly optionBankId:string|null;readonly optionBankRevision:number|null;
}
export interface ExamQuestionProps extends PresentationProps<ExamQuestionVM> {
 readonly onChoose:(questionId:string,optionId:string)=>CallbackResult;
 readonly onMatchingChange:(questionId:string,itemId:string,optionId:string)=>CallbackResult;
 readonly onInput:(questionId:string,rawValue:string)=>CallbackResult;
 readonly onCheckRequested:(questionId:string)=>CallbackResult;
 readonly onFlagRequested:(questionId:string)=>CallbackResult;
 readonly onRetryImage:(assetId:string)=>CallbackResult;
 readonly onCompositionStart:(questionId:string)=>CallbackResult;
 readonly onCompositionEnd:(questionId:string,rawValue:string)=>CallbackResult;
}
export interface SubmitDialogVM extends VMBase {
 readonly sessionId:string;readonly open:boolean;readonly answered:number;readonly unanswered:number;
 readonly ungraded:number;readonly busy:boolean;readonly confirm:AvailabilityVM;readonly error:string|null;
}
export interface SubmitDialogProps extends PresentationProps<SubmitDialogVM> {
 readonly onSubmitRequested:(sessionId:string)=>CallbackResult;readonly onCancel:()=>CallbackResult;
}
export interface ExamRoomVM extends VMBase {
 readonly examId:string;readonly examVersion:string;readonly sessionId:string;readonly level:LevelId;
 readonly syllabusVersion:SyllabusEdition;readonly mode:AttemptMode;
 readonly currentSkill:SkillId;readonly currentPartId:string|null;readonly currentQuestionId:string|null;
 readonly totalQuestions:number;readonly answered:number;readonly unanswered:number;readonly flagged:number;
 readonly sectionProgress:readonly Readonly<{id:string;skill:SkillId;total:number;answered:number;active:boolean}>[];
 readonly timer:ExamTimerVM;readonly navigator:ExamNavigatorVM;readonly question:ExamQuestionVM|null;
 readonly contentAvailability:AvailabilityVM;readonly mediaAvailability:AvailabilityVM;
 readonly canNavigate:boolean;readonly canSubmit:boolean;readonly saving:boolean;readonly recoveryReason:string|null;
}
export interface ExamRoomProps extends PresentationProps<ExamRoomVM> {
 readonly onNavigateRequested:(questionId:string)=>CallbackResult;
 readonly onSubmitRequested:(sessionId:string)=>CallbackResult;readonly onExitRequested:()=>CallbackResult;
}
export interface ExamResultVM extends VMBase {
 /** Reuses V13 scoring DTO; meta.contractVersion remains 13.0 inside this inherited DTO. */
 readonly result:ResultVM;readonly examId:string;readonly examVersion:string;
 readonly syllabusVersion:SyllabusEdition;readonly officialPassProbability:null;
}
export interface ExamResultProps extends PresentationProps<ExamResultVM> {
 readonly onReviewQuestion:(questionId:string)=>CallbackResult;readonly onMistakeBookRequested:()=>CallbackResult;
 readonly onRetakeRequested:()=>CallbackResult;readonly onBack:()=>CallbackResult;
}
export interface ImageChoiceProps extends PresentationProps<ImageChoiceVM> {readonly onChoose:(optionId:string)=>CallbackResult;readonly onRetryImage:(assetId:string)=>CallbackResult}
export interface MatchingGroupProps extends PresentationProps<MatchingGroupVM> {readonly onMatchingChange:(itemId:string,optionId:string)=>CallbackResult;readonly onRetryImage:(assetId:string)=>CallbackResult}
export interface QuestionGroupProps extends PresentationProps<QuestionGroupVM> {readonly onChoose:(optionId:string)=>CallbackResult;readonly onRetryImage:(assetId:string)=>CallbackResult}
export interface ReadingQuestionProps extends PresentationProps<ReadingQuestionVM> {readonly onOrderChange:(tokenIds:readonly string[])=>CallbackResult}
export interface ExamModeProps extends PresentationProps<ExamModeVM> {readonly onSelect:(mode:AttemptMode)=>CallbackResult}
export interface ExamCardProps extends PresentationProps<ExamCardVM> {readonly onOpenExam:(examId:string)=>CallbackResult;readonly onResumeAttempt:(sessionId:string)=>CallbackResult}
export type ExamTimerProps = PresentationProps<ExamTimerVM>;
export interface ExamPartProps extends PresentationProps<ExamPartVM> {readonly onOpenPartRequested:(partId:string)=>CallbackResult}

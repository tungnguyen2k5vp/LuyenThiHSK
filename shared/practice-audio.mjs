export function practiceAudioReadiness(asset,transcript){
 const blockers=[];
 if(!asset)return{available:false,blockers:['AUDIO_NOT_CREATED']};
 if(!['SYNTHETIC','TTS','LICENSED','HUMAN_RECORDED'].includes(asset.sourceType))blockers.push('SOURCE_TYPE_INVALID');
 if(!asset.provider||!asset.voice)blockers.push('VOICE_PROVENANCE_MISSING');
 if(!asset.transcript||asset.transcript!==transcript)blockers.push('TRANSCRIPT_MISMATCH');
 if(!(asset.durationMs>0&&asset.durationMs<=90000)||!asset.storageUrl||!asset.contentHash)blockers.push('MEDIA_INCOMPLETE');
 if(asset.licenseStatus!=='VERIFIED'||!asset.licenseEvidenceUrl)blockers.push('RIGHTS_NOT_VERIFIED');
 if(!['PCM_VALIDATED','BROWSER_DECODED'].includes(asset.mediaValidation?.status)&&asset.mediaValidation?.playable!==true)blockers.push('DECODE_NOT_VERIFIED');
 return{available:!blockers.length,blockers,sourceType:asset.sourceType,pronunciationStatus:asset.pronunciationReviewStatus??'BLOCKED_FOR_HUMAN_REVIEW',productionReady:false};
}

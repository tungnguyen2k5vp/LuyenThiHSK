import type {UIV13FeatureState} from '../contracts/ui-v13';
/** Presentation only. No storage key, owner, schema or answer flow changes. */
export function uiV13Feature(search:string):UIV13FeatureState {
 const enabled=new URLSearchParams(search).get('ui')==='v13';return {enabled,source:enabled?'explicitPreview':'defaultOff',contractVersion:'13.0'};
}

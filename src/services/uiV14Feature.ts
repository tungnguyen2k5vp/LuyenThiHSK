/** Private Preview defaults to V15; set ui=v14 to use the preserved fallback. */
export function uiV14Feature(search:string){
 const params=new URLSearchParams(search),selection=params.get('ui'),defaultV15=selection===null&&params.get('view')==='preview';
 const requested=['v14','v15'].includes(selection??'')||defaultV15;
 return {requested,enabled:requested,source:selection?'explicitPreview' as const:defaultV15?'defaultV15' as const:'defaultOff' as const,contractVersion:'14.0' as const};
}
export function uiV15Feature(search:string){const params=new URLSearchParams(search);return params.get('ui')==='v15'||(params.get('ui')===null&&params.get('view')==='preview');}

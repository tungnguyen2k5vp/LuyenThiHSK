import type {WritingWorkspaceProps} from '../../contracts/ui-v13';
import {WritingWorkspace} from '../../ui-v13/components/writing/WritingWorkspace';
import '../../ui-v13/styles/index.css';
import '../../styles/ui-v13-integration.css';
export default function WritingPresentation(p:WritingWorkspaceProps){return <div className="hsk-ui-v13">{p.writing.pinyinHint&&<p className="writing-pinyin">Pinyin gợi ý: <strong>{p.writing.pinyinHint}</strong></p>}<WritingWorkspace {...p} showPrompt={false}/></div>;}

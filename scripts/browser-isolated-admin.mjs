import {mkdtemp,copyFile,readFile,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {DatabaseSync} from 'node:sqlite';
import os from 'node:os';
import path from 'node:path';
export async function isolatedBrowserAdmin(token){
 const baseline=JSON.parse(await readFile('data/reports/v13/baseline.json','utf8')),runtime=await mkdtemp(path.join(os.tmpdir(),'hsk-browser-admin-'));await copyFile(path.join(baseline.backup,'hsk-content.sqlite'),path.join(runtime,'hsk-content.sqlite'));
 const socket=createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
 const child=spawn(process.execPath,['server/admin-server.mjs'],{env:{...process.env,HSK_API_PORT:String(port),HSK_RUNTIME_DIR:runtime,HSK_ADMIN_TOKEN:token,HSK_REVIEWERS_JSON:'[]',HSK_ENABLE_LOCAL_QWEN:'false',HSK_ENABLE_PAID_TTS:'false'},windowsHide:true,stdio:['ignore','ignore','pipe']});let stderr='';child.stderr.on('data',b=>stderr+=b);const base='http://127.0.0.1:'+port;
 try{const end=Date.now()+20000;while(true){try{if((await fetch(base+'/api/health')).ok)break;}catch{}if(Date.now()>end||child.exitCode!==null)throw Error('ISOLATED_ADMIN_START_FAILED '+stderr.replaceAll(token,'[REDACTED]'));await new Promise(r=>setTimeout(r,50));}}
 catch(e){child.kill();throw e;}
 return{base,runtime,mainContains(id){const db=new DatabaseSync('.runtime/hsk-content.sqlite',{readOnly:true});try{return Boolean(db.prepare('SELECT 1 FROM content WHERE id=?').get(id));}finally{db.close();}},async close(id,passed,checkedIds=[id]){child.kill();await writeFile('data/reports/v13/final/legacy-admin-isolation.json',JSON.stringify({at:new Date().toISOString(),status:passed?'PASS':'FAIL',fixtureId:id,isolatedRuntime:runtime,checkedFixtureIds:checkedIds,mainFixtureCreated:checkedIds.some(id=>this.mainContains(id)),source:'Frozen V13 baseline copied to a disposable SQLite; positive generic admin fixture is not expert approval or published learner content'},null,2));}};
}

from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import json
folder=Path('data/review-packages/v12')
members=['MO_DE_DUYET.html','README.md','reviewer-package.json','audio-review-jobs.json','decisions-template.json','revision-manifest.csv']
text=(folder/'README.md').read_text(encoding='utf-8').replace('${items.length}',str(len(json.loads((folder/'reviewer-package.json').read_text(encoding='utf-8'))['items']))).replace('V10','V12')
(folder/'README.md').write_text(text,encoding='utf-8')
target=folder/'GOI_DUYET_V12.zip'
with ZipFile(target,'w',ZIP_DEFLATED) as z:
    for name in members:
        z.write(folder/name,name)
with ZipFile(target) as z:
    assert z.testzip() is None
    assert sorted(z.namelist())==sorted(members)
print(json.dumps({'status':'PASS','members':len(members),'bytes':target.stat().st_size,'mediaEmbedded':False}))

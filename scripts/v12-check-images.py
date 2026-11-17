from pathlib import Path
from PIL import Image
import json
files=[]
for browser in ['chrome','edge']:
    for path in sorted(Path(f'docs/screenshots/v12/after-{browser}').glob('v12-*.png')):
        with Image.open(path) as im:
            im.load()
            colors=len(im.convert('RGB').resize((160,120)).getcolors(19200) or [])
            if colors <= 32:
                raise RuntimeError(f'Flat/invalid screenshot: {path}: {colors}')
            files.append({'file':path.as_posix(),'width':im.width,'height':im.height,'sampleColors':colors,'status':'PASS'})
if len(files)<40:
    raise RuntimeError(f'Missing final screenshots: {len(files)}')
report={'status':'PASS','files':files,'method':'Pillow PNG decode and >32 colors at 160x120; visual inspection recorded separately','realDevices':False}
Path('data/reports/v12/image-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':'PASS','files':len(files),'minimumColors':min(f['sampleColors'] for f in files)}))

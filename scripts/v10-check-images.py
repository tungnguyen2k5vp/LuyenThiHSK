import json,pathlib
from PIL import Image
root=pathlib.Path('.');rows=[]
for browser in ['chrome','edge']:
    manifest=json.loads((root/f'data/reports/v10/screenshots-{browser}.json').read_text(encoding='utf-8'))
    names=[r['filename'] for r in manifest]+['v10-offline-review-package.png']
    for name in names:
        p=root/f'docs/screenshots/v10/after-{browser}'/name
        with Image.open(p) as im:
            colors=im.convert('RGB').getcolors(maxcolors=16777216)
            n=len(colors) if colors else 16777217
            row={'file':str(p).replace('\\','/'),'width':im.width,'height':im.height,'uniqueColors':n,'status':'PASS' if n>32 else 'FAIL_BLANK_OR_FLAT'}
            rows.append(row)
result={'status':'PASS' if all(r['status']=='PASS' for r in rows) else 'FAIL','method':'Pillow decode and >32 unique RGB colors. Detects flat captures; not visual/human accessibility approval.','images':rows}
(root/'data/reports/v10/image-check.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({'status':result['status'],'images':len(rows),'minimumColors':min(r['uniqueColors'] for r in rows)}))
if result['status']!='PASS':raise SystemExit(1)

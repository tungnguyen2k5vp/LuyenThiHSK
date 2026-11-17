import json, pathlib
from PIL import Image
rows=[]
for browser in ['chrome','edge']:
    for p in pathlib.Path(f'docs/screenshots/v11/after-{browser}').glob('v11-*.png'):
        with Image.open(p) as im:
            colors=im.convert('RGB').getcolors(maxcolors=16777216)
            n=len(colors) if colors else 16777217
            rows.append({'file':p.as_posix(),'width':im.width,'height':im.height,'uniqueColors':n,'status':'PASS' if n>32 else 'FAIL_BLANK_OR_FLAT'})
result={'status':'PASS' if rows and all(r['status']=='PASS' for r in rows) else 'FAIL','images':rows,'method':'Pillow decode and >32 distinct RGB colors, plus representative visual inspection; not a11y certification'}
pathlib.Path('data/reports/v11/image-check.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({'status':result['status'],'images':len(rows),'minimumColors':min(r['uniqueColors'] for r in rows)}))
if result['status']!='PASS':raise SystemExit(1)

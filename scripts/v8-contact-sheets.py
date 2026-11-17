import json,pathlib
from PIL import Image,ImageDraw,ImageFont
pairs=json.loads(pathlib.Path('data/reports/v8/contact-pairs.json').read_text(encoding='utf-8'));out=pathlib.Path('docs/screenshots/v8/contact-sheets');out.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',21)
for index,pair in enumerate(pairs):
    sheet=Image.new('RGB',(1200,650),'#eaf3f1');draw=ImageDraw.Draw(sheet)
    for col,key in enumerate(['before','after']):
        x=col*600;draw.text((x+16,12),pair['name']+' | '+('V7 stored baseline' if col==0 else 'V8'),font=font,fill='#134e4a')
        if pair[key] and pathlib.Path(pair[key]).exists():
            im=Image.open(pair[key]).convert('RGB');im.thumbnail((570,580));sheet.paste(im,(x+15,55))
        else:draw.text((x+16,90),'No baseline; no fake screenshot',font=font,fill='#475569')
    sheet.save(out/f'{index+1:02}.png')
print('V8 contact sheets:',len(pairs))

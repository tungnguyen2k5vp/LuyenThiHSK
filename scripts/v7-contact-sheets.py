import json,pathlib
from PIL import Image,ImageDraw,ImageFont
pairs=json.loads(pathlib.Path('data/reports/v7/contact-pairs.json').read_text(encoding='utf8'));out=pathlib.Path('docs/screenshots/v7/contact-sheets');out.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',22)
for index,pair in enumerate(pairs):
    sheet=Image.new('RGB',(1200,505),'#eaf0ef');draw=ImageDraw.Draw(sheet)
    for col,key in enumerate(['before','after']):
        x=col*600;draw.text((x+20,12),pair['name']+' | '+('V6 baseline' if col==0 else 'V7'),font=font,fill='#134e4a')
        if pair[key] and pathlib.Path(pair[key]).exists():
            img=Image.open(pair[key]).convert('RGB');img.thumbnail((570,450));sheet.paste(img,(x+15,50))
        else: draw.text((x+20,100),'Not available in V6',font=font,fill='#475569')
    sheet.save(out/f'{index+1:02}.png')
print('Contact sheets:',len(pairs))

import pathlib,sys
sys.path.insert(0,str(pathlib.Path('.tmp/v7-pdf-tools').resolve()))
import pymupdf
from PIL import Image,ImageDraw
root=pathlib.Path('.runtime/references/v7');files=sorted(root.glob('hsk2-page-*.png'));canvas=Image.new('RGB',(1000,220*5),'#eeeeee');draw=ImageDraw.Draw(canvas)
for i,p in enumerate(files):
    im=Image.open(p);im.thumbnail((245,195));x=(i%4)*250;y=(i//4)*220;canvas.paste(im,(x,y+22));draw.text((x+5,y+3),p.stem,fill='black')
canvas.save(root/'hsk2-contact.png')
doc=pymupdf.open(root/'cti-hsk2-sample-1.pdf')
for i,p in enumerate(doc):print(i+1,repr(p.get_text()[:95]))

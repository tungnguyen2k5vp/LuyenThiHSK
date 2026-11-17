import sys,pathlib,json
sys.path.insert(0,str(pathlib.Path('.tmp/v7-pdf-tools').resolve()))
import pymupdf
root=pathlib.Path('.runtime/references/v7'); output=[]
for p in sorted(root.glob('cti-hsk2-sample-*.pdf')):
    doc=pymupdf.open(p); parts=[]
    for i,page in enumerate(doc):
        parts.append(f'\n=== PDF PAGE {i+1} ===\n'+page.get_text())
        if 'sample-1' in p.name: page.get_pixmap(matrix=pymupdf.Matrix(.8,.8)).save(root/f'hsk2-page-{i+1:02}.png')
    p.with_suffix('.txt').write_text(''.join(parts),encoding='utf8');output.append({'file':p.name,'pages':len(doc)})
print(json.dumps(output))

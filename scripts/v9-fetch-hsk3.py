"""Inspect only CTI-linked HSK3 PDF references; never import copyrighted questions."""
import io,json,pathlib,urllib.request,zipfile,hashlib,sys
URL='https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip'
out=pathlib.Path('.runtime/references/v9');out.mkdir(parents=True,exist_ok=True)
class Remote(io.RawIOBase):
    def __init__(self):
        self.pos=0;self.downloaded=0
        with urllib.request.urlopen(urllib.request.Request(URL,method='HEAD'),timeout=30) as r:self.size=int(r.headers['Content-Length'])
    def readable(self):return True
    def seekable(self):return True
    def tell(self):return self.pos
    def seek(self,offset,whence=0):
        self.pos=offset if whence==0 else self.pos+offset if whence==1 else self.size+offset;return self.pos
    def read(self,n=-1):
        if n<0:n=self.size-self.pos
        if n==0 or self.pos>=self.size:return b''
        n=min(n,self.size-self.pos)
        if self.downloaded+n>5_000_000:raise ValueError('5 MB cap exceeded')
        req=urllib.request.Request(URL,headers={'Range':f'bytes={self.pos}-{self.pos+n-1}'})
        with urllib.request.urlopen(req,timeout=45) as r:
            if r.status!=206:raise ValueError('HTTP Range required')
            data=r.read(n)
        self.pos+=len(data);self.downloaded+=len(data);return data
remote=Remote();evidence=[]
with zipfile.ZipFile(remote) as archive:
    for item in archive.infolist():
        name=item.filename
        if not item.flag_bits&0x800:
            try:name=name.encode('cp437').decode('gb18030')
            except UnicodeError:pass
        if name.startswith('HSK/') and '三级' in name and name.endswith('.pdf'):
            data=archive.read(item);target=out/f'cti-hsk3-reference-{len(evidence)+1}.pdf';target.write_bytes(data)
            evidence.append({'archiveMember':name,'localPath':str(target),'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)})
sys.path.insert(0,str(pathlib.Path('.tmp/v7-pdf-tools').resolve()))
import pymupdf
for row in evidence:
    p=pathlib.Path(row['localPath']);doc=pymupdf.open(p);row['pages']=len(doc)
    p.with_suffix('.txt').write_text('\n'.join(f'\n=== PAGE {i+1} ===\n'+page.get_text() for i,page in enumerate(doc)),encoding='utf8')
    if row is evidence[0]:doc[0].get_pixmap(matrix=pymupdf.Matrix(1,1)).save(out/'hsk3-cover.png')
(out/'hsk3-reference-evidence.json').write_text(json.dumps({'sourcePage':'https://www.chinesetest.cn/syllabus','archive':URL,'bytesDownloaded':remote.downloaded,'pdfs':evidence},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'pdfs':len(evidence),'downloaded':remote.downloaded}))

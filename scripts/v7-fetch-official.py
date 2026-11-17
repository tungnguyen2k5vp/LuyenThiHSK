"""Read only the CTI-linked ZIP directory and selected HSK2 PDF, never import questions."""
import io, json, pathlib, sys, urllib.request, zipfile, hashlib
URL='https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip'
out=pathlib.Path('.runtime/references/v7');out.mkdir(parents=True, exist_ok=True)
class Remote(io.RawIOBase):
    def __init__(self):
        self.pos=0; self.bytes_read=0
        with urllib.request.urlopen(urllib.request.Request(URL,method='HEAD'),timeout=30) as r:
            self.size=int(r.headers['Content-Length'])
    def readable(self): return True
    def seekable(self): return True
    def tell(self): return self.pos
    def seek(self, offset, whence=0):
        self.pos=offset if whence==0 else self.pos+offset if whence==1 else self.size+offset
        return self.pos
    def read(self,n=-1):
        if n<0: n=self.size-self.pos
        if n==0 or self.pos>=self.size: return b''
        n=min(n,self.size-self.pos)
        if self.bytes_read+n>25_000_000: raise ValueError('Reference download cap exceeded')
        req=urllib.request.Request(URL,headers={'Range':f'bytes={self.pos}-{self.pos+n-1}'})
        with urllib.request.urlopen(req,timeout=45) as r:
            if r.status!=206: raise ValueError('Server did not honor Range; refusing full ZIP download')
            data=r.read(n)
        self.pos+=len(data);self.bytes_read+=len(data);return data
remote=Remote()
with zipfile.ZipFile(remote) as archive:
    rows=[]
    for item in archive.infolist():
        name=item.filename
        if not item.flag_bits & 0x800:
            try: name=name.encode('cp437').decode('gb18030')
            except (UnicodeError,LookupError): pass
        rows.append({'name':name,'zipName':item.filename,'bytes':item.file_size,'compressed':item.compress_size})
    (out/'cti-sample-index.json').write_text(json.dumps({'url':URL,'bytes':remote.size,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
    if '--pdf' in sys.argv:
        selected=[r for r in rows if r['name'].lower().endswith('.pdf') and ('二级' in r['name'] or 'HSK2' in r['name'].replace(' ',''))]
        for i,row in enumerate(selected):
            data=archive.read(row['zipName']);target=out/f'cti-hsk2-sample-{i+1}.pdf';target.write_bytes(data)
            row['localPath']=str(target);row['sha256']=hashlib.sha256(data).hexdigest()
        (out/'cti-hsk2-pdf-evidence.json').write_text(json.dumps(selected,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps({'bytesRead':remote.bytes_read,'entries':rows},ensure_ascii=True))


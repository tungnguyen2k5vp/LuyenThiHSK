import pathlib, zipfile, json
root=pathlib.Path('data/review-packages/v11')
out=root/'V11_REVIEW_OFFLINE.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for p in root.iterdir():
        if p.suffix in ['.json','.html','.md']:z.write(p,p.name)
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    assert all(not pathlib.PurePosixPath(n).is_absolute() and '..' not in pathlib.PurePosixPath(n).parts for n in z.namelist())
    names=z.namelist()
report={'status':'PASS','zip':out.as_posix(),'bytes':out.stat().st_size,'files':names,'crc':'PASS','containsMedia':False}
pathlib.Path('data/reports/v11/zip-check.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'status':'PASS','bytes':out.stat().st_size,'files':len(names)}))

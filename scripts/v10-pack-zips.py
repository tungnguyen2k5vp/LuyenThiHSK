import pathlib,zipfile,json
root=pathlib.Path('.').resolve();review=root/'data/review-packages/v10';review_zip=review/'HSK_CONTENT_REVIEW_V10.zip'
with zipfile.ZipFile(review_zip,'w',zipfile.ZIP_DEFLATED,compresslevel=7) as z:
    for p in review.rglob('*'):
        if p.is_file() and p.suffix!='.zip':z.write(p,p.relative_to(review).as_posix())
shots_zip=root/'data/reports/v10/V10_SCREENSHOTS_BEFORE_AFTER.zip'
manifest=json.loads((root/'data/reports/v10/screenshot-manifest.json').read_text(encoding='utf-8'))
with zipfile.ZipFile(shots_zip,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for item in manifest['items']:
        p=root/item['path'];z.write(p,item['path'])
    z.write(root/'data/reports/v10/screenshot-manifest.json','screenshot-manifest.json')
    z.writestr('README.txt','Actual Chrome/Edge screenshots, isolated QA learner state. Mobile is viewport emulation, not real device. Before and after differ in learner/scroll/content state. No human approval or production claim.')
checks=[]
for p in [review_zip,shots_zip]:
    with zipfile.ZipFile(p) as z:
        names=z.namelist();assert z.testzip() is None;assert all(not n.startswith('/') and '..' not in pathlib.PurePosixPath(n).parts for n in names)
        assert all(pathlib.PurePosixPath(n).suffix not in ['.sqlite','.wav','.mp3','.pdf'] for n in names)
        checks.append({'file':p.relative_to(root).as_posix(),'entries':len(names),'bytes':p.stat().st_size,'crc':'PASS','safePaths':True})
(root/'data/reports/v10/zip-check.json').write_text(json.dumps({'status':'PASS','files':checks},indent=2),encoding='utf-8');print(json.dumps(checks))

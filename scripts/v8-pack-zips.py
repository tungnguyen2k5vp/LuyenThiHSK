import pathlib,zipfile,json
root=pathlib.Path('.').resolve();review=root/'data/review-packages/v8';review_zip=review/'HSK1_CONTENT_REVIEW_V8.zip'
files=[p for p in review.rglob('*') if p.is_file() and p.suffix.lower()!='.zip']
with zipfile.ZipFile(review_zip,'w',zipfile.ZIP_DEFLATED,compresslevel=7) as z:
    for p in files:z.write(p,p.relative_to(review).as_posix())
shots=root/'docs/screenshots/v8';shot_zip=root/'data/reports/v8/V8_SCREENSHOTS_BEFORE_AFTER.zip'
with zipfile.ZipFile(shot_zip,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in shots.rglob('*'):
        if p.is_file():z.write(p,p.relative_to(root).as_posix())
    for name in ['screenshot-manifest.json','screenshot-checklist.json','contact-pairs.json']:
        p=root/'data/reports/v8'/name;z.write(p,p.relative_to(root).as_posix())
    z.writestr('README.txt','V8 private local screenshots. V7 before images are retained baseline, not recaptured. Required48 screens are indexed in screenshot-checklist.json. Raw regression/failure/QA asset contact-sheet files may also be included for debugging; they are not curated product screens. Empty/account/reviewer editing fixtures are explicitly labeled; no human review or production claim. No CTI source PDF or audio binary is included.')
checks=[]
for p in [review_zip,shot_zip]:
    with zipfile.ZipFile(p) as z:
        bad=z.testzip();names=z.namelist();assert bad is None;assert all(not n.startswith('/') and '..' not in pathlib.PurePosixPath(n).parts for n in names)
        checks.append({'file':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'entries':len(names),'status':'PASS_CRC_AND_PATHS'})
(root/'data/reports/v8/zip-check.json').write_text(json.dumps(checks,indent=2),encoding='utf-8');print(json.dumps(checks))

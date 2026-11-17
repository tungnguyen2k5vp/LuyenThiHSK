import pathlib,zipfile
base=pathlib.Path('.').resolve();reports=base/'data/reports/v7'
jobs=[(base/'docs/screenshots/v7',reports/'V7_SCREENSHOTS_BEFORE_AFTER.zip'),(base/'data/review-packages/v7',reports/'HSK1_REVIEWER_V7.zip')]
for source,target in jobs:
    if not source.resolve().is_relative_to(base) or not target.resolve().is_relative_to(base): raise RuntimeError('Outside project')
    with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for p in source.rglob('*'):
            if p.is_file(): z.write(p,p.relative_to(source.parent))
    print(target.name,target.stat().st_size)

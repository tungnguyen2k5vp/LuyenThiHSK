import pathlib,zipfile,json
root=pathlib.Path('.').resolve();folder=root/'data/review-packages/v9';target=folder/'HSK_CONTENT_REVIEW_V9.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=7) as z:
    for p in sorted(folder.rglob('*')):
        if p.is_file() and p.suffix.lower()!='.zip':z.write(p,p.relative_to(folder).as_posix())
with zipfile.ZipFile(target) as z:
    assert z.testzip() is None
    assert all('..' not in pathlib.PurePosixPath(n).parts and not n.startswith('/') for n in z.namelist())
    report={'path':str(target.relative_to(root)),'entries':len(z.namelist()),'bytes':target.stat().st_size,'crc':'PASS','safePaths':True}
(root/'data/reports/v9/zip-check.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))

import zipfile,json,pathlib
reports=[]
for name in ['V7_SCREENSHOTS_BEFORE_AFTER.zip','HSK1_REVIEWER_V7.zip']:
    p=pathlib.Path('data/reports/v7')/name
    with zipfile.ZipFile(p) as z:
        bad=z.testzip()
        if bad: raise RuntimeError('ZIP checksum failed: '+bad)
        reports.append({'file':str(p),'entries':len(z.infolist()),'bytes':p.stat().st_size,'status':'PASS'})
pathlib.Path('data/reports/v7/zip-check.json').write_text(json.dumps(reports,indent=2),encoding='utf8');print(json.dumps(reports))
